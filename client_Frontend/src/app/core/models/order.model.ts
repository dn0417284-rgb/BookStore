export interface OrderItem {
  order_item_id?: number;

  product_id: number;

  title: string;

  image: string;

  price: number;

  quantity: number;
}

export interface Order {
  order_id: number;

  customer_name: string;

  phone: string;

  email: string;

  address: string;

  note?: string;

  total_amount: number;

  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'SHIPPING'
    | 'COMPLETED'
    | 'CANCELLED';

  created_at: string;

  items: OrderItem[];
}