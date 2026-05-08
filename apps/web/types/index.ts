export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  base_price: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: "TAZA" | "PLAYERA" | "HOODIE" | "OTRO";
  description: string;
  active: boolean;
  created_at: string;
  variants: ProductVariant[];
}

export interface Design {
  id: string;
  name: string;
  description: string;
  image_url: string;
  active: boolean;
}

export interface ProductDesign {
  id: string;
  design: Design;
  extra_price: number;
}

export interface CartItem {
  id: string;
  variant: ProductVariant;
  design: Design | null;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: string;
  variant: ProductVariant;
  design: Design | null;
  quantity: number;
  unit_price: number;
  snapshot_name: string;
}

export interface Order {
  id: string;
  status:
    | "PENDING"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  subtotal: number;
  total: number;
  shipping_address: string;
  mp_payment_id: string | null;
  mp_preference_id: string | null;
  items: OrderItem[];
  created_at: string;
}
