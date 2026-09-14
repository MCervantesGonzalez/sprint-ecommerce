export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  phone?: string;
  avatar_url?: string;
  email_verified?: boolean;
}

export interface Address {
  id: string;
  label?: string;
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  base_price: number;
  compare_price?: number | null;
  active: boolean;
  image_url?: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: "TAZA" | "PLAYERA" | "HOODIE" | "OTRO";
  material?: "ALGODON" | "POLIESTER" | "CERAMICA" | "ALUMINIO" | "OTRO" | null;
  description: string;
  image_url?: string;
  public_id?: string;
  featured?: boolean;
  active: boolean;
  created_at: string;
  variants: ProductVariant[];
}

export interface Design {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
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
