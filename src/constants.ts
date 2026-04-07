import { Category, Product, Banner } from './types';

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Watches',
    nameBn: 'ঘড়ি',
    image: 'https://picsum.photos/seed/watch/400/400',
    banner: 'https://picsum.photos/seed/watch-banner/1200/400',
    slug: 'watches',
    order: 0,
    status: 'ACTIVE',
    subcategories: [
      { id: 'w1', name: "Men's Watch", slug: 'mens-watch' },
      { id: 'w2', name: "Women's Watch", slug: 'womens-watch' },
      { id: 'w3', name: 'Smart Watch', slug: 'smart-watch' }
    ]
  },
  {
    id: '2',
    name: 'Perfume Oil',
    nameBn: 'পারফিউম অয়েল',
    image: 'https://picsum.photos/seed/perfume/400/400',
    banner: 'https://picsum.photos/seed/perfume-banner/1200/400',
    slug: 'perfume-oil',
    order: 1,
    status: 'ACTIVE',
    subcategories: [
      { id: 'p1', name: 'Attar', slug: 'attar' },
      { id: 'p2', name: 'Arabic Perfume', slug: 'arabic-perfume' },
      { id: 'p3', name: 'Premium Oil', slug: 'premium-oil' }
    ]
  },
  {
    id: '3',
    name: 'Decorative Light',
    nameBn: 'ডেকোরেটিভ লাইট',
    image: 'https://picsum.photos/seed/light/400/400',
    banner: 'https://picsum.photos/seed/light-banner/1200/400',
    slug: 'decorative-light',
    order: 2,
    status: 'ACTIVE',
    subcategories: [
      { id: 'l1', name: 'LED Light', slug: 'led-light' },
      { id: 'l2', name: 'Night Lamp', slug: 'night-lamp' },
      { id: 'l3', name: 'Decorative Lamp', slug: 'decorative-lamp' }
    ]
  },
  {
    id: '4',
    name: 'Jewellery',
    nameBn: 'জুয়েলারি',
    image: 'https://picsum.photos/seed/jewellery/400/400',
    banner: 'https://picsum.photos/seed/jewellery-banner/1200/400',
    slug: 'jewellery',
    order: 3,
    status: 'ACTIVE',
    subcategories: [
      { id: 'j1', name: 'Necklace', slug: 'necklace' },
      { id: 'j2', name: 'Ring', slug: 'ring' },
      { id: 'j3', name: 'Bracelet', slug: 'bracelet' }
    ]
  }
];

export const HERO_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Stylish Watches Collection',
    subtitle: 'Premium quality watches for every occasion',
    image: 'https://picsum.photos/seed/hero1/1920/800',
    ctaText: 'Shop Now',
    ctaLink: '/category/watches'
  },
  {
    id: '2',
    title: 'Premium Perfume Oil',
    subtitle: 'Long lasting fragrances that define you',
    image: 'https://picsum.photos/seed/hero2/1920/800',
    ctaText: 'Explore',
    ctaLink: '/category/perfume-oil'
  },
  {
    id: '3',
    title: 'Ladies Jewellery Collection',
    subtitle: 'Elegant designs for the modern woman',
    image: 'https://picsum.photos/seed/hero3/1920/800',
    ctaText: 'View Collection',
    ctaLink: '/category/jewellery'
  }
];

// Helper to generate mock products
export const MOCK_PRODUCTS: Product[] = Array.from({ length: 48 }).map((_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  const isWatch = category.slug === 'watches';
  
  const brands = ['Casio', 'Naviforce', 'Curren', 'SKMEI', 'Colmi', 'Haylou', 'Mibro', 'Realme', 'DT NO.1'];
  const strapTypes: ('Leather' | 'Steel' | 'Rubber' | 'Silicone' | 'Metal')[] = ['Leather', 'Steel', 'Rubber', 'Silicone', 'Metal'];
  const displayTypes: ('Analog' | 'Digital' | 'Smart')[] = ['Analog', 'Digital', 'Smart'];
  const genders: ('Men' | 'Women' | 'Kids' | 'Unisex')[] = ['Men', 'Women', 'Kids', 'Unisex'];
  const priceTags: ('Budget' | 'Premium' | 'Luxury')[] = ['Budget', 'Premium', 'Luxury'];
  const possibleBadges: ('Best Seller' | 'New Arrival' | 'Hot Deal' | 'Limited Stock')[] = ['Best Seller', 'New Arrival', 'Hot Deal', 'Limited Stock'];

  return {
    id: `${i + 1}`,
    name: isWatch ? `${brands[i % brands.length]} ${category.name} ${i + 1}` : `${category.name} Product ${i + 1}`,
    price: Math.floor(Math.random() * 2000) + 500,
    oldPrice: Math.floor(Math.random() * 1000) + 2500,
    image: `https://picsum.photos/seed/prod${i}/600/600`,
    images: [`https://picsum.photos/seed/prod${i}/600/600`, `https://picsum.photos/seed/prod${i}b/600/600`],
    category: category.slug,
    subcategories: isWatch ? [category.subcategories![i % category.subcategories!.length].slug] : [],
    brand: isWatch ? brands[i % brands.length] : undefined,
    gender: isWatch ? genders[i % genders.length] : undefined,
    displayType: isWatch ? displayTypes[i % displayTypes.length] : undefined,
    strapType: isWatch ? strapTypes[i % strapTypes.length] : undefined,
    priceTag: isWatch ? priceTags[i % priceTags.length] : undefined,
    badges: isWatch ? [possibleBadges[i % possibleBadges.length]] : [],
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 100),
    isNew: i % 5 === 0,
    isBestSeller: i % 7 === 0,
    show_in_home: i % 3 === 0,
    is_featured: i % 10 === 0,
    is_deleted: false,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date().toISOString(),
    shortDescription: 'This is a premium quality product from Tazu Mart BD.',
    stock: Math.floor(Math.random() * 100),
    status: i % 10 === 0 ? 'HIDDEN' : 'ACTIVE'
  };
});

export const MOCK_CUSTOMERS = Array.from({ length: 20 }).map((_, i) => ({
  id: `cust-${i + 1}`,
  fullName: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `017000000${i.toString().padStart(2, '0')}`,
  address: `${i + 10} Main Road, Dhaka, Bangladesh`,
  location: i % 2 === 0 ? 'Dhaka' : 'Chittagong',
  totalSpend: Math.floor(Math.random() * 50000) + 5000,
  totalOrders: Math.floor(Math.random() * 15) + 1,
  status: i % 5 === 0 ? 'Hot' : i % 3 === 0 ? 'Returning' : 'Warm',
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  image: `https://i.pravatar.cc/150?u=cust${i + 1}`
}));

export const MOCK_ORDERS = Array.from({ length: 30 }).map((_, i) => {
  const customer = MOCK_CUSTOMERS[i % MOCK_CUSTOMERS.length];
  const orderItems = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => {
    const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: Math.floor(Math.random() * 2) + 1,
      image: product.image
    };
  });
  
  const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = 60;
  const total = subtotal + shippingFee;
  
  const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'];

  return {
    id: `order-${i + 1}`,
    orderNumber: `TZ-${1000 + i}`,
    userId: customer.id,
    customer: {
      name: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    },
    items: orderItems,
    subtotal,
    shippingFee,
    total,
    status: statuses[i % statuses.length],
    paymentMethod: i % 3 === 0 ? 'bKash' : 'COD',
    paymentStatus: i % 2 === 0 ? 'Paid' : 'Unpaid',
    createdAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    history: [
      { status: 'Pending', date: new Date(Date.now() - 5000000000).toISOString(), note: 'Order placed' }
    ]
  };
});
