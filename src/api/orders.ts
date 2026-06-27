import axiosInstance from './axios';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  clientId: string;
  sellerId: string;
  status: OrderStatus;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  client?: {
    id: string;
    full_name: string;
    username: string;
  };
  seller?: {
    id: string;
    full_name: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  productId: string;
  quantity: number;
  clientId: string;
  sellerId: string;
}

// GET /orders
export const getOrders = async (): Promise<Order[]> => {
  const res = await axiosInstance.get<Order[]>('/orders');
  return res.data;
};

// GET /orders/:id
export const getOrderById = async (id: string): Promise<Order> => {
  const res = await axiosInstance.get<Order>(`/orders/${id}`);
  return res.data;
};

// POST /orders
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const res = await axiosInstance.post<Order>('/orders', payload);
  return res.data;
};

// PUT /orders/:id
export const updateOrder = async (id: string, payload: Partial<CreateOrderPayload>): Promise<Order> => {
  const res = await axiosInstance.put<Order>(`/orders/${id}`, payload);
  return res.data;
};

// DELETE /orders/:id
export const deleteOrder = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/orders/${id}`);
};

// PATCH /orders/:id/status
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const res = await axiosInstance.patch<Order>(`/orders/${id}/status`, { status });
  return res.data;
};
