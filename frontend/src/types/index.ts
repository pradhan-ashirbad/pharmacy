// ---------------------------------------------------------------------------
// Shared domain types for MediKart. The backend mock API returns data in the
// exact same shapes, so swapping the data source for MongoDB/PostgreSQL later
// only requires changing the fetch layer.
// ---------------------------------------------------------------------------

export type StoreKind = "medicines" | "wellness" | "devices";

export type ProductCategorySlug =
  | "prescription-medicines"
  | "otc-medicines"
  | "wellness-products"
  | "vitamins-supplements"
  | "personal-care"
  | "ayurvedic"
  | "diabetes-care"
  | "health-devices"
  | "fitness-gadgets"
  | "baby-care";

export type IconKey =
  | "pill"
  | "syrup"
  | "drops"
  | "cream"
  | "spray"
  | "powder"
  | "protein"
  | "herb"
  | "supplement"
  | "heart"
  | "bp"
  | "glucose"
  | "thermometer"
  | "oximeter"
  | "watch"
  | "band"
  | "scale"
  | "nebulizer"
  | "baby"
  | "hygiene"
  | "shield"
  | "stethoscope"
  | "eye"
  | "sun"
  | "brain"
  | "bone"
  | "nutrition";

export type Tint =
  | "blue"
  | "green"
  | "mint"
  | "sky"
  | "amber"
  | "rose"
  | "violet"
  | "teal";

export interface ProductImage {
  icon: IconKey;
  tint: Tint;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategorySlug;
  subcategory: string;
  store: StoreKind;
  price: number; // selling price in INR
  mrp: number; // maximum retail price in INR
  rating: number;
  reviewCount: number;
  prescriptionRequired: boolean;
  inStock: boolean;
  stockCount: number;
  packSize: string;
  description: string;
  highlights: string[];
  ingredients?: string[];
  dosage?: string;
  usage?: string;
  sideEffects?: string[];
  manufacturer: string;
  countryOfOrigin: string;
  specifications?: SpecRow[];
  warranty?: string;
  tags: string[];
  image: ProductImage;
  healthConcerns?: string[];
  frequentlyBoughtWith?: string[]; // product slugs
}

export interface Category {
  slug: ProductCategorySlug;
  name: string;
  description: string;
  icon: IconKey;
  tint: Tint;
  href: string;
  productCount: number;
}

export interface HealthConcern {
  slug: string;
  name: string;
  description: string;
  icon: IconKey;
  tint: Tint;
}

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  productCount: number;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discountLabel: string;
  tint: Tint;
  terms: string;
  expiresOn: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "flat" | "shipping";
  value: number; // percent value or flat ₹ amount
  minOrderValue: number;
  maxDiscount?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: "Home" | "Office" | "Other";
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string | null; // null when not reached yet
  description: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  packSize: string;
  price: number;
  mrp: number;
  quantity: number;
  image: ProductImage;
}

export type PaymentMethod =
  | "upi"
  | "credit-card"
  | "debit-card"
  | "net-banking"
  | "wallet"
  | "cod";

export interface PriceSummary {
  itemTotal: number; // sum of MRP
  discount: number; // MRP − selling price savings
  couponDiscount: number;
  deliveryFee: number;
  gst: number;
  total: number;
}

export interface Order {
  id: string;
  placedOn: string;
  status: OrderStatus;
  items: OrderItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  deliveryMethod: "standard" | "express";
  summary: PriceSummary;
  timeline: OrderTimelineEvent[];
  expectedDelivery: string;
}

export type PrescriptionStatus =
  | "uploaded"
  | "under-review"
  | "approved"
  | "rejected";

export interface Prescription {
  id: string;
  fileName: string;
  fileType: "image" | "pdf";
  uploadedOn: string;
  status: PrescriptionStatus;
  doctorName?: string;
  note?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "order" | "offer" | "prescription" | "system";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Admin-panel-only types -----------------------------------------------------

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedOn: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "blocked";
}

export interface AdminStats {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  customers: number;
  customersChange: number;
  products: number;
  productsChange: number;
}
