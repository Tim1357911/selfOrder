export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_available: number;
}

export interface CartItem {
  menu_id: number;
  menu_name: string;
  price: number;
  quantity: number;
  note?: string;
  image_url?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  table_number: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_price: number;
  qris_code?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: string;
  menu_id: number;
  menu_name: string;
  quantity: number;
  price: number;
  note?: string;
}

export type OrderStatus = 
  | 'waiting_payment' 
  | 'paid' 
  | 'processing' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Table {
  id: number;
  table_number: number;
  qr_code?: string;
  is_active: number;
}

export interface WebSocketMessage {
  type: 'NEW_ORDER' | 'ORDER_STATUS_UPDATE' | 'PAYMENT_SUCCESS' | 'ORDER_CANCELLED';
  order: Order;
  orderId: string;
}
