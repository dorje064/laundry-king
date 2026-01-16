export interface ClothItem {
  id: string;
  name: string;
  icon: string;
  price: number;
}

export interface OrderItem {
  item: string;
  qty: number;
  price: number;
}

export interface OrderState {
  items: OrderItem[];
  phone: string;
  location: string;
  total: number;
}
