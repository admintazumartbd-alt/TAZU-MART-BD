export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  image: string;
  banner?: string;
  slug: string;
  subcategories?: SubCategory[];
  order: number;
  status: 'ACTIVE' | 'HIDDEN';
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  price: number; // Sell Price
  oldPrice?: number; // Regular Price
  buyingPrice?: number; // Admin Only
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  subcategories?: string[];
  brand?: string;
  seoDescription?: string; // 160 char
  description?: string; // Long Description
  weightVolume?: string; // e.g. 6ml, 12ml
  colors?: { 
    name: string; 
    hex: string; 
    image?: string;
    visible?: boolean;
    extraPrice?: number;
  }[];
  status: 'ACTIVE' | 'HIDDEN';
  condition?: 'New' | 'Used' | 'Refurbished';
  videoLink?: string;
  sku?: string;
  stock: number; // Quantity
  unitName?: string; // pcs / bottle
  stockAlert?: number; // Low stock threshold
  specifications?: { [key: string]: string }; // Product Details (Title/Description)
  rating: number;
  reviews: number;
  soldCount?: number; // Initial Sold Count
  isNewArrival?: boolean;
  isBestSelling?: boolean;
  isOfferProduct?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  show_in_home?: boolean;
  is_featured?: boolean;
  is_deleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Delivery Charges
  deliveryCharges?: {
    dhaka: number;
    others: number;
  };
  
  // Styling Controls
  titleSize?: string;
  titleWeight?: string;
  descriptionSize?: string;
  descriptionWeight?: string;
  
  // Reviews
  productReviews?: Review[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface PriceSettings {
  minPrice: number;
  maxPrice: number;
  step: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    email?: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    buyingPrice?: number;
    quantity: number;
    color?: string;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  profit?: number;
  status: 'PENDING' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  paymentMethod: 'COD' | 'ONLINE' | 'BKASH' | 'NAGAD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  courierName?: string;
  trackingId?: string;
  courierStatus?: string;
  parcelLocation?: string;
  currentHub?: string;
  estimatedDelivery?: string;
  deviceIp?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  profileImage?: string;
  totalOrders: number;
  totalSpending: number;
  cancelledOrders: number;
  returnedOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  orderHistory: string[]; // Order IDs
  loginLogs: ActivityLog[];
  fraudScore?: number;
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  type: 'LOGIN' | 'REGISTRATION' | 'PROFILE_UPDATE' | 'ADDRESS_CHANGE' | 'ORDER_ACTIVITY' | 'PASSWORD_CHANGE';
  method?: 'MANUAL' | 'GOOGLE' | 'FACEBOOK';
  deviceType: string;
  ipAddress: string;
  location?: string;
  timestamp: string;
}

export interface AbandonedCart {
  id: string;
  userId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  cartTime: string;
  reminderSent: boolean;
  reminderCount: number;
  status: 'ABANDONED' | 'RECOVERED';
}

export interface InfrastructureSettings {
  domain: {
    name: string;
    isPrimary: boolean;
    stagingDomain?: string;
    subdomains: string[];
    autoSSL: boolean;
    dnsRecords: {
      id: string;
      type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';
      name: string;
      value: string;
      ttl: string;
      status: 'CONNECTED' | 'PENDING' | 'ERROR';
    }[];
  };
  hosting: {
    provider: string;
    domain: string;
    serverIp: string;
    nameservers: string[];
    controlPanelUrl: string;
    ftp: {
      host: string;
      user: string;
      pass: string;
    };
    database: {
      name: string;
      user: string;
      pass: string;
    };
    phpVersion: '7.4' | '8.1' | '8.2';
    sslEnabled: boolean;
    plan: 'FREE' | 'PAID';
  };
  monitoring: {
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
    load: number;
    healthScore: number;
    lastRestart: string;
    lastBackup: string;
  };
  security: {
    sslExpiry: string;
    autoRenew: boolean;
    forceHttps: boolean;
    firewall: boolean;
  };
  deployment: {
    lastDeploy: string;
    version: string;
    gitConnected: boolean;
    stagingEnabled: boolean;
  };
  maintenance: {
    enabled: boolean;
    message: string;
    countdownEnd?: string;
    adminBypass: boolean;
  };
}

export interface BrandingSettings {
  logo: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  fontFamily: string;
}

export interface StorageSettings {
  totalUsed: number;
  totalLimit: number;
  autoClean: boolean;
  imageCompression: boolean;
  lazyLoad: boolean;
  minifyAssets: boolean;
}

export interface Domain {
  id: string;
  userId: string;
  domainName: string;
  subdomain?: string;
  dnsType: 'A' | 'CNAME' | 'NS';
  nameserver1?: string;
  nameserver2?: string;
  aRecordIp?: string;
  cname?: string;
  ttl?: string;
  redirectDomain?: string;
  forceHttps: boolean;
  txtRecord?: string;
  mxRecord?: string;
  status: 'PENDING' | 'CONNECTED';
  createdAt: string;
}

export interface Hosting {
  id: string;
  userId: string;
  isCustom: boolean;
  hostingType: 'FREE' | 'PAID';
  planName: string;
  providerName?: string;
  serverIp?: string;
  port?: string;
  rootDirectory?: string;
  cpanelUrl?: string;
  cpanelUser?: string;
  cpanelPass?: string;
  ftpHost?: string;
  ftpUser?: string;
  ftpPass?: string;
  dbHost?: string;
  dbName?: string;
  dbUser?: string;
  dbPass?: string;
  sslStatus: boolean;
  storageLimit: number;
  bandwidthLimit: 'LIMITED' | 'UNLIMITED';
  subdomain?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
}

export interface Upgrade {
  id: string;
  userId: string;
  plan: 'BASIC' | 'PRO';
  paymentStatus: 'PENDING' | 'COMPLETED';
  amount: number;
  expiryDate: string;
  createdAt: string;
}

export interface DomainHostingMap {
  id: string;
  domainId: string;
  hostingId: string;
  linked: 'YES' | 'NO';
}

export interface NavMenu {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
  icon?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  bannerImage?: string;
  seoTitle?: string;
  metaDescription?: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  type: 'DISCOUNT' | 'COUPON' | 'BANNER';
  couponCode?: string;
  expiryDate: string;
  bannerImage?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
}

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  messengerLink: string;
  googleMapEmbed: string;
}
