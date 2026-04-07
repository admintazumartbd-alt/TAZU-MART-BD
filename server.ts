import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import multer from "multer";

import { 
  CATEGORIES as MOCK_CATEGORIES, 
  MOCK_PRODUCTS as GENERATED_MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_ORDERS
} from "./src/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));

// Initialize without explicit projectId to let it pick up environment defaults.
const app_admin = !admin.apps.length ? admin.initializeApp() : admin.app();

console.log("Firebase Admin initialized with environment defaults.");

let db: admin.firestore.Firestore;
const configDatabaseId = firebaseConfig.firestoreDatabaseId;
let isFirestoreAvailable = true;

try {
  // Always try to initialize with (default) if the config one is likely from a remix
  // or just try the config one and fallback.
  if (configDatabaseId && configDatabaseId !== "(default)") {
    db = getFirestore(app_admin, configDatabaseId);
    console.log(`Attempting to use database: ${configDatabaseId}`);
  } else {
    db = getFirestore(app_admin);
    console.log("Using (default) database");
  }
} catch (error) {
  console.warn(`Failed to initialize database, falling back to (default):`, error);
  db = getFirestore(app_admin);
}

const settingsRef = db.collection("settings").doc("store");

// Mock Data Fallback
let MOCK_PRODUCTS_STATE = [...GENERATED_MOCK_PRODUCTS];
let MOCK_ORDERS_STATE = [...MOCK_ORDERS];
let MOCK_CUSTOMERS_STATE = [...MOCK_CUSTOMERS];
let MOCK_CATEGORIES_STATE = [...MOCK_CATEGORIES];

// Stock Reservation Map (In-memory for 3 minutes)
const stockReservations = new Map<string, { productId: string; quantity: number; expiresAt: number }>();

// Cleanup expired reservations every minute
setInterval(() => {
  const now = Date.now();
  for (const [id, reservation] of stockReservations.entries()) {
    if (reservation.expiresAt < now) {
      stockReservations.delete(id);
      console.log(`Reservation ${id} expired for product ${reservation.productId}`);
    }
  }
}, 60000);

// Ensure uploads and backups directories exist
const uploadsDir = path.join(__dirname, "uploads", "products");
const backupsDir = path.join(__dirname, "backups");

[uploadsDir, backupsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Daily Auto Backup System
async function performAutoBackup() {
  try {
    console.log("Starting scheduled auto-backup...");
    let products = [];
    if (isFirestoreAvailable) {
      const snapshot = await db.collection("products").get();
      products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      products = MOCK_PRODUCTS_STATE;
    }
    
    const backupData = {
      timestamp: new Date().toISOString(),
      type: "AUTO_BACKUP",
      data: {
        products,
        categories: MOCK_CATEGORIES_STATE,
        customers: MOCK_CUSTOMERS_STATE,
        orders: MOCK_ORDERS_STATE
      }
    };
    
    const fileName = `auto-backup-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(path.join(backupsDir, fileName), JSON.stringify(backupData, null, 2));
    console.log(`Auto backup successful: ${fileName}`);
  } catch (error) {
    console.error("Auto backup failed:", error);
  }
}

// Run backup every 24 hours
setInterval(performAutoBackup, 24 * 60 * 60 * 1000);
// Initial backup after 1 minute of startup
setTimeout(performAutoBackup, 60000);

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy is required for rate limiting behind a proxy
  app.set("trust proxy", 1);

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // High Traffic Protection Middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: async (req, res, next, options) => {
      try {
        const settings = await settingsRef.get();
        const highTrafficMode = settings.exists ? (settings.data()?.highTrafficMode || false) : false;
        if (highTrafficMode) {
          res.status(429).json({ error: "High traffic detected. Please try again in a few minutes." });
        } else {
          res.status(options.statusCode).send(options.message);
        }
      } catch (error) {
        console.error("Rate limit handler error:", error);
        res.status(options.statusCode).send(options.message);
      }
    },
  });

  app.use("/api/", limiter);

  // API routes FIRST
  app.get("/api/health", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const settings = await settingsRef.get();
      res.json({ 
        status: "ok", 
        firestore: "connected", 
        settingsExists: settings.exists,
        databaseId: firebaseConfig.firestoreDatabaseId
      });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore health check failed.");
        isFirestoreAvailable = false;
      }
      res.json({ 
        status: "ok", 
        firestore: "mock_mode", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // 1. Stock Reservation & Checkout Initiation
  app.post("/api/checkout/initiate", async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
      if (isFirestoreAvailable) {
        const productRef = db.collection("products").doc(productId);
        const productDoc = await productRef.get();

        if (productDoc.exists) {
          const productData = productDoc.data();
          const currentStock = productData?.stock || 0;

          // Check available stock (including reservations)
          let reservedStock = 0;
          for (const resv of stockReservations.values()) {
            if (resv.productId === productId) {
              reservedStock += resv.quantity;
            }
          }

          if (currentStock - reservedStock < quantity) {
            return res.status(400).json({ error: "Insufficient stock available" });
          }
        }
      }

      // Create reservation (works in both Firestore and Mock mode)
      const reservationId = uuidv4();
      stockReservations.set(reservationId, {
        productId,
        quantity,
        expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
      });

      res.json({ reservationId, expiresAt: stockReservations.get(reservationId)?.expiresAt });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore checkout initiation failed.");
        isFirestoreAvailable = false;
      }
      
      const reservationId = uuidv4();
      stockReservations.set(reservationId, {
        productId,
        quantity,
        expiresAt: Date.now() + 3 * 60 * 1000,
      });
      res.json({ reservationId, expiresAt: stockReservations.get(reservationId)?.expiresAt });
    }
  });

  // 2. bKash Payment Integration (Mocked for now, but structured for real API)
  app.post("/api/payment/bkash/create", async (req, res) => {
    const { orderId, amount, reservationId } = req.body;
    
    try {
      // Real bKash API call would go here
      // const response = await axios.post(BKASH_CREATE_URL, { ... });
      
      // Mock response
      const paymentID = "BK" + uuidv4().substring(0, 8).toUpperCase();
      const bkashURL = `https://bkash-gateway-mock.com/pay/${paymentID}`;
      
      res.json({ paymentID, bkashURL });
    } catch (error) {
      res.status(500).json({ error: "bKash payment creation failed" });
    }
  });

  // 3. Nagad Payment Integration (Mocked)
  app.post("/api/payment/nagad/create", async (req, res) => {
    const { orderId, amount } = req.body;
    res.json({ paymentURL: `https://nagad-gateway-mock.com/pay/${uuidv4()}` });
  });

  // 4. Order Creation (COD or after payment success)
  app.post("/api/orders/create", async (req, res) => {
    const { customer, items, subtotal, deliveryFee, total, paymentMethod, reservationId } = req.body;
    
    try {
      if (isFirestoreAvailable) {
        // Final stock check and update
        const batch = db.batch();
        for (const item of items) {
          const productRef = db.collection("products").doc(item.productId);
          batch.update(productRef, {
            stock: admin.firestore.FieldValue.increment(-item.quantity),
            soldCount: admin.firestore.FieldValue.increment(item.quantity)
          });
        }

        const orderNumber = "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
        const orderId = uuidv4();
        const orderRef = db.collection("orders").doc(orderId);
        
        const orderData = {
          id: orderId,
          orderNumber,
          userId: req.body.userId || null,
          customer,
          items,
          subtotal,
          deliveryFee,
          total,
          profit: items.reduce((acc: number, item: any) => acc + ((item.price - (item.buyingPrice || 0)) * item.quantity), 0),
          status: "PENDING",
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
          createdAt: new Date().toISOString(),
          deviceIp: req.ip,
          userAgent: req.headers["user-agent"],
        };

        batch.set(orderRef, orderData);
        await batch.commit();

        if (reservationId) {
          stockReservations.delete(reservationId);
        }

        return res.json({ success: true, orderId, orderNumber });
      }

      throw new Error("Firestore unavailable");
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore order creation failed.");
        isFirestoreAvailable = false;
      }
      
      const orderNumber = "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      const orderId = uuidv4();
      
      if (reservationId) {
        stockReservations.delete(reservationId);
      }

      // Add to mock state so it can be fetched later
      const mockOrder = {
        id: orderId,
        orderNumber,
        userId: req.body.userId || null,
        customer,
        items,
        subtotal,
        deliveryFee,
        total,
        profit: items.reduce((acc: number, item: any) => acc + ((item.price - (item.buyingPrice || 0)) * item.quantity), 0),
        status: "PENDING",
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        createdAt: new Date().toISOString(),
        deviceIp: req.ip,
        userAgent: req.headers["user-agent"],
        mock: true
      };
      MOCK_ORDERS_STATE.unshift(mockOrder);

      res.json({ success: true, orderId, orderNumber, mock: true });
    }
  });

  // Admin: Get all orders
  app.get("/api/admin/orders", async (req, res) => {
    const { userId } = req.query;
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      let query: any = db.collection("orders").orderBy("createdAt", "desc");
      if (userId) {
        query = query.where("userId", "==", userId);
      }
      const snapshot = await query.get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(orders);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin orders fetch failed.");
        isFirestoreAvailable = false;
      }
      if (userId) {
        res.json(MOCK_ORDERS_STATE.filter(o => o.userId === userId));
      } else {
        res.json(MOCK_ORDERS_STATE);
      }
    }
  });

  // Admin: Update order status
  app.post("/api/admin/orders/:id/status", async (req, res) => {
    const { status, courierName, trackingId, estimatedDelivery } = req.body;
    try {
      const orderId = req.params.id;
      const historyEntry = {
        status,
        date: new Date().toISOString(),
        note: `Order status updated to ${status} by admin.`
      };

      if (isFirestoreAvailable) {
        const orderRef = db.collection("orders").doc(orderId);
        const orderDoc = await orderRef.get();
        
        if (orderDoc.exists) {
          const history = orderDoc.data()?.history || [];
          history.push(historyEntry);
          const updateData: any = { status, history, updatedAt: new Date().toISOString() };
          if (courierName) updateData.courierName = courierName;
          if (trackingId) updateData.trackingId = trackingId;
          if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
          
          await orderRef.update(updateData);
          return res.json({ success: true });
        }
      }

      // Mock fallback
      const order = MOCK_ORDERS_STATE.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.history = order.history || [];
        order.history.push(historyEntry);
        return res.json({ success: true, mock: true });
      }

      res.status(404).json({ error: "Order not found" });
    } catch (error) {
      console.error("Order status update error:", error);
      if (isFirestoreAvailable) {
        console.warn("Firestore order status update failed, switching to mock mode.");
        isFirestoreAvailable = false;
        
        // Retry in mock mode
        const order = MOCK_ORDERS_STATE.find(o => o.id === req.params.id);
        if (order) {
          order.status = status;
          return res.json({ success: true, mock: true });
        }
      }
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Order Tracking (Public)
  app.get("/api/orders/track", async (req, res) => {
    const { orderId, phone } = req.query;
    try {
      if (isFirestoreAvailable) {
        let query: any = db.collection("orders");
        if (orderId) {
          const doc = await query.doc(orderId).get();
          if (doc.exists) {
            const order = { id: doc.id, ...doc.data() };
            if (!phone || order.customer.phone === phone) {
              return res.json(order);
            }
          }
        } else if (phone) {
          const snapshot = await query.where("customer.phone", "==", phone).orderBy("createdAt", "desc").limit(1).get();
          if (!snapshot.empty) {
            return res.json({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
          }
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const order = MOCK_ORDERS_STATE.find(o => 
        (orderId && (o.id === orderId || o.orderNumber === orderId)) || 
        (phone && o.customer.phone === phone)
      );
      if (order) return res.json(order);
      
      res.status(404).json({ error: "Order not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to track order" });
    }
  });

  // Admin: Profit Dashboard Stats
  app.get("/api/admin/profit-stats", async (req, res) => {
    try {
      let orders = [];
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("orders").get();
        orders = snapshot.docs.map(doc => doc.data());
      } else {
        orders = MOCK_ORDERS_STATE;
      }

      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
      
      const stats = {
        todaySales: todayOrders.reduce((acc, o) => acc + o.total, 0),
        todayProfit: todayOrders.reduce((acc, o) => acc + (o.profit || 0), 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
        returnedOrders: orders.filter(o => o.status === 'RETURNED').length,
        salesData: orders.reduce((acc: any, o) => {
          const date = o.createdAt.split('T')[0];
          acc[date] = (acc[date] || 0) + o.total;
          return acc;
        }, {})
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profit stats" });
    }
  });

  // Admin: Customer Insights
  app.get("/api/admin/customer-insights", async (req, res) => {
    try {
      let customers = [];
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("users").where("role", "==", "CUSTOMER").get();
        customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        customers = MOCK_CUSTOMERS_STATE;
      }

      const insights = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.status === 'ACTIVE').length,
        newCustomers: customers.filter(c => {
          const created = new Date(c.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return created > monthAgo;
        }).length,
        repeatCustomers: customers.filter(c => (c.totalOrders || 0) > 1).length,
        topCustomers: [...customers].sort((a, b) => (b.totalSpending || 0) - (a.totalSpending || 0)).slice(0, 5),
        locationStats: customers.reduce((acc: any, c) => {
          const loc = c.location || 'Unknown';
          acc[loc] = (acc[loc] || 0) + 1;
          return acc;
        }, {})
      };

      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer insights" });
    }
  });

  // Admin: Fraud Check
  app.post("/api/admin/fraud-check", async (req, res) => {
    const { phone } = req.body;
    try {
      let orders = [];
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("orders").where("customer.phone", "==", phone).get();
        orders = snapshot.docs.map(doc => doc.data());
      } else {
        orders = MOCK_ORDERS_STATE.filter(o => o.customer.phone === phone);
      }

      const fraudData = {
        totalOrders: orders.length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
        returned: orders.filter(o => o.status === 'RETURNED').length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        courierStats: {
          totalParcels: orders.length,
          delivered: orders.filter(o => o.status === 'DELIVERED').length,
          returned: orders.filter(o => o.status === 'RETURNED').length,
          cancelled: orders.filter(o => o.status === 'CANCELLED').length,
        }
      };

      res.json(fraudData);
    } catch (error) {
      res.status(500).json({ error: "Failed to perform fraud check" });
    }
  });

  // Admin: Abandoned Carts
  app.get("/api/admin/abandoned-carts", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("abandoned_carts").orderBy("cartTime", "desc").get();
        const carts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(carts);
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch abandoned carts" });
    }
  });

  app.get("/api/admin/customers/:id", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const doc = await db.collection("customers").doc(req.params.id).get();
        if (doc.exists) {
          return res.json({ id: doc.id, ...doc.data() });
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const mock = MOCK_CUSTOMERS_STATE.find(c => c.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Customer not found" });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin customer fetch failed.");
        isFirestoreAvailable = false;
      }
      const mock = MOCK_CUSTOMERS_STATE.find(c => c.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Customer not found" });
    }
  });

  // 5. Invoice Generation (PDF)
  // 5. Invoice Generation (PDF)
  app.get("/api/orders/:id/invoice", async (req, res) => {
    const orderId = req.params.id;
    let order: any = null;

    try {
      if (isFirestoreAvailable) {
        const orderDoc = await db.collection("orders").doc(orderId).get();
        if (orderDoc.exists) {
          order = { id: orderDoc.id, ...orderDoc.data() };
        }
      }
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore invoice data fetch failed.");
        isFirestoreAvailable = false;
      }
    }

    if (!order) {
      order = MOCK_ORDERS_STATE.find(o => o.id === orderId);
    }

    if (!order) {
      return res.status(404).send("Order not found");
    }

    const doc = new PDFDocument({ 
      margin: 20, 
      size: 'A4',
      info: {
        Title: `Invoice - ${order.orderNumber || order.id}`,
        Author: 'Tazu Mart BD'
      }
    });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${orderId}.pdf`);
    
    doc.pipe(res);
    
    // Header Section
    const headerY = 40;
    doc.fillColor("#111111").fontSize(20).font("Helvetica-Bold").text("TAZU MART BD", 40, headerY);
    doc.fillColor("#444444").fontSize(10).font("Helvetica").text("Phone: 01834800916", 40, headerY + 25);
    doc.text("Website: www.tazumartbd.com", 40, headerY + 40);
    
    // Right side header
    doc.fillColor("#111111").fontSize(10).font("Helvetica-Bold").text("INVOICE NO:", 400, headerY, { align: 'right', width: 150 });
    doc.font("Helvetica").text(order.orderNumber || order.id.slice(0, 8), 400, headerY + 15, { align: 'right', width: 150 });
    
    doc.font("Helvetica-Bold").text("ORDER DATE:", 400, headerY + 35, { align: 'right', width: 150 });
    doc.font("Helvetica").text(new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(), 400, headerY + 50, { align: 'right', width: 150 });
    
    doc.moveDown(4);
    
    // Customer Information
    const customerY = doc.y;
    doc.fillColor("#111111").fontSize(12).font("Helvetica-Bold").text("CUSTOMER INFORMATION", 40, customerY);
    doc.moveTo(40, customerY + 15).lineTo(250, customerY + 15).strokeColor("#EEEEEE").stroke();
    
    doc.moveDown(1);
    doc.fontSize(10).font("Helvetica").fillColor("#444444");
    doc.text(`Name: ${order.customer?.name || order.customer?.fullName}`, 40);
    doc.text(`Phone: ${order.customer?.phone}`, 40);
    
    let fullAddress = order.customer?.address || "";
    if (order.customer?.upazila) fullAddress += `, ${order.customer.upazila}`;
    if (order.customer?.district) fullAddress += `, ${order.customer.district}`;
    if (order.customer?.division) fullAddress += `, ${order.customer.division}`;
    doc.text(`Address: ${fullAddress}`, 40, doc.y, { width: 250 });
    
    doc.moveDown(3);
    
    // Product Table
    doc.fillColor("#111111").fontSize(12).font("Helvetica-Bold").text("PRODUCT DETAILS", 40);
    doc.moveDown(0.5);
    
    // Table Header
    const tableHeaderY = doc.y;
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#111111");
    doc.text("IMG", 40, tableHeaderY, { width: 30, align: "center" });
    doc.text("PRODUCT NAME", 80, tableHeaderY);
    doc.text("QTY", 320, tableHeaderY, { width: 40, align: "center" });
    doc.text("PRICE", 370, tableHeaderY, { width: 80, align: "right" });
    doc.text("TOTAL", 460, tableHeaderY, { width: 95, align: "right" });
    
    doc.moveTo(40, doc.y + 5).lineTo(555, doc.y + 5).strokeColor("#111111").lineWidth(0.5).stroke();
    doc.moveDown(1.5);
    
    // Table Rows
    doc.font("Helvetica").fontSize(9).fillColor("#444444");
    
    for (const item of order.items) {
      const currentY = doc.y;
      
      // Try to fetch and add product image
      if (item.image) {
        try {
          const imageResponse = await axios.get(item.image, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(imageResponse.data, 'binary');
          doc.image(imageBuffer, 40, currentY, { width: 30, height: 30 });
        } catch (e) {
          // If image fails, just skip or draw a placeholder
          doc.rect(40, currentY, 30, 30).strokeColor("#EEEEEE").stroke();
        }
      } else {
        doc.rect(40, currentY, 30, 30).strokeColor("#EEEEEE").stroke();
      }

      // Product Name (shifted right to make room for image)
      doc.text(item.name, 80, currentY, { width: 220 });
      
      doc.text(item.quantity.toString(), 320, currentY, { width: 40, align: "center" });
      doc.text(`BDT ${item.price.toLocaleString()}`, 370, currentY, { width: 80, align: "right" });
      doc.text(`BDT ${(item.price * item.quantity).toLocaleString()}`, 460, currentY, { width: 95, align: "right" });
      
      doc.moveDown(2);
      
      // Add a light line between items
      doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#F5F5F5").stroke();
      doc.moveDown(0.5);
    }
    
    doc.moveDown(1);
    
    // Summary Section
    const summaryY = doc.y;
    doc.fontSize(10).fillColor("#666666");
    doc.text("Subtotal:", 350, summaryY, { width: 100, align: "right" });
    doc.fillColor("#111111").text(`BDT ${order.subtotal.toLocaleString()}`, 460, summaryY, { width: 95, align: "right" });
    
    doc.moveDown(0.5);
    doc.fillColor("#666666").text("Shipping Fee:", 350, doc.y, { width: 100, align: "right" });
    doc.fillColor("#111111").text(`BDT ${order.deliveryFee.toLocaleString()}`, 460, doc.y - 10, { width: 95, align: "right" });
    
    doc.moveDown(1);
    doc.rect(350, doc.y, 205, 30).fill("#F9F9F9");
    doc.fillColor("#FF6A00").fontSize(12).font("Helvetica-Bold");
    doc.text("GRAND TOTAL:", 360, doc.y - 22, { width: 100, align: "left" });
    doc.text(`BDT ${order.total.toLocaleString()}`, 460, doc.y - 12, { width: 95, align: "right" });
    
    // Footer
    doc.fillColor("#999999").fontSize(8).font("Helvetica").text("This is a computer generated invoice. No signature required.", 40, 780, { align: "center", width: 515 });
    doc.text("Thank you for shopping with Tazu Mart BD!", { align: "center", width: 515 });
    
    doc.end();
  });

  // 6. Admin Settings API
  app.get("/api/admin/settings", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const doc = await settingsRef.get();
      res.json(doc.data() || {});
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin settings fetch failed.");
        isFirestoreAvailable = false;
      }
      res.json({});
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      await settingsRef.set(req.body, { merge: true });
      res.json({ success: true });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin settings update failed.");
        isFirestoreAvailable = false;
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Category Management API
  app.get("/api/categories", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const snapshot = await db.collection("categories").orderBy("order", "asc").get();
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(MOCK_CATEGORIES_STATE);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore categories fetch failed, switching to mock data fallback.");
        isFirestoreAvailable = false;
      }
      res.json(MOCK_CATEGORIES_STATE);
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const categoryData = req.body;
      const categoryRef = db.collection("categories").doc(categoryData.id || uuidv4());
      await categoryRef.set({
        ...categoryData,
        id: categoryRef.id,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      res.json({ success: true, id: categoryRef.id });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore category update failed.");
        isFirestoreAvailable = false;
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      await db.collection("categories").doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore category delete failed.");
        isFirestoreAvailable = false;
      }
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.post("/api/admin/categories/reorder", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const { orders } = req.body; // Array of { id: string, order: number }
      const batch = db.batch();
      orders.forEach((item: any) => {
        const ref = db.collection("categories").doc(item.id);
        batch.update(ref, { order: item.order });
      });
      await batch.commit();
      res.json({ success: true });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore category reorder failed.");
        isFirestoreAvailable = false;
      }
      res.status(500).json({ error: "Failed to reorder categories" });
    }
  });

  app.get("/api/price-settings", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const doc = await settingsRef.get();
      const settings = doc.data() || {};
      const priceSettings = settings.priceSettings || {
        minPrice: 500,
        maxPrice: 5000,
        step: 100
      };
      res.json(priceSettings);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore price settings fetch failed, using defaults.");
        isFirestoreAvailable = false;
      }
      res.json({
        minPrice: 500,
        maxPrice: 5000,
        step: 100
      });
    }
  });

  app.get("/api/admin/branding-storage", async (req, res) => {
    try {
      let settings = {};
      
      if (isFirestoreAvailable) {
        try {
          const doc = await settingsRef.get();
          settings = doc.data() || {};
        } catch (error) {
          console.warn("Firestore branding-storage settings fetch failed, using defaults.");
          isFirestoreAvailable = false;
        }
      }
      
      const defaultInfrastructure = {
        domain: {
          name: "tazumartbd.com",
          isPrimary: true,
          subdomains: [],
          autoSSL: true,
          dnsRecords: [
            { id: "1", type: "A", name: "@", value: "1.2.3.4", ttl: "Auto", status: "CONNECTED" },
            { id: "2", type: "CNAME", name: "www", value: "tazumartbd.com", ttl: "Auto", status: "CONNECTED" }
          ]
        },
        hosting: {
          provider: "Hostinger",
          domain: "tazumartbd.com",
          serverIp: "1.2.3.4",
          nameservers: ["ns1.hostinger.com", "ns2.hostinger.com"],
          controlPanelUrl: "https://hpanel.hostinger.com",
          ftp: { host: "ftp.tazumartbd.com", user: "admin", pass: "********" },
          database: { name: "tazu_db", user: "tazu_user", pass: "********" },
          phpVersion: "8.2",
          sslEnabled: true,
          plan: "PAID"
        },
        monitoring: {
          cpu: 12,
          ram: 45,
          disk: 30,
          bandwidth: 15,
          load: 0.45,
          healthScore: 98,
          lastRestart: new Date().toISOString(),
          lastBackup: new Date().toISOString()
        },
        security: {
          sslExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true,
          forceHttps: true,
          firewall: true
        },
        deployment: {
          lastDeploy: new Date().toISOString(),
          version: "2.4.1",
          gitConnected: true,
          stagingEnabled: true
        },
        maintenance: {
          enabled: false,
          message: "We are currently performing scheduled maintenance. Please check back soon.",
          adminBypass: true
        }
      };

      const defaultBranding = {
        logo: "https://picsum.photos/seed/logo/200/60",
        favicon: "https://picsum.photos/seed/favicon/32/32",
        primaryColor: "#3F51B5",
        accentColor: "#6366F1",
        buttonStyle: "rounded",
        fontFamily: "Inter"
      };

      const defaultStorage = {
        totalUsed: 2.4,
        totalLimit: 100,
        autoClean: true,
        imageCompression: true,
        lazyLoad: true,
        minifyAssets: true
      };

      res.json({
        infrastructure: (settings as any).infrastructure || defaultInfrastructure,
        branding: (settings as any).branding || defaultBranding,
        storage: (settings as any).storage || defaultStorage
      });
    } catch (error) {
      console.error("Critical error in branding-storage fetch:", error);
      res.status(500).json({ error: "Failed to fetch branding & storage settings" });
    }
  });

  app.post("/api/admin/branding-storage", async (req, res) => {
    try {
      const { infrastructure, branding, storage } = req.body;
      
      if (isFirestoreAvailable) {
        try {
          await settingsRef.set({
            infrastructure,
            branding,
            storage
          }, { merge: true });
        } catch (error) {
          console.warn("Firestore branding-storage settings update failed, switching to mock mode.");
          isFirestoreAvailable = false;
        }
      }
      
      res.json({ success: true, mock: !isFirestoreAvailable });
    } catch (error) {
      console.error("Critical error in branding-storage update:", error);
      res.status(500).json({ error: "Failed to update branding & storage settings" });
    }
  });

  // --- Domains & Hosting Management ---

  // Initialize Free Hosting for user (if missing)
  app.post("/api/admin/hosting/init-free", async (req, res) => {
    try {
      if (!isFirestoreAvailable) return res.json({ success: true, mock: true });
      
      const userId = "admin-user"; // In real app, get from auth
      const snapshot = await db.collection("hosting").where("userId", "==", userId).where("hostingType", "==", "FREE").get();
      
      if (snapshot.empty) {
        const id = uuidv4();
        const freeHosting = {
          id,
          userId,
          isCustom: false,
          hostingType: 'FREE',
          planName: 'Free Hosting',
          storageLimit: 500, // 500MB
          bandwidthLimit: 'LIMITED',
          serverIp: '1.2.3.4', // Default platform IP
          subdomain: `${userId.toLowerCase()}.platform.com`,
          sslStatus: true,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        };
        await db.collection("hosting").doc(id).set(freeHosting);
        return res.json({ success: true, hosting: freeHosting });
      }
      
      res.json({ success: true, hosting: snapshot.docs[0].data() });
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize free hosting" });
    }
  });

  // Upgrade Plan
  app.post("/api/admin/hosting/upgrade", async (req, res) => {
    try {
      const { plan } = req.body; // 'BASIC' or 'PRO'
      if (!isFirestoreAvailable) return res.json({ success: true, mock: true });
      
      const userId = "admin-user";
      const upgradeId = uuidv4();
      const amount = plan === 'PRO' ? 20 : 10;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      const upgrade = {
        id: upgradeId,
        userId,
        plan,
        paymentStatus: 'COMPLETED',
        amount,
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString()
      };
      
      await db.collection("upgrades").doc(upgradeId).set(upgrade);
      
      // Update hosting to PAID
      const hostingSnapshot = await db.collection("hosting").where("userId", "==", userId).get();
      if (!hostingSnapshot.empty) {
        const hostingDoc = hostingSnapshot.docs[0];
        await hostingDoc.ref.update({
          hostingType: 'PAID',
          planName: `${plan} Plan`,
          storageLimit: plan === 'PRO' ? 20480 : 5120, // 20GB or 5GB
          bandwidthLimit: 'UNLIMITED',
          status: 'ACTIVE'
        });
      }
      
      res.json({ success: true, upgrade });
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade plan" });
    }
  });

  // Get all domains
  app.get("/api/admin/domains", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("domains").get();
        const domains = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(domains);
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch domains" });
    }
  });

  // Add/Update domain
  app.post("/api/admin/domains", async (req, res) => {
    try {
      const domainData = req.body;
      const id = domainData.id || uuidv4();
      const domain = {
        ...domainData,
        id,
        status: domainData.status || "PENDING",
        forceHttps: domainData.forceHttps ?? true,
        createdAt: domainData.createdAt || new Date().toISOString()
      };

      if (isFirestoreAvailable) {
        await db.collection("domains").doc(id).set(domain, { merge: true });
        return res.json({ success: true, id });
      }
      res.json({ success: true, id, mock: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save domain" });
    }
  });

  // Verify DNS (Simulated for this environment)
  app.post("/api/admin/domains/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      if (isFirestoreAvailable) {
        const domainRef = db.collection("domains").doc(id);
        const doc = await domainRef.get();
        if (!doc.exists) return res.status(404).json({ error: "Domain not found" });
        
        const domain = doc.data();
        
        // Auto Link System: Check for active hosting
        const hostingSnapshot = await db.collection("hosting").where("status", "==", "ACTIVE").limit(1).get();
        let activeHostingIp = '1.2.3.4'; // Default fallback
        let activeHostingId = null;

        if (!hostingSnapshot.empty) {
          const hosting = hostingSnapshot.docs[0].data();
          activeHostingIp = hosting.serverIp;
          activeHostingId = hosting.id;
        }

        // DNS Verification Logic (Hybrid)
        let isVerified = false;
        
        // Rule: If A Record matches active hosting IP, it's connected
        if (domain.dnsType === 'A' && domain.aRecordIp === activeHostingIp) {
          isVerified = true;
        } else if (domain.dnsType === 'CNAME' && domain.cname) {
          isVerified = true;
        } else if (domain.dnsType === 'NS' && domain.nameserver1 && domain.nameserver2) {
          isVerified = true;
        }

        if (isVerified) {
          await domainRef.update({ status: "CONNECTED" });
          
          if (activeHostingId) {
            const mapId = uuidv4();
            await db.collection("domain_hosting_map").doc(mapId).set({
              id: mapId,
              domainId: id,
              hostingId: activeHostingId,
              linked: "YES"
            });
          }
        }

        return res.json({ success: isVerified, status: isVerified ? "CONNECTED" : "PENDING" });
      }
      res.json({ success: true, status: "CONNECTED", mock: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify domain" });
    }
  });

  // Get all hosting
  app.get("/api/admin/hosting", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("hosting").get();
        const hosting = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(hosting);
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hosting" });
    }
  });

  // Add/Update hosting
  app.post("/api/admin/hosting", async (req, res) => {
    try {
      const hostingData = req.body;
      const id = hostingData.id || uuidv4();
      const hosting = {
        ...hostingData,
        id,
        status: hostingData.status || "ACTIVE",
        createdAt: hostingData.createdAt || new Date().toISOString()
      };

      if (isFirestoreAvailable) {
        await db.collection("hosting").doc(id).set(hosting, { merge: true });
        return res.json({ success: true, id });
      }
      res.json({ success: true, id, mock: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save hosting" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("products")
          .where("is_featured", "==", true)
          .where("is_deleted", "==", false)
          .orderBy("createdAt", "desc")
          .limit(8)
          .get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(products);
      }
      
      const products = MOCK_PRODUCTS_STATE
        .filter(p => p.is_featured && !p.is_deleted)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);
      res.json(products);
    } catch (error) {
      console.error("Featured products fetch error:", error);
      res.json([]);
    }
  });

  app.get("/api/products/home", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("products")
          .where("show_in_home", "==", true)
          .where("is_deleted", "==", false)
          .orderBy("createdAt", "desc")
          .limit(8)
          .get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(products);
      }
      
      const products = MOCK_PRODUCTS_STATE
        .filter(p => p.show_in_home && !p.is_deleted)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);
      res.json(products);
    } catch (error) {
      console.error("Home products fetch error:", error);
      res.json([]);
    }
  });

  app.get("/api/products/category/:slug/home", async (req, res) => {
    try {
      const { slug } = req.params;
      const { subcategory } = req.query;
      
      if (isFirestoreAvailable) {
        let query: admin.firestore.Query = db.collection("products")
          .where("category", "==", slug)
          .where("is_deleted", "==", false);
          
        if (subcategory) {
          query = query.where("subcategories", "array-contains", subcategory);
        }
        
        const snapshot = await query
          .orderBy("createdAt", "desc")
          .limit(8)
          .get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json(products);
      }
      
      let products = MOCK_PRODUCTS_STATE
        .filter(p => p.category === slug && !p.is_deleted);
        
      if (subcategory) {
        products = products.filter(p => p.subcategories?.includes(subcategory as string));
      }
      
      products = products
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);
        
      res.json(products);
    } catch (error) {
      console.error("Category home products fetch error:", error);
      // Don't disable Firestore globally for a query error (might be missing index)
      res.json([]);
    }
  });

  app.get("/api/products/category/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { subcategory, min, max } = req.query;
      
      if (isFirestoreAvailable) {
        let query: admin.firestore.Query = db.collection("products")
          .where("category", "==", slug)
          .where("is_deleted", "==", false);
          
        if (subcategory) {
          query = query.where("subcategories", "array-contains", subcategory);
        }
        
        const snapshot = await query
          .orderBy("createdAt", "desc")
          .get();
          
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        // Filter by price in memory if needed (Firestore doesn't support range on one field and sort on another without complex indexes)
        if (min) products = products.filter(p => p.price >= Number(min));
        if (max) products = products.filter(p => p.price <= Number(max));
        
        return res.json(products);
      }
      
      let products = MOCK_PRODUCTS_STATE
        .filter(p => p.category === slug && !p.is_deleted);
        
      if (subcategory) {
        products = products.filter(p => p.subcategories?.includes(subcategory as string));
      }
      if (min) products = products.filter(p => p.price >= Number(min));
      if (max) products = products.filter(p => p.price <= Number(max));
      
      products = products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(products);
    } catch (error) {
      console.error("Category products fetch error:", error);
      res.json([]);
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const { min, max, category, subcategory } = req.query;
      let query: admin.firestore.Query = db.collection("products");

      if (category) {
        query = query.where("category", "==", category);
      }

      if (subcategory) {
        query = query.where("subcategories", "array-contains", subcategory);
      }

      const snapshot = await query.get();
      let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((p: any) => !p.deletedAt);

      if (min) {
        products = products.filter((p: any) => p.price >= Number(min));
      }
      if (max) {
        products = products.filter((p: any) => p.price <= Number(max));
      }

      res.json(products);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore products fetch failed, using mock products.");
        isFirestoreAvailable = false;
      }
      const { min, max, category, subcategory } = req.query;
      let products = [...MOCK_PRODUCTS_STATE];
      
      if (category) {
        products = products.filter(p => p.category === category);
      }
      if (subcategory) {
        products = products.filter(p => p.subcategories?.includes(subcategory as string));
      }
      if (min) {
        products = products.filter(p => p.price >= Number(min));
      }
      if (max) {
        products = products.filter(p => p.price <= Number(max));
      }
      
      res.json(products);
    }
  });

  // 7. Admin Products API
  app.get("/api/admin/backups", (req, res) => {
    try {
      if (!fs.existsSync(backupsDir)) return res.json([]);
      const files = fs.readdirSync(backupsDir)
        .filter(f => f.endsWith('.json'))
        .map(f => {
          const stats = fs.statSync(path.join(backupsDir, f));
          return {
            name: f,
            size: stats.size,
            createdAt: stats.birthtime
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to list backups" });
    }
  });

  app.get("/api/admin/backups/download/:name", (req, res) => {
    try {
      const fileName = req.params.name;
      const filePath = path.join(backupsDir, fileName);
      if (!fs.existsSync(filePath)) return res.status(404).send("Backup not found");
      res.download(filePath);
    } catch (error) {
      res.status(500).send("Download failed");
    }
  });

  app.post("/api/admin/upload", upload.array("images", 10), (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      
      const urls = files.map(file => `/uploads/products/${file.filename}`);
      res.json({ urls });
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.get("/api/admin/customers", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const customersSnapshot = await db.collection("users").get();
      const customers = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(customers);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin customers fetch failed.");
        isFirestoreAvailable = false;
      }
      res.json([]);
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = req.body;
      const newId = uuidv4();
      const product = {
        ...productData,
        id: newId,
        show_in_home: productData.show_in_home ?? true,
        is_featured: productData.is_featured ?? false,
        is_deleted: false,
        titleSize: productData.titleSize || '100%',
        titleWeight: productData.titleWeight || 'bold',
        descriptionSize: productData.descriptionSize || '100%',
        descriptionWeight: productData.descriptionWeight || 'normal',
        productReviews: productData.productReviews || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isFirestoreAvailable) {
        const productRef = db.collection("products").doc(newId);
        await productRef.set(product);
        return res.json({ success: true, id: newId });
      }

      // Mock fallback
      MOCK_PRODUCTS_STATE.unshift(product);
      res.json({ success: true, id: newId, mock: true });
    } catch (error) {
      console.error("Product creation error:", error);
      if (isFirestoreAvailable) {
        console.warn("Firestore product creation failed, switching to mock mode.");
        isFirestoreAvailable = false;
        
        // Retry in mock mode
        const productData = req.body;
        const newId = uuidv4();
        const product = {
          ...productData,
          id: newId,
          show_in_home: productData.show_in_home ?? true,
          is_featured: productData.is_featured ?? false,
          is_deleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        MOCK_PRODUCTS_STATE.unshift(product);
        return res.json({ success: true, id: newId, mock: true });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const { id: bodyId, createdAt, is_deleted: bodyIsDeleted, ...productData } = req.body;
      
      // SAFE UPDATE SYSTEM: Only update fields that are explicitly provided
      // and never overwrite critical system fields like id or createdAt.
      const updateData: any = {
        ...productData,
        updatedAt: new Date().toISOString()
      };

      // Ensure we don't accidentally unset is_deleted if it's not provided
      if (bodyIsDeleted !== undefined) {
        updateData.is_deleted = bodyIsDeleted;
      }

      if (isFirestoreAvailable) {
        const productRef = db.collection("products").doc(productId);
        
        // Verify product exists before updating
        const doc = await productRef.get();
        if (!doc.exists) {
          return res.status(404).json({ error: "Product not found" });
        }

        // Use update() for partial updates (Firestore native behavior)
        await productRef.update(updateData);
        return res.json({ success: true });
      }

      // Mock fallback
      const index = MOCK_PRODUCTS_STATE.findIndex(p => p.id === productId);
      if (index !== -1) {
        // Merge instead of replace
        MOCK_PRODUCTS_STATE[index] = { 
          ...MOCK_PRODUCTS_STATE[index], 
          ...updateData 
        };
        res.json({ success: true, mock: true });
      } else {
        res.status(404).json({ error: "Product not found in mock state" });
      }
    } catch (error) {
      console.error("Product update error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Soft Delete Product
  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const deletedAt = new Date().toISOString();

      if (isFirestoreAvailable) {
        const productRef = db.collection("products").doc(productId);
        await productRef.update({ 
          is_deleted: true,
          deletedAt 
        });
        return res.json({ success: true });
      }

      // Mock fallback
      const index = MOCK_PRODUCTS_STATE.findIndex(p => p.id === productId);
      if (index !== -1) {
        MOCK_PRODUCTS_STATE[index].is_deleted = true;
        MOCK_PRODUCTS_STATE[index].deletedAt = deletedAt;
      }
      res.json({ success: true, mock: true });
    } catch (error) {
      console.error("Product delete error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Backup System
  app.get("/api/admin/backup", async (req, res) => {
    try {
      let products = [];
      if (isFirestoreAvailable) {
        const snapshot = await db.collection("products").get();
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        products = MOCK_PRODUCTS_STATE;
      }

      const backupData = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        data: {
          products,
          categories: MOCK_CATEGORIES_STATE,
          customers: MOCK_CUSTOMERS_STATE,
          orders: MOCK_ORDERS_STATE
        }
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=backup-${new Date().toISOString().split('T')[0]}.json`);
      res.send(JSON.stringify(backupData, null, 2));
    } catch (error) {
      res.status(500).json({ error: "Backup failed" });
    }
  });

  // Restore System
  app.post("/api/admin/restore", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ error: "No data provided" });

      if (isFirestoreAvailable) {
        const batch = db.batch();
        
        // Restore Products
        if (data.products) {
          data.products.forEach((p: any) => {
            const ref = db.collection("products").doc(p.id);
            batch.set(ref, p, { merge: true });
          });
        }
        
        // Restore Categories
        if (data.categories) {
          data.categories.forEach((c: any) => {
            const ref = db.collection("categories").doc(c.id);
            batch.set(ref, c, { merge: true });
          });
        }

        await batch.commit();
      }

      // Update Mock State
      if (data.products) MOCK_PRODUCTS_STATE = data.products;
      if (data.categories) MOCK_CATEGORIES_STATE = data.categories;
      if (data.customers) MOCK_CUSTOMERS_STATE = data.customers;
      if (data.orders) MOCK_ORDERS_STATE = data.orders;

      res.json({ success: true });
    } catch (error) {
      console.error("Restore error:", error);
      res.status(500).json({ error: "Restore failed" });
    }
  });

  app.post("/api/product/:id/reviews", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const { id } = req.params;
      const reviewData = req.body;
      
      const review = {
        id: uuidv4(),
        productId: id,
        userName: reviewData.userName,
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images || [],
        createdAt: new Date().toISOString()
      };

      const productRef = db.collection("products").doc(id);
      const productDoc = await productRef.get();

      if (productDoc.exists) {
        const product = productDoc.data();
        const currentReviews = product?.productReviews || [];
        const newReviews = [review, ...currentReviews];
        
        // Update rating and review count
        const totalRating = newReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
        const avgRating = parseFloat((totalRating / newReviews.length).toFixed(1));

        await productRef.update({
          productReviews: newReviews,
          rating: avgRating,
          reviews: newReviews.length
        });
      }

      res.status(201).json(review);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore review submission failed.");
        isFirestoreAvailable = false;
      }
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  app.get("/api/admin/products", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const productsSnapshot = await db.collection("products").get();
      if (productsSnapshot.empty) {
        return res.json(MOCK_PRODUCTS_STATE);
      }
      const products = productsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((p: any) => !p.deletedAt);
      res.json(MOCK_PRODUCTS_STATE);
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin products fetch failed.");
        isFirestoreAvailable = false;
      }
      res.json(MOCK_PRODUCTS_STATE);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const productDoc = await db.collection("products").doc(req.params.id).get();
      if (productDoc.exists) {
        const data = productDoc.data();
        if (data?.deletedAt) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json({ id: productDoc.id, ...data });
      }
      
      // Fallback to mock data if not found in Firestore
      const mockProduct = GENERATED_MOCK_PRODUCTS.find(p => p.id === req.params.id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      res.status(404).json({ error: "Product not found" });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore product fetch failed for ID:", req.params.id);
        isFirestoreAvailable = false;
      }
      
      // Fallback to mock data on permission error or other Firestore issues
      const mockProduct = MOCK_PRODUCTS_STATE.find(p => p.id === req.params.id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/product/:id", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const productDoc = await db.collection("products").doc(req.params.id).get();
        if (productDoc.exists) {
          const data = productDoc.data();
          if (data?.deletedAt) {
            return res.status(404).json({ error: "Product not found" });
          }
          return res.json({ id: productDoc.id, ...data });
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const mockProduct = MOCK_PRODUCTS_STATE.find(p => p.id === req.params.id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      res.status(404).json({ error: "Product not found" });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore single product fetch failed, switching to mock data.");
        isFirestoreAvailable = false;
      }
      
      // Fallback to mock data on permission error or other Firestore issues
      const mockProduct = MOCK_PRODUCTS_STATE.find(p => p.id === req.params.id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/admin/orders/:id", async (req, res) => {
    try {
      if (isFirestoreAvailable) {
        const orderDoc = await db.collection("orders").doc(req.params.id).get();
        if (orderDoc.exists) {
          return res.json({ id: orderDoc.id, ...orderDoc.data() });
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const mock = MOCK_ORDERS_STATE.find(o => o.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Order not found" });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore admin order fetch failed.");
        isFirestoreAvailable = false;
      }
      const mock = MOCK_ORDERS_STATE.find(o => o.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Order not found" });
    }
  });

  app.post("/api/admin/products/soft-delete-category", async (req, res) => {
    try {
      if (!isFirestoreAvailable) throw new Error("Firestore unavailable");
      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const productsSnapshot = await db.collection("products").where("category", "==", category).get();
      const batch = db.batch();
      const now = new Date().toISOString();

      productsSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { deletedAt: now });
      });

      await batch.commit();
      res.json({ success: true, count: productsSnapshot.size });
    } catch (error) {
      if (isFirestoreAvailable) {
        console.warn("Firestore soft delete failed.");
        isFirestoreAvailable = false;
      }
      res.status(500).json({ error: "Failed to soft delete products" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Test Firestore connection on startup
    try {
      const settings = await settingsRef.get();
      console.log(`Firestore connected successfully to database: ${firebaseConfig.firestoreDatabaseId}`);
      console.log(`Settings document exists: ${settings.exists}`);
      
      // Seed initial products if empty
      const productsSnapshot = await db.collection("products").limit(1).get();
      if (productsSnapshot.empty) {
        console.log("Seeding initial products...");
        const batch = db.batch();
        MOCK_PRODUCTS_STATE.forEach(product => {
          const ref = db.collection("products").doc(product.id);
          batch.set(ref, {
            ...product,
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          });
        });
        await batch.commit();
        console.log("Seeding complete.");
      }
    } catch (error) {
      isFirestoreAvailable = false;
      console.warn("Firestore is not available. The application will use mock data fallbacks.");
      console.info("To enable Firestore, please ensure the Cloud Firestore API is enabled in your Google Cloud project.");
    }
  });
}

startServer();
