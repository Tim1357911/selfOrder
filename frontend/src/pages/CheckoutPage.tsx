import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/format';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, customerName, tableNumber, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const isRedirectingToPayment = useRef(false);

  // Wait for zustand store to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Only redirect after hydration is complete and NOT redirecting to payment
  useEffect(() => {
    if (isHydrated && items.length === 0 && !isRedirectingToPayment.current) {
      navigate(tableNumber ? `/order?table=${tableNumber}` : '/', { replace: true });
    }
  }, [isHydrated, items.length, tableNumber, navigate]);

  // Show loading while hydrating or if no items (and not redirecting to payment)
  if (!isHydrated || (items.length === 0 && !isRedirectingToPayment.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-text-muted mt-4">Memuat...</p>
        </div>
      </div>
    );
  }

  const handleCreateOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const order = await orderAPI.create({
        customer_name: customerName,
        table_number: tableNumber!,
        items: items.map(item => ({
          menu_id: item.menu_id,
          menu_name: item.menu_name,
          price: item.price,
          quantity: item.quantity,
          note: item.note,
        })),
        total_price: getTotalPrice(),
      });

      // Set flag before clearing cart to prevent redirect
      isRedirectingToPayment.current = true;
      clearCart();
      navigate(`/payment/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-text-main">Checkout</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-surface-light rounded-3xl p-5 shadow-soft border border-gray-100">
          <h2 className="font-bold text-lg text-text-main mb-4">Informasi Pelanggan</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">Nama</p>
                <p className="font-semibold text-text-main">{customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">table_restaurant</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">Nomor Meja</p>
                <p className="font-semibold text-text-main">Meja {tableNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-surface-light rounded-3xl p-5 shadow-soft border border-gray-100">
          <h2 className="font-bold text-lg text-text-main mb-4">Ringkasan Pesanan</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.menu_id} className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image_url} 
                    alt={item.menu_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-main">{item.menu_name}</p>
                  <p className="text-sm text-text-muted">
                    {item.quantity}x {formatPrice(item.price)}
                  </p>
                  {item.note && (
                    <p className="text-xs text-primary mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      {item.note}
                    </p>
                  )}
                </div>
                <p className="font-bold text-text-main">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-5 pt-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-main">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">error</span>
            {error}
          </div>
        )}
      </main>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-light border-t border-gray-100 p-4 shadow-soft">
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-muted">Total Pembayaran</span>
          <span className="text-2xl font-bold text-text-main">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Konfirmasi & Bayar</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
