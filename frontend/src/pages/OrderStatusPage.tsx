import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { formatPrice, formatTime, getStatusLabel } from '../utils/format';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Order, WebSocketMessage } from '../types';

const statusSteps = [
  { key: 'paid', label: 'Dibayar', icon: 'payments' },
  { key: 'processing', label: 'Diproses', icon: 'soup_kitchen' },
  { key: 'ready', label: 'Siap', icon: 'notifications_active' },
  { key: 'completed', label: 'Selesai', icon: 'check_circle' },
];

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // WebSocket for real-time updates
  useWebSocket('customer', orderId, (message: WebSocketMessage) => {
    if (message.orderId === orderId) {
      setOrder(message.order);
    }
  });

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const orderData = await orderAPI.getById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-text-muted mt-4">Memuat status pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-red-500">error</span>
          </div>
          <p className="text-text-muted mb-4">Pesanan tidak ditemukan</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/30"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-background-light pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-surface-light border border-gray-100 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">home</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-main">Status Pesanan</h1>
            <p className="text-xs text-text-muted">Order #{order.id.slice(0, 8)}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-surface-light rounded-3xl p-6 shadow-soft border border-gray-100">
          {order.status === 'cancelled' ? (
            <div className="text-center py-4">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-5xl text-red-600">cancel</span>
              </div>
              <h2 className="text-xl font-bold text-red-600">Pesanan Dibatalkan</h2>
              <p className="text-text-muted mt-2">Maaf, pesanan Anda telah dibatalkan</p>
            </div>
          ) : order.status === 'waiting_payment' ? (
            <div className="text-center py-4">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="material-symbols-outlined text-5xl text-yellow-600">schedule</span>
              </div>
              <h2 className="text-xl font-bold text-yellow-600">Menunggu Pembayaran</h2>
              <p className="text-text-muted mt-2">Silakan selesaikan pembayaran Anda</p>
              <button
                onClick={() => navigate(`/payment/${order.id}`)}
                className="mt-4 px-6 py-3 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/30"
              >
                Bayar Sekarang
              </button>
            </div>
          ) : (
            <>
              {/* Current Status */}
              <div className="text-center mb-8">
                {order.status === 'ready' ? (
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="material-symbols-outlined text-5xl text-green-600">notifications_active</span>
                  </div>
                ) : order.status === 'completed' ? (
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-5xl text-primary animate-pulse">coffee</span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-text-main">
                  {getStatusLabel(order.status)}
                </h2>
                <p className="text-text-muted mt-1">
                  {order.status === 'ready' 
                    ? 'Pesanan siap diambil!' 
                    : order.status === 'completed'
                    ? 'Terima kasih telah berkunjung!'
                    : 'Pesanan sedang diproses...'}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="relative px-4">
                <div className="absolute top-6 left-8 right-8 h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` 
                    }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-200 scale-110' : ''}`}
                        >
                          <span className="material-symbols-outlined">{step.icon}</span>
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order Info */}
        <div className="bg-surface-light rounded-3xl p-5 shadow-soft border border-gray-100">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                <p className="text-xs text-text-muted">Pelanggan</p>
                <p className="font-semibold text-text-main">{order.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-text-muted">Meja</p>
                <p className="font-semibold text-text-main">{order.table_number}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">table_restaurant</span>
              </div>
            </div>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">schedule</span>
            </div>
            <div>
              <p className="text-xs text-text-muted">Waktu Pesanan</p>
              <p className="font-semibold text-text-main">{formatTime(order.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-surface-light rounded-3xl p-5 shadow-soft border border-gray-100">
          <h3 className="font-bold text-text-main mb-4">Detail Pesanan</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-text-muted">
                  {item.quantity}x {item.menu_name}
                </span>
                <span className="font-semibold text-text-main">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-main">Total</span>
              <span className="font-bold text-primary text-xl">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>

        {/* New Order Button */}
        {(order.status === 'completed' || order.status === 'cancelled') && (
          <button
            onClick={() => {
              navigate(`/order?table=${order.table_number}`);
            }}
            className="w-full py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Pesan Lagi</span>
          </button>
        )}
      </main>
    </div>
  );
}
