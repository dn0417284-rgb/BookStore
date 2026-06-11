export interface OrderItem {
  order_item_id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price?: number;
  title?: string;
  author?: string;
  image?: string;
  subtotal?: number;
  reviewed?: boolean;
}

export interface Order {
  order_id: number;
  order_code?: string;
  tracking_code?: string;
  customer_name: string;
  phone: string;
  total_amount: number;
  payment_status?: 'UNPAID' | 'PAID' | 'REFUNDED';
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PACKING'
    | 'SHIPPING'
    | 'DELIVERED'
    | 'RECEIVED'
    | 'FAILED'
    | 'CANCELLED';
  created_at: string;
  items: OrderItem[];
}
