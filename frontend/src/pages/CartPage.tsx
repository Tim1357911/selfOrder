import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils/format';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    updateNote, 
    removeItem, 
    getTotalPrice,
    tableNumber,
    customerName 
  } = useCartStore();

  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for zustand store to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleEditNote = (menuId: number, currentNote?: string) => {
    setEditingNote(menuId);
    setNoteText(currentNote || '');
  };

  const handleSaveNote = (menuId: number) => {
    updateNote(menuId, noteText);
    setEditingNote(null);
    setNoteText('');
  };

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-text-muted mt-4">Memuat...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="px-4 py-4 flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-text-main dark:text-white">Keranjang</h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-gray-400 text-5xl">shopping_cart</span>
          </div>
          <p className="text-text-muted text-lg mb-6">Keranjang Anda kosong</p>
          <button
            onClick={() => navigate(`/order?table=${tableNumber}`)}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all"
          >
            Lihat Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col pb-4">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-text-main dark:text-white">Keranjang</h1>
          <div className="ml-auto bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            {items.length} Item
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Customer Info */}
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-text-muted font-medium">Pelanggan</span>
              <span className="font-bold text-text-main dark:text-white">{customerName} • Meja {tableNumber}</span>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex flex-col gap-4 mb-6">
          {items.map((item) => (
            <div
              key={item.menu_id}
              className="bg-surface-light dark:bg-surface-dark p-4 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex gap-4 items-center group transition-all hover:border-primary/30 relative overflow-hidden"
            >
              {/* Delete Button */}
              <button
                onClick={() => removeItem(item.menu_id)}
                className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>

              {/* Image */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={item.image_url}
                  alt={item.menu_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between self-stretch py-1 gap-1">
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white">{item.menu_name}</h3>
                  {item.note ? (
                    <button
                      onClick={() => handleEditNote(item.menu_id, item.note)}
                      className="text-xs text-primary mt-1 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      {item.note}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditNote(item.menu_id)}
                      className="text-xs text-text-muted mt-1 flex items-center gap-1 hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Tambah catatan
                    </button>
                  )}
                </div>
                <div className="font-bold text-lg text-primary">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>

              {/* Quantity Control */}
              <div className="flex flex-col items-end justify-end self-stretch py-1">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-1.5 border border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => updateQuantity(item.menu_id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all text-text-main dark:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="font-bold text-sm text-text-main dark:text-white w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menu_id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm transition-all text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
          
          <h2 className="text-lg font-bold text-text-main dark:text-white mb-6">Ringkasan Pembayaran</h2>

          <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6 relative z-10">
            <div className="flex justify-between text-sm items-center">
              <span className="text-text-muted">Subtotal ({items.length} item)</span>
              <span className="font-bold text-text-main dark:text-white text-base">{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-text-muted">Biaya Layanan</span>
              <span className="font-bold text-text-main dark:text-white text-base">Gratis</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex flex-col">
              <span className="text-sm text-text-muted">Total Pembayaran</span>
              <span className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/40 hover:bg-opacity-90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10 flex items-center justify-center gap-2 group"
          >
            Lanjut ke Pembayaran
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Note Edit Modal */}
      {editingNote !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-surface-light dark:bg-surface-dark w-full max-w-md rounded-t-3xl p-6 slide-up">
            <h3 className="font-bold text-lg text-text-main dark:text-white mb-4">Catatan Pesanan</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Contoh: Gula sedikit, tanpa es, dll"
              className="w-full p-4 bg-background-light dark:bg-background-dark rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-24 text-text-main dark:text-white placeholder:text-gray-400"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditingNote(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveNote(editingNote)}
                className="flex-1 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-opacity-90 transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
