import type { AdminCustomer, AdminStats, OrderStatus, PaymentMethod } from "@/types";

export const adminStats: AdminStats = {
  revenue: 1284650,
  revenueChange: 12.4,
  orders: 1862,
  ordersChange: 8.1,
  customers: 12440,
  customersChange: 5.6,
  products: 68,
  productsChange: 3.2,
};

export interface AdminOrderRow {
  id: string;
  customer: string;
  city: string;
  date: string;
  items: number;
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
}

export const adminOrders: AdminOrderRow[] = [
  { id: "MK7H2QK9D1", customer: "Ramesh Patel", city: "Ahmedabad", date: "2026-06-11T08:42:00.000Z", items: 4, total: 1864, payment: "upi", status: "placed" },
  { id: "MK7H1XB2M8", customer: "Sunita Rao", city: "Hyderabad", date: "2026-06-11T07:15:00.000Z", items: 2, total: 743, payment: "cod", status: "confirmed" },
  { id: "MK7GZTW5R3", customer: "Imran Shaikh", city: "Mumbai", date: "2026-06-10T21:03:00.000Z", items: 6, total: 3320, payment: "credit-card", status: "packed" },
  { id: "MK7GYRN8L4", customer: "Kavya Krishnan", city: "Chennai", date: "2026-06-10T18:54:00.000Z", items: 1, total: 1690, payment: "upi", status: "shipped" },
  { id: "MK7GXPD3T6", customer: "Harpreet Kaur", city: "Ludhiana", date: "2026-06-10T15:30:00.000Z", items: 3, total: 980, payment: "net-banking", status: "shipped" },
  { id: "MK7GWLF6V9", customer: "Debasish Mohanty", city: "Bhubaneswar", date: "2026-06-10T12:08:00.000Z", items: 5, total: 2455, payment: "wallet", status: "out-for-delivery" },
  { id: "MK7GVJC1N2", customer: "Meera Pillai", city: "Kochi", date: "2026-06-09T19:25:00.000Z", items: 2, total: 567, payment: "upi", status: "delivered" },
  { id: "MK7GUHB4Q7", customer: "Anil Choudhary", city: "Jaipur", date: "2026-06-09T14:11:00.000Z", items: 7, total: 4120, payment: "debit-card", status: "delivered" },
  { id: "MK7GTGA9S5", customer: "Pooja Hegde", city: "Bengaluru", date: "2026-06-09T10:47:00.000Z", items: 1, total: 349, payment: "cod", status: "delivered" },
  { id: "MK7GSEZ7W1", customer: "Vivek Tiwari", city: "Lucknow", date: "2026-06-08T22:36:00.000Z", items: 3, total: 1235, payment: "upi", status: "cancelled" },
];

export interface AdminPrescriptionRow {
  id: string;
  customer: string;
  fileName: string;
  fileType: "image" | "pdf";
  uploadedOn: string;
  status: "uploaded" | "under-review" | "approved" | "rejected";
  medicines: string[];
}

export const adminPrescriptions: AdminPrescriptionRow[] = [
  { id: "RX9921", customer: "Ramesh Patel", fileName: "rx-dr-shah-june.jpg", fileType: "image", uploadedOn: "2026-06-11T08:40:00.000Z", status: "uploaded", medicines: ["Azithral 500", "Pan 40"] },
  { id: "RX9920", customer: "Sunita Rao", fileName: "thyroid-prescription.pdf", fileType: "pdf", uploadedOn: "2026-06-11T07:02:00.000Z", status: "under-review", medicines: ["Thyronorm 50mcg"] },
  { id: "RX9918", customer: "Debasish Mohanty", fileName: "cardiac-clinic-rx.jpg", fileType: "image", uploadedOn: "2026-06-10T11:55:00.000Z", status: "under-review", medicines: ["Telma 40", "Ecosprin 75"] },
  { id: "RX9915", customer: "Meera Pillai", fileName: "diabetes-rx-may.pdf", fileType: "pdf", uploadedOn: "2026-06-09T18:20:00.000Z", status: "approved", medicines: ["Glycomet GP 1"] },
  { id: "RX9911", customer: "Vivek Tiwari", fileName: "old-prescription-2024.jpg", fileType: "image", uploadedOn: "2026-06-08T21:10:00.000Z", status: "rejected", medicines: ["Montair LC"] },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "CUS-1041", name: "Ramesh Patel", email: "ramesh.patel@example.com", phone: "98201 12345", city: "Ahmedabad", joinedOn: "2025-11-04", totalOrders: 14, totalSpent: 18420, status: "active" },
  { id: "CUS-1038", name: "Sunita Rao", email: "sunita.rao@example.com", phone: "99887 65432", city: "Hyderabad", joinedOn: "2025-08-19", totalOrders: 22, totalSpent: 27310, status: "active" },
  { id: "CUS-1032", name: "Imran Shaikh", email: "imran.s@example.com", phone: "98335 44556", city: "Mumbai", joinedOn: "2026-01-12", totalOrders: 6, totalSpent: 8940, status: "active" },
  { id: "CUS-1029", name: "Kavya Krishnan", email: "kavya.k@example.com", phone: "94440 11223", city: "Chennai", joinedOn: "2025-06-30", totalOrders: 31, totalSpent: 41200, status: "active" },
  { id: "CUS-1018", name: "Harpreet Kaur", email: "harpreet.kaur@example.com", phone: "98140 99887", city: "Ludhiana", joinedOn: "2026-03-02", totalOrders: 4, totalSpent: 3260, status: "active" },
  { id: "CUS-1011", name: "Debasish Mohanty", email: "debasish.m@example.com", phone: "94370 55667", city: "Bhubaneswar", joinedOn: "2025-05-22", totalOrders: 18, totalSpent: 22150, status: "active" },
  { id: "CUS-1007", name: "Meera Pillai", email: "meera.pillai@example.com", phone: "98470 33445", city: "Kochi", joinedOn: "2025-09-14", totalOrders: 9, totalSpent: 11890, status: "active" },
  { id: "CUS-0996", name: "Vivek Tiwari", email: "vivek.t@example.com", phone: "99350 77889", city: "Lucknow", joinedOn: "2025-12-08", totalOrders: 2, totalSpent: 1240, status: "blocked" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 742000 },
  { month: "Feb", revenue: 818000 },
  { month: "Mar", revenue: 901000 },
  { month: "Apr", revenue: 873000 },
  { month: "May", revenue: 1142000 },
  { month: "Jun", revenue: 1284650 },
];
