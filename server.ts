import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { createClient } from '@supabase/supabase-js';
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

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ofecyuceaovtljhxnaon.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZWN5dWNlYW92dGxqaHhuYW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njc1OTQsImV4cCI6MjA5MTE0MzU5NH0.JMqjvcmS57suCA-W-qgWB8lsaUhKrDuuTITKV3I2q3Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase initialized.");

let isSupabaseAvailable = true;

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
    if (isSupabaseAvailable) {
      const { data, error } = await supabase.from("products").select("*");
      if (!error) products = data;
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
  console.log("startServer called");
  const app = express();
  const PORT = 3000;

  // Trust proxy is required for rate limiting behind a proxy
  app.set("trust proxy", 1);

  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim()) 
    : ["*"];

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.get("/api/test", (req, res) => res.json({ message: "API is reachable" }));

  // --- CRITICAL ROUTES MOVED TO TOP ---
  app.get("/api/categories", async (req, res) => {
    console.log("GET /api/categories request received");
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true });
      if (error) throw error;
      res.json(data);
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase categories fetch failed, switching to mock data fallback.");
        isSupabaseAvailable = false;
      }
      res.json(MOCK_CATEGORIES_STATE);
    }
  });

  app.get("/api/menus", async (req, res) => {
    console.log("GET /api/menus request received");
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("menus").select("*").eq("status", "ACTIVE").order("order", { ascending: true });
        if (error) throw error;
        res.json(data);
      } else {
        res.json([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch menus:", error.message || error);
      if (error.code === '42P01') {
        console.error("HINT: The 'menus' table does not exist in your Supabase database. Please run the SQL setup script.");
      }
      // Fallback menus so the UI doesn't look empty
      const fallbackMenus = [
        { id: '1', name: 'Home', slug: '/', status: 'ACTIVE', order: 1, icon: 'Zap' },
        { id: '2', name: 'Shop', slug: '/shop', status: 'ACTIVE', order: 2, icon: 'TrendingUp' },
        { id: '3', name: 'Offers', slug: '/offers', status: 'ACTIVE', order: 3, icon: 'Percent' }
      ];
      res.json(fallbackMenus);
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    console.log("GET /api/products/featured request received");
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .eq("status", "ACTIVE")
          .limit(10);
        if (error) throw error;
        res.json(data);
      } else {
        res.json(MOCK_PRODUCTS_STATE.filter(p => p.is_featured).slice(0, 10));
      }
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      res.json(MOCK_PRODUCTS_STATE.filter(p => p.is_featured).slice(0, 10));
    }
  });
  // --- END CRITICAL ROUTES ---

  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // High Traffic Protection Middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Increased limit for development/testing
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: async (req, res, next, options) => {
      try {
        const { data, error } = await supabase.from("settings").select("*").eq("id", "store").single();
        const highTrafficMode = data?.highTrafficMode || false;
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

  // app.use("/api/", limiter);

  // Admin Authorization Middleware
  const adminMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const adminEmails = ['admin.tazumart060@gmail.com', 'admin.tazumartbd@gmail.com'];
      const isAdmin = adminEmails.includes(user.email?.toLowerCase() || '');
      if (!isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      (req as any).user = user;
      next();
    } catch (err) {
      console.error('Admin middleware error:', err);
      res.status(500).json({ error: 'Internal server error during authorization' });
    }
  };

  // Apply admin middleware to all admin routes
  app.use("/api/admin", adminMiddleware);

  // API routes FIRST
  app.get("/api/health", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data, error } = await supabase.from("settings").select("*").eq("id", "store").single();
      res.json({ 
        status: "ok", 
        supabase: "connected", 
        settingsExists: !!data,
      });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase health check failed.");
        isSupabaseAvailable = false;
      }
      res.json({ 
        status: "ok", 
        supabase: "mock_mode", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // 1. Stock Reservation & Checkout Initiation
  app.post("/api/checkout/initiate", async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
      if (isSupabaseAvailable) {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("stock")
          .eq("id", productId)
          .single();

        if (!productError && productData) {
          const currentStock = productData.stock || 0;

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

      // Create reservation (works in both Supabase and Mock mode)
      const reservationId = uuidv4();
      stockReservations.set(reservationId, {
        productId,
        quantity,
        expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
      });

      res.json({ reservationId, expiresAt: stockReservations.get(reservationId)?.expiresAt });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase checkout initiation failed.");
        isSupabaseAvailable = false;
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
      if (isSupabaseAvailable) {
        // Final stock check and update
        for (const item of items) {
          const { data: pData } = await supabase.from("products").select("stock, soldCount").eq("id", item.productId).single();
          if (pData) {
            await supabase.from("products").update({
              stock: (pData.stock || 0) - item.quantity,
              soldCount: (pData.soldCount || 0) + item.quantity
            }).eq("id", item.productId);
          }
        }

        const orderNumber = "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
        const orderId = uuidv4();
        
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

        const { error: orderError } = await supabase.from("orders").insert(orderData);
        if (orderError) throw orderError;

        if (reservationId) {
          stockReservations.delete(reservationId);
        }

        return res.json({ success: true, orderId, orderNumber });
      }

      throw new Error("Supabase unavailable");
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase order creation failed.");
        isSupabaseAvailable = false;
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
        shippingFee: deliveryFee,
        total,
        profit: items.reduce((acc: number, item: any) => acc + ((item.price - (item.buyingPrice || 0)) * item.quantity), 0),
        status: "PENDING",
        history: [{
          status: "PENDING",
          date: new Date().toISOString(),
          note: "Order placed successfully."
        }],
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
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      let query = supabase.from("orders").select("*").order("createdAt", { ascending: false });
      if (userId) {
        query = query.eq("userId", userId);
      }
      const { data: orders, error } = await query;
      if (error) throw error;
      res.json(orders);
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin orders fetch failed.");
        isSupabaseAvailable = false;
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

      if (isSupabaseAvailable) {
        const { data: orderData, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();
        
        if (!fetchError && orderData) {
          const history = orderData.history || [];
          history.push(historyEntry);
          const updateData: any = { status, history, updatedAt: new Date().toISOString() };
          if (courierName) updateData.courierName = courierName;
          if (trackingId) updateData.trackingId = trackingId;
          if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
          
          const { error: updateError } = await supabase.from("orders").update(updateData).eq("id", orderId);
          if (updateError) throw updateError;
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
      if (isSupabaseAvailable) {
        console.warn("Supabase order status update failed, switching to mock mode.");
        isSupabaseAvailable = false;
        
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
      if (isSupabaseAvailable) {
        if (orderId) {
          const { data: order, error } = await supabase.from("orders").select("*").or(`id.eq.${orderId},orderNumber.eq.${orderId}`).single();
          if (!error && order) {
            if (!phone || order.customer.phone === phone) {
              return res.json(order);
            }
          }
        } else if (phone) {
          const { data: orders, error } = await supabase.from("orders").select("*").eq("customer->>phone", phone).order("createdAt", { ascending: false }).limit(1);
          if (!error && orders && orders.length > 0) {
            return res.json(orders[0]);
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("orders").select("*");
        if (!error && data) orders = data;
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
        confirmedOrders: orders.filter(o => o.status === 'CONFIRMED').length,
        processingOrders: orders.filter(o => o.status === 'PROCESSING').length,
        shippedOrders: orders.filter(o => o.status === 'SHIPPED').length,
        deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
        returnedOrders: orders.filter(o => o.status === 'RETURNED').length,
        recentOrders: [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
        topProducts: orders.length > 0 ? Object.values(orders.reduce((acc: any, o) => {
          o.items.forEach((item: any) => {
            if (!acc[item.productId]) {
              acc[item.productId] = { name: item.name, sales: 0, color: '#FF6A00', image: item.image || item.images?.[0] || '/default-product.png' };
            }
            acc[item.productId].sales += item.quantity;
          });
          return acc;
        }, {})).sort((a: any, b: any) => b.sales - a.sales).slice(0, 5) : [],
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("users").select("*").eq("role", "CUSTOMER");
        if (!error && data) customers = data;
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("orders").select("*").eq("customer->>phone", phone);
        if (!error && data) orders = data;
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("abandoned_carts").select("*").order("cartTime", { ascending: false });
        if (!error && data) return res.json(data);
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch abandoned carts" });
    }
  });

  app.get("/api/admin/customers/:id", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("customers").select("*").eq("id", req.params.id).single();
        if (!error && data) {
          return res.json(data);
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const mock = MOCK_CUSTOMERS_STATE.find(c => c.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Customer not found" });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin customer fetch failed.");
        isSupabaseAvailable = false;
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
        if (!error && data) {
          order = data;
        }
      }
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase invoice data fetch failed.");
        isSupabaseAvailable = false;
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
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data, error } = await supabase.from("settings").select("*").eq("id", "store").single();
      res.json(data || {});
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin settings fetch failed.");
        isSupabaseAvailable = false;
      }
      res.json({});
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { error } = await supabase.from("settings").upsert({ id: "store", ...req.body });
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin settings update failed.");
        isSupabaseAvailable = false;
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Category Management API
  app.post("/api/admin/categories", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const categoryData = req.body;
      const id = categoryData.id || uuidv4();
      const { error } = await supabase.from("categories").upsert({
        ...categoryData,
        id,
        updatedAt: new Date().toISOString()
      });
      if (error) throw error;
      res.json({ success: true, id });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase category update failed.");
        isSupabaseAvailable = false;
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { error } = await supabase.from("categories").delete().eq("id", req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase category delete failed.");
        isSupabaseAvailable = false;
      }
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.post("/api/admin/categories/reorder", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { orders } = req.body; // Array of { id: string, order: number }
      
      // Supabase doesn't have batch updates in the same way as Firestore, 
      // but we can use upsert with an array of objects containing the ID and the new order.
      const updates = orders.map((item: any) => ({
        id: item.id,
        order: item.order
      }));
      
      const { error } = await supabase.from("categories").upsert(updates);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase category reorder failed.");
        isSupabaseAvailable = false;
      }
      res.status(500).json({ error: "Failed to reorder categories" });
    }
  });

  app.get("/api/price-settings", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data, error } = await supabase.from("settings").select("*").eq("id", "store").single();
      if (error) throw error;
      const settings = data || {};
      const priceSettings = settings.priceSettings || {
        minPrice: 500,
        maxPrice: 5000,
        step: 100
      };
      res.json(priceSettings);
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase price settings fetch failed, using defaults.");
        isSupabaseAvailable = false;
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
      
      if (isSupabaseAvailable) {
        try {
          const { data, error } = await supabase.from("settings").select("*").eq("id", "store").single();
          if (!error && data) settings = data;
        } catch (error) {
          console.warn("Supabase branding-storage settings fetch failed, using defaults.");
          isSupabaseAvailable = false;
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
      
      if (isSupabaseAvailable) {
        try {
          const { error } = await supabase.from("settings").upsert({
            id: "store",
            infrastructure,
            branding,
            storage
          });
          if (error) throw error;
        } catch (error) {
          console.warn("Supabase branding-storage settings update failed, switching to mock mode.");
          isSupabaseAvailable = false;
        }
      }
      
      res.json({ success: true, mock: !isSupabaseAvailable });
    } catch (error) {
      console.error("Critical error in branding-storage update:", error);
      res.status(500).json({ error: "Failed to update branding & storage settings" });
    }
  });

  // --- Domains & Hosting Management ---

  // Initialize Free Hosting for user (if missing)
  app.post("/api/admin/hosting/init-free", async (req, res) => {
    try {
      if (!isSupabaseAvailable) return res.json({ success: true, mock: true });
      
      const userId = "admin-user"; // In real app, get from auth
      const { data: hostingData, error } = await supabase.from("hosting").select("*").eq("userId", userId).eq("hostingType", "FREE").single();
      
      if (error || !hostingData) {
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
        const { error: insertError } = await supabase.from("hosting").insert(freeHosting);
        if (insertError) throw insertError;
        return res.json({ success: true, hosting: freeHosting });
      }
      
      res.json({ success: true, hosting: hostingData });
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize free hosting" });
    }
  });

  // Upgrade Plan
  app.post("/api/admin/hosting/upgrade", async (req, res) => {
    try {
      const { plan } = req.body; // 'BASIC' or 'PRO'
      if (!isSupabaseAvailable) return res.json({ success: true, mock: true });
      
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
      
      const { error: upgradeError } = await supabase.from("upgrades").insert(upgrade);
      if (upgradeError) throw upgradeError;
      
      // Update hosting to PAID
      const { data: hostingData, error: hostingError } = await supabase.from("hosting").select("*").eq("userId", userId).single();
      if (!hostingError && hostingData) {
        const { error: updateError } = await supabase.from("hosting").update({
          hostingType: 'PAID',
          planName: `${plan} Plan`,
          storageLimit: plan === 'PRO' ? 20480 : 5120, // 20GB or 5GB
          bandwidthLimit: 'UNLIMITED',
          status: 'ACTIVE'
        }).eq("id", hostingData.id);
        if (updateError) throw updateError;
      }
      
      res.json({ success: true, upgrade });
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade plan" });
    }
  });

  // Get all domains
  app.get("/api/admin/domains", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data: domains, error } = await supabase.from("domains").select("*");
        if (!error && domains) return res.json(domains);
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

      if (isSupabaseAvailable) {
        const { error } = await supabase.from("domains").upsert(domain);
        if (error) throw error;
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
      if (isSupabaseAvailable) {
        const { data: domain, error: fetchError } = await supabase.from("domains").select("*").eq("id", id).single();
        if (fetchError || !domain) return res.status(404).json({ error: "Domain not found" });
        
        // Auto Link System: Check for active hosting
        const { data: hostingData, error: hostingFetchError } = await supabase.from("hosting").select("*").eq("status", "ACTIVE").limit(1).single();
        let activeHostingIp = '1.2.3.4'; // Default fallback
        let activeHostingId = null;

        if (!hostingFetchError && hostingData) {
          activeHostingIp = hostingData.serverIp;
          activeHostingId = hostingData.id;
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
          const { error: updateError } = await supabase.from("domains").update({ status: "CONNECTED" }).eq("id", id);
          if (updateError) throw updateError;
          
          if (activeHostingId) {
            const mapId = uuidv4();
            const { error: mapError } = await supabase.from("domain_hosting_map").insert({
              id: mapId,
              domainId: id,
              hostingId: activeHostingId,
              linked: "YES"
            });
            if (mapError) throw mapError;
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
      if (isSupabaseAvailable) {
        const { data: hosting, error } = await supabase.from("hosting").select("*");
        if (!error && hosting) return res.json(hosting);
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

      if (isSupabaseAvailable) {
        const { error } = await supabase.from("hosting").upsert(hosting);
        if (error) throw error;
        return res.json({ success: true, id });
      }
      res.json({ success: true, id, mock: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save hosting" });
    }
  });

  app.get("/api/products/home", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("show_in_home", true)
          .eq("is_deleted", false)
          .order("createdAt", { ascending: false })
          .limit(8);
        if (!error && data) return res.json(data);
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
      
      if (isSupabaseAvailable) {
        let query = supabase
          .from("products")
          .select("*")
          .eq("category", slug)
          .eq("is_deleted", false);
          
        if (subcategory) {
          query = query.contains("subcategories", [subcategory]);
        }
        
        const { data: products, error } = await query
          .order("createdAt", { ascending: false })
          .limit(8);
          
        if (!error && products) return res.json(products);
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
      // Don't disable Supabase globally for a query error (might be missing index)
      res.json([]);
    }
  });

  app.get("/api/products/category/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { subcategory, min, max } = req.query;
      
      if (isSupabaseAvailable) {
        let query = supabase
          .from("products")
          .select("*")
          .eq("category", slug)
          .eq("is_deleted", false);
          
        if (subcategory) {
          query = query.contains("subcategories", [subcategory]);
        }
        
        const { data: products, error } = await query
          .order("createdAt", { ascending: false });
          
        if (!error && products) {
          let filteredProducts = products;
          if (min) filteredProducts = filteredProducts.filter(p => p.price >= Number(min));
          if (max) filteredProducts = filteredProducts.filter(p => p.price <= Number(max));
          return res.json(filteredProducts);
        }
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
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { min, max, category, subcategory } = req.query;
      let query = supabase.from("products").select("*");

      if (category) {
        query = query.eq("category", category);
      }

      if (subcategory) {
        query = query.contains("subcategories", [subcategory]);
      }

      if (req.query.isNewArrival === 'true') {
        query = query.eq("isNewArrival", true);
      }
      if (req.query.isBestSelling === 'true') {
        query = query.eq("isBestSelling", true);
      }
      if (req.query.isOfferProduct === 'true') {
        query = query.eq("isOfferProduct", true);
      }

      const { data: productsData, error } = await query;
      if (error) throw error;
      
      let products = (productsData || []).filter((p: any) => !p.deletedAt);

      if (min) {
        products = products.filter((p: any) => p.price >= Number(min));
      }
      if (max) {
        products = products.filter((p: any) => p.price <= Number(max));
      }

      res.json(products);
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase products fetch failed, using mock products.");
        isSupabaseAvailable = false;
      }
      const { min, max, category, subcategory, isNewArrival, isBestSelling, isOfferProduct } = req.query;
      let products = [...MOCK_PRODUCTS_STATE];
      
      if (category) {
        products = products.filter(p => p.category === category);
      }
      if (subcategory) {
        products = products.filter(p => p.subcategories?.includes(subcategory as string));
      }
      if (isNewArrival === 'true') {
        products = products.filter((p: any) => p.isNewArrival || p.isNew);
      }
      if (isBestSelling === 'true') {
        products = products.filter((p: any) => p.isBestSelling || p.isBestSeller);
      }
      if (isOfferProduct === 'true') {
        products = products.filter((p: any) => p.isOfferProduct || (p.oldPrice && p.oldPrice > p.price));
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

  // Dynamic Menus API
  app.post("/api/admin/menus", async (req, res) => {
    try {
      const menu = req.body;
      if (isSupabaseAvailable) {
        const { error } = await supabase.from("menus").upsert(menu);
        if (error) throw error;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save menu" });
    }
  });

  // Dynamic Pages API
  app.get("/api/pages/:slug", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("pages").select("*").eq("slug", req.params.slug).eq("status", "PUBLISHED").single();
        if (!error && data) {
          return res.json(data);
        }
      }
      // Mock fallback for common pages
      if (req.params.slug === 'about-us') {
        return res.json({
          title: 'About Tazu Mart BD',
          content: '<p>Tazu Mart BD is your premium destination for fashion and lifestyle in Bangladesh.</p>',
          bannerImage: 'https://picsum.photos/seed/about/1200/400'
        });
      }
      res.status(404).json({ error: "Page not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.get("/api/admin/pages", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("pages").select("*");
        if (!error && data) return res.json(data);
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    try {
      const page = req.body;
      if (isSupabaseAvailable) {
        const { error } = await supabase.from("pages").upsert({
          ...page,
          id: page.id || uuidv4(),
          createdAt: page.createdAt || new Date().toISOString()
        });
        if (error) throw error;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save page" });
    }
  });

  // Offers API
  app.get("/api/offers", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("offers").select("*").eq("status", "ACTIVE");
        if (!error && data) return res.json(data);
      }
      res.json([
        { id: '1', title: 'Eid Special Discount', type: 'DISCOUNT', bannerImage: 'https://picsum.photos/seed/offer1/1200/400', status: 'ACTIVE' }
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  });

  app.post("/api/admin/offers", async (req, res) => {
    try {
      const offer = req.body;
      if (isSupabaseAvailable) {
        const { error } = await supabase.from("offers").upsert({
          ...offer,
          id: offer.id || uuidv4()
        });
        if (error) throw error;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save offer" });
    }
  });

  // Contact Settings API
  app.get("/api/settings/contact", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("settings").select("*").eq("id", "contact").single();
        if (!error && data) return res.json(data);
      }
      res.json({
        phone: '01700000000',
        whatsapp: '01700000000',
        email: 'info@tazumartbd.com',
        address: 'Dhaka, Bangladesh',
        messengerLink: 'https://m.me/tazumartbd',
        googleMapEmbed: ''
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact settings" });
    }
  });

  app.post("/api/admin/settings/contact", async (req, res) => {
    try {
      if (isSupabaseAvailable) {
        const { error } = await supabase.from("settings").upsert({ id: "contact", ...req.body });
        if (error) throw error;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save contact settings" });
    }
  });

  app.get("/api/admin/transactions", async (req, res) => {
    try {
      // In a real app, this would fetch from a transactions table
      // For now, we'll derive some from orders or use mock data
      res.json([
        { id: 'TX-8421', order: '#ORD-8421', customer: 'Rahat Khan', method: 'bKash', amount: '৳ 1,200', status: 'Completed', date: '2 hours ago' },
        { id: 'TX-8422', order: '#ORD-8422', customer: 'Sumi Akter', method: 'Nagad', amount: '৳ 2,500', status: 'Pending', date: '5 hours ago' },
        { id: 'TX-8423', order: '#ORD-8423', customer: 'Jasim Uddin', method: 'COD', amount: '৳ 3,800', status: 'Completed', date: '12 hours ago' },
        { id: 'TX-8424', order: '#ORD-8424', customer: 'Nila Islam', method: 'Rocket', amount: '৳ 900', status: 'Failed', date: '1 day ago' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/reports", async (req, res) => {
    try {
      res.json([
        { id: 'REP-1024', name: 'Monthly Sales Report - March 2026', type: 'Sales', format: 'PDF', status: 'Ready', date: '2 hours ago' },
        { id: 'REP-1025', name: 'Inventory Audit Log', type: 'Inventory', format: 'Excel', status: 'Ready', date: '5 hours ago' },
        { id: 'REP-1026', name: 'Customer Behavior Analysis', type: 'Analytics', format: 'PDF', status: 'Processing', date: '12 hours ago' },
        { id: 'REP-1027', name: 'Tax Compliance Statement', type: 'Finance', format: 'PDF', status: 'Ready', date: '1 day ago' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.get("/api/admin/vendors", async (req, res) => {
    try {
      res.json([
        { id: 'V-1001', name: 'Aarong Textiles', category: 'Saree & Fabrics', products: 124, sales: '৳ 4,28,500', rating: 4.8, status: 'Active' },
        { id: 'V-1002', name: 'Yellow Fashion', category: 'Ready-to-Wear', products: 86, sales: '৳ 2,15,000', rating: 4.5, status: 'Active' },
        { id: 'V-1003', name: 'Apex Footwear', category: 'Shoes & Accessories', products: 42, sales: '৳ 84,200', rating: 4.2, status: 'Pending' },
        { id: 'V-1004', name: 'Cats Eye', category: 'Menswear', products: 68, sales: '৳ 1,12,000', rating: 4.6, status: 'Active' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.get("/api/admin/reviews", async (req, res) => {
    try {
      res.json([
        { id: 'REV-5001', product: 'Jamdani Saree', customer: 'Anika Rahman', rating: 5, comment: 'Absolutely beautiful! The quality is top-notch.', status: 'Published', date: '1 hour ago' },
        { id: 'REV-5002', product: 'Cotton Punjabi', customer: 'Karim Ahmed', rating: 4, comment: 'Good fit, but color is slightly different from photo.', status: 'Pending', date: '3 hours ago' },
        { id: 'REV-5003', product: 'Silk Scarf', customer: 'Farhana Yeasmin', rating: 2, comment: 'Material feels a bit rough. Not what I expected.', status: 'Flagged', date: '6 hours ago' },
        { id: 'REV-5004', product: 'Leather Wallet', customer: 'Tanvir Hossain', rating: 5, comment: 'Great value for money. Very durable.', status: 'Published', date: '12 hours ago' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/admin/admins", async (req, res) => {
    try {
      res.json([
        { id: 'ADM-1001', name: 'Tazu Mart Admin', email: 'admin.tazumartbd@gmail.com', role: 'Super Admin', status: 'Active', lastLogin: '2 hours ago' },
        { id: 'ADM-1002', name: 'Sumi Akter', email: 'sumi@tazumart.com', role: 'Editor', status: 'Active', lastLogin: '5 hours ago' },
        { id: 'ADM-1003', name: 'Rahat Khan', email: 'rahat@tazumart.com', role: 'Support', status: 'Active', lastLogin: '12 hours ago' },
        { id: 'ADM-1004', name: 'Jasim Uddin', email: 'jasim@tazumart.com', role: 'Viewer', status: 'Inactive', lastLogin: '1 week ago' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  app.get("/api/admin/abandoned-carts", async (req, res) => {
    try {
      res.json([
        { id: 1, customer: 'Rahat Khan', email: 'rahat@example.com', phone: '01712345678', product: 'Premium Cotton T-Shirt', price: '৳ 1,200', time: '2 hours ago', items: 3, status: 'High Intent' },
        { id: 2, customer: 'Sumi Akter', email: 'sumi@example.com', phone: '01812345678', product: 'Slim Fit Denim Jeans', price: '৳ 2,500', time: '5 hours ago', items: 1, status: 'Medium Intent' },
        { id: 3, customer: 'Jasim Uddin', email: 'jasim@example.com', phone: '01912345678', product: 'Wireless Bluetooth Earbuds', price: '৳ 3,800', time: '12 hours ago', items: 2, status: 'Low Intent' },
        { id: 4, customer: 'Nila Islam', email: 'nila@example.com', phone: '01612345678', product: 'Leather Wallet', price: '৳ 900', time: '1 day ago', items: 1, status: 'High Intent' },
        { id: 5, customer: 'Abir Hasan', email: 'abir@example.com', phone: '01512345678', product: 'Casual Polo Shirt', price: '৳ 1,500', time: '2 days ago', items: 4, status: 'Medium Intent' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch abandoned carts" });
    }
  });

  app.get("/api/admin/shipments", async (req, res) => {
    try {
      res.json([
        { id: 'SH-1024', order: '#ORD-8421', customer: 'Rahat Khan', method: 'Pathao Courier', destination: 'Dhaka, BD', status: 'In Transit', date: '2 hours ago' },
        { id: 'SH-1025', order: '#ORD-8422', customer: 'Sumi Akter', method: 'RedX Delivery', destination: 'Chittagong, BD', status: 'Delivered', date: '5 hours ago' },
        { id: 'SH-1026', order: '#ORD-8423', customer: 'Jasim Uddin', method: 'Paperfly', destination: 'Sylhet, BD', status: 'Pending', date: '12 hours ago' },
        { id: 'SH-1027', order: '#ORD-8424', customer: 'Nila Islam', method: 'Store Pickup', destination: 'Dhaka, BD', status: 'Ready', date: '1 day ago' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  });

  app.get("/api/admin/campaigns", async (req, res) => {
    try {
      res.json([
        { id: 1, name: 'Summer Flash Sale 2026', type: 'Flash Sale', status: 'Active', reach: '12.4k', conversion: '4.2%', budget: '৳ 15,000', end: '2 days left' },
        { id: 2, name: 'New Arrival Promo', type: 'Email Campaign', status: 'Scheduled', reach: '8.2k', conversion: '-', budget: '৳ 5,000', end: 'Starts in 1d' },
        { id: 3, name: 'Eid Special Collection', type: 'Social Media', status: 'Completed', reach: '45.8k', conversion: '6.8%', budget: '৳ 50,000', end: 'Ended' },
        { id: 4, name: 'First Order Discount', type: 'Coupon', status: 'Active', reach: '2.1k', conversion: '12.5%', budget: '৳ 0', end: 'Ongoing' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/admin/inventory", async (req, res) => {
    try {
      res.json([
        { id: 1, name: 'Premium Cotton T-Shirt', sku: 'TSH-001', stock: 5, minStock: 10, category: 'Apparel', image: 'https://picsum.photos/seed/tshirt/100/100', status: 'Low Stock', price: 1250 },
        { id: 2, name: 'Slim Fit Denim Jeans', sku: 'JNS-002', stock: 3, minStock: 5, category: 'Apparel', image: 'https://picsum.photos/seed/jeans/100/100', status: 'Low Stock', price: 2450 },
        { id: 3, name: 'Wireless Bluetooth Earbuds', sku: 'EBD-003', stock: 0, minStock: 15, category: 'Electronics', image: 'https://picsum.photos/seed/earbuds/100/100', status: 'Out of Stock', price: 3500 },
        { id: 4, name: 'Leather Wallet', sku: 'WLT-004', stock: 45, minStock: 10, category: 'Accessories', image: 'https://picsum.photos/seed/wallet/100/100', status: 'In Stock', price: 850 },
        { id: 5, name: 'Casual Polo Shirt', sku: 'POL-005', stock: 12, minStock: 10, category: 'Apparel', image: 'https://picsum.photos/seed/polo/100/100', status: 'In Stock', price: 1100 },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.get("/api/admin/support-notes", async (req, res) => {
    try {
      res.json([
        { id: 1, customer: 'Rahat Khan', note: 'Customer prefers fast delivery via Pathao. High priority.', admin: 'Admin', date: '2 hours ago' },
        { id: 2, customer: 'Sumi Akter', note: 'High return rate on apparel items. Double check sizing before shipping.', admin: 'Admin', date: '5 hours ago' },
        { id: 3, customer: 'Jasim Uddin', note: 'Requested call before delivery. Address is slightly hard to find.', admin: 'Admin', date: '1 day ago' },
        { id: 4, customer: 'Nila Islam', note: 'Regular customer. Always pays via bKash. Loyal buyer.', admin: 'Admin', date: '2 days ago' },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch support notes" });
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
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data: customers, error } = await supabase.from("users").select("*");
      if (error) throw error;
      res.json(customers);
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin customers fetch failed.");
        isSupabaseAvailable = false;
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

      if (isSupabaseAvailable) {
        const { error } = await supabase.from("products").insert(product);
        if (error) throw error;
        return res.json({ success: true, id: newId });
      }

      // Mock fallback
      MOCK_PRODUCTS_STATE.unshift(product);
      res.json({ success: true, id: newId, mock: true });
    } catch (error) {
      console.error("Product creation error:", error);
      if (isSupabaseAvailable) {
        console.warn("Supabase product creation failed, switching to mock mode.");
        isSupabaseAvailable = false;
        
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

      if (isSupabaseAvailable) {
        const { data: existingProduct, error: fetchError } = await supabase
          .from("products")
          .select("id")
          .eq("id", productId)
          .single();
        
        if (fetchError || !existingProduct) {
          return res.status(404).json({ error: "Product not found" });
        }

        const { error: updateError } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", productId);
          
        if (updateError) throw updateError;
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

      if (isSupabaseAvailable) {
        const { error } = await supabase.from("products").update({ 
          is_deleted: true,
          deletedAt 
        }).eq("id", productId);
        if (error) throw error;
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("products").select("*");
        if (!error && data) products = data;
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

      if (isSupabaseAvailable) {
        // Restore Products
        if (data.products && data.products.length > 0) {
          const { error: pError } = await supabase.from("products").upsert(data.products);
          if (pError) throw pError;
        }
        
        // Restore Categories
        if (data.categories && data.categories.length > 0) {
          const { error: cError } = await supabase.from("categories").upsert(data.categories);
          if (cError) throw cError;
        }
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
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
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

      if (isSupabaseAvailable) {
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!fetchError && product) {
          const currentReviews = product.productReviews || [];
          const newReviews = [review, ...currentReviews];
          
          // Update rating and review count
          const totalRating = newReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
          const avgRating = parseFloat((totalRating / newReviews.length).toFixed(1));

          const { error: updateError } = await supabase
            .from("products")
            .update({
              productReviews: newReviews,
              rating: avgRating,
              reviews: newReviews.length
            })
            .eq("id", id);
          if (updateError) throw updateError;
        }
      }

      res.status(201).json(review);
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase review submission failed.");
        isSupabaseAvailable = false;
      }
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  app.get("/api/admin/products", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data: products, error } = await supabase.from("products").select("*");
      if (error) throw error;
      if (!products || products.length === 0) {
        return res.json(MOCK_PRODUCTS_STATE);
      }
      res.json(products.filter((p: any) => !p.deletedAt));
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin products fetch failed.");
        isSupabaseAvailable = false;
      }
      res.json(MOCK_PRODUCTS_STATE);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      if (!isSupabaseAvailable) throw new Error("Supabase unavailable");
      const { data, error } = await supabase.from("products").select("*").eq("id", req.params.id).single();
      if (!error && data) {
        if (data.deletedAt) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json(data);
      }
      
      // Fallback to mock data if not found in Supabase
      const mockProduct = GENERATED_MOCK_PRODUCTS.find(p => p.id === req.params.id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      res.status(404).json({ error: "Product not found" });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase product fetch failed for ID:", req.params.id);
        isSupabaseAvailable = false;
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("products").select("*").eq("id", req.params.id).single();
        if (!error && data) {
          if (data.deletedAt) {
            return res.status(404).json({ error: "Product not found" });
          }
          return res.json(data);
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const mockProduct = MOCK_PRODUCTS_STATE.find(p => p.id === req.params.id);
      if (mockProduct) {
        return res.json(mockProduct);
      }
      
      res.status(404).json({ error: "Product not found" });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase single product fetch failed, switching to mock data.");
        isSupabaseAvailable = false;
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
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("orders").select("*").eq("id", req.params.id).single();
        if (!error && data) {
          return res.json(data);
        }
      }
      
      // Fallback to mock data if not found in Firestore or Firestore is unavailable
      const mock = MOCK_ORDERS_STATE.find(o => o.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Order not found" });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase admin order fetch failed.");
        isSupabaseAvailable = false;
      }
      const mock = MOCK_ORDERS_STATE.find(o => o.id === req.params.id);
      if (mock) return res.json(mock);
      res.status(404).json({ error: "Order not found" });
    }
  });

  app.post("/api/admin/products/soft-delete-category", async (req, res) => {
    try {
      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      if (isSupabaseAvailable) {
        const now = new Date().toISOString();
        const { error, count } = await supabase
          .from("products")
          .update({ deletedAt: now })
          .eq("category", category);
        
        if (error) throw error;
        return res.json({ success: true, count });
      }
      res.json({ success: true, count: 0 });
    } catch (error) {
      if (isSupabaseAvailable) {
        console.warn("Supabase soft delete failed.");
        isSupabaseAvailable = false;
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

  // Global error handler for Express
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Express Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Test Supabase connection on startup
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase.from("settings").select("*").eq("id", "store").single();
        if (error && error.code !== 'PGRST116') throw error;
        console.log(`Supabase connected successfully.`);
        
        // Seed initial products if empty
        const { data: products, error: productsError } = await supabase.from("products").select("id").limit(1);
        if (!productsError && (!products || products.length === 0)) {
          console.log("Seeding initial products...");
          const productsToSeed = MOCK_PRODUCTS_STATE.map(product => ({
            ...product,
            status: "ACTIVE",
            createdAt: new Date().toISOString()
          }));
          const { error: seedError } = await supabase.from("products").insert(productsToSeed);
          if (seedError) console.error("Seeding failed:", seedError);
          else console.log("Seeding complete.");
        }
      }
    } catch (error) {
      isSupabaseAvailable = false;
      console.warn("Supabase is not available. The application will use mock data fallbacks.");
    }
  });
}

startServer();
