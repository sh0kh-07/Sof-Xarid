import axiosInstance from './axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: File | null;
  sellerId?: string;
}

// GET /products
export const getProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get<Product[]>('/products');
  return res.data;
};

// GET /products/:id
export const getProductById = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get<Product>(`/products/${id}`);
  return res.data;
};

// POST /products  (multipart/form-data — rasm fayli bor)
export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('price', String(payload.price));
  form.append('stock', String(payload.stock));
  if (payload.sellerId) form.append('sellerId', payload.sellerId);
  if (payload.image) form.append('image', payload.image);

  const res = await axiosInstance.post<Product>('/products', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// PUT /products/:id
export const updateProduct = async (id: string, payload: ProductPayload): Promise<Product> => {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('price', String(payload.price));
  form.append('stock', String(payload.stock));
  if (payload.sellerId) form.append('sellerId', payload.sellerId);
  if (payload.image) form.append('image', payload.image);

  const res = await axiosInstance.put<Product>(`/products/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// DELETE /products/:id
export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};
