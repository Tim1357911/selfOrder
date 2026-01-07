const API_BASE_URL = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Menu API
export const menuAPI = {
  getAll: () => fetchAPI<import('../types').MenuItem[]>('/menu'),
  getCategories: () => fetchAPI<string[]>('/menu/categories'),
  getByCategory: (category: string) => 
    fetchAPI<import('../types').MenuItem[]>(`/menu/category/${encodeURIComponent(category)}`),
  getById: (id: number) => fetchAPI<import('../types').MenuItem>(`/menu/${id}`),
};

// Order API
export const orderAPI = {
  getAll: () => fetchAPI<import('../types').Order[]>('/orders'),
  getById: (id: string) => fetchAPI<import('../types').Order>(`/orders/${id}`),
  getActive: () => fetchAPI<import('../types').Order[]>('/orders/active'),
  getKitchen: () => fetchAPI<import('../types').Order[]>('/orders/kitchen'),
  getToday: () => fetchAPI<import('../types').Order[]>('/orders/today'),
  getStats: () => fetchAPI<{
    total_orders: number;
    total_revenue: number;
    completed_orders: number;
    cancelled_orders: number;
  }>('/orders/stats'),
  create: (data: {
    customer_name: string;
    table_number: number;
    items: import('../types').CartItem[];
    total_price: number;
  }) => fetchAPI<import('../types').Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id: string, status: import('../types').OrderStatus) =>
    fetchAPI<import('../types').Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  cancel: (id: string) =>
    fetchAPI<import('../types').Order>(`/orders/${id}/cancel`, {
      method: 'PATCH',
    }),
};

// Payment API
export const paymentAPI = {
  generateQRIS: (orderId: string) =>
    fetchAPI<{ orderId: string; amount: number; qrisCode: string }>(
      `/payment/generate-qris/${orderId}`,
      { method: 'POST' }
    ),
  verify: (orderId: string) =>
    fetchAPI<{ success: boolean; message: string; order: import('../types').Order }>(
      `/payment/verify/${orderId}`,
      { method: 'POST' }
    ),
  simulatePayment: (orderId: string) =>
    fetchAPI<{ success: boolean; message: string; order: import('../types').Order }>(
      `/payment/simulate-payment/${orderId}`,
      { method: 'POST' }
    ),
  getStatus: (orderId: string) =>
    fetchAPI<{ orderId: string; paymentStatus: string; orderStatus: string }>(
      `/payment/status/${orderId}`
    ),
};

// Table API
export const tableAPI = {
  getAll: () => fetchAPI<import('../types').Table[]>('/tables'),
  getByNumber: (tableNumber: number) => 
    fetchAPI<import('../types').Table>(`/tables/${tableNumber}`),
  generateQR: (tableNumber: number) =>
    fetchAPI<{ tableNumber: number; qrCode: string; url: string }>(
      `/tables/${tableNumber}/qr`
    ),
};
