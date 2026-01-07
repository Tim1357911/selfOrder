import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../services/api';
import { formatPrice } from '../utils/format';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Order, WebSocketMessage } from '../types';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [qrisCode, setQrisCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  // WebSocket for real-time payment updates
  useWebSocket('customer', orderId, (message: WebSocketMessage) => {
    if (message.type === 'PAYMENT_SUCCESS' && message.orderId === orderId) {
      setPaid(true);
      setOrder(message.order);
      setTimeout(() => {
        navigate(`/status/${orderId}`);
      }, 2000);
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

      if (orderData.payment_status === 'paid') {
        navigate(`/status/${orderId}`);
        return;
      }

      // Generate QRIS
      const qrisData = await paymentAPI.generateQRIS(orderId);
      setQrisCode(qrisData.qrisCode);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate payment (for demo purposes)
  const handleSimulatePayment = async () => {
    if (!orderId) return;

    setPaymentLoading(true);
    try {
      await paymentAPI.simulatePayment(orderId);
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-text-muted mt-4">Memuat...</p>
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

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light p-4">
        <div className="text-center fade-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">Pembayaran Berhasil!</h2>
          <p className="text-text-muted">Mengalihkan ke status pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-surface-light border border-gray-100 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-main">Pembayaran</h1>
            <p className="text-xs text-text-muted">Scan QR Code untuk membayar</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* QRIS Card */}
        <div className="bg-surface-light rounded-3xl p-6 shadow-soft border border-gray-100">
          {/* Order Info */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-text-muted font-medium">Total Pembayaran</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(order.total_price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted font-medium">Meja {order.table_number}</p>
              <p className="font-semibold text-text-main">{order.customer_name}</p>
            </div>
          </div>

          {/* QRIS Code */}
          <div className="flex flex-col items-center">
            {qrisCode ? (
              <div className="relative">
                <img
                  src={qrisCode}
                  alt="QRIS Code"
                  className="w-64 h-64 border-4 border-primary/20 rounded-3xl shadow-soft"
                />
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white">qr_code_scanner</span>
                </div>
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-3xl flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-300">qr_code_2</span>
              </div>
            )}
            <p className="text-sm text-text-muted mt-4 text-center">
              Scan menggunakan aplikasi e-wallet atau mobile banking Anda
            </p>
          </div>

          {/* Waiting indicator */}
          <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
            <span className="material-symbols-outlined text-yellow-600 animate-pulse">schedule</span>
            <span className="text-sm text-yellow-700 font-medium">Menunggu pembayaran...</span>
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
            <div className="flex justify-between">
              <span className="font-semibold text-text-main">Total</span>
              <span className="font-bold text-primary text-lg">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Demo Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-light border-t border-gray-100 p-4 shadow-soft">
        <button
          onClick={handleSimulatePayment}
          disabled={paymentLoading}
          className="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-600/30"
        >
          {paymentLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span>Memproses Pembayaran...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              <span>Simulasi Pembayaran (Demo)</span>
            </>
          )}
        </button>
        <p className="text-xs text-text-muted text-center mt-2">
          * Tombol ini hanya untuk demo, di produksi pembayaran akan otomatis terverifikasi
        </p>
      </div>
    </div>
  );
}
