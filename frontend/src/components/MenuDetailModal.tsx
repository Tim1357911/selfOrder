import { formatPrice } from '../utils/format';
import type { MenuItem } from '../types';

interface MenuDetailModalProps {
  menu: MenuItem;
  onClose: () => void;
  onAddToCart: (menu: MenuItem) => void;
}

export default function MenuDetailModal({ menu, onClose, onAddToCart }: MenuDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-auto bg-background-light dark:bg-background-dark min-h-screen flex flex-col slide-in-right">
        {/* Image Header */}
        <div className="relative w-full h-[45vh]">
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/10"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-white font-semibold text-lg drop-shadow-sm">Detail</h1>
            <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/10">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
          {/* Rating Badge */}
          <div className="absolute bottom-14 left-6 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-yellow-400 text-[16px] filled">star</span>
            <span className="text-sm font-bold text-text-main dark:text-white">4.8</span>
            <span className="text-xs text-text-muted">(230)</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface-light dark:bg-surface-dark -mt-10 rounded-t-3xl px-6 py-8 flex flex-col relative z-10 shadow-soft border-t border-gray-100 dark:border-gray-800">
          {/* Title & Category */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">{menu.name}</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">
                {menu.category}
              </span>
              {menu.is_available ? (
                <span className="text-sm text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Tersedia
                </span>
              ) : (
                <span className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Habis
                </span>
              )}
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800 mb-6" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-text-main dark:text-white mb-3">Deskripsi</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {menu.description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="mb-8">
            <h3 className="font-bold text-lg text-text-main dark:text-white mb-4">Informasi</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">local_cafe</span>
                  <span className="text-sm font-medium text-text-main dark:text-white">Kategori</span>
                </div>
                <p className="text-sm text-text-muted">{menu.category}</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">payments</span>
                  <span className="text-sm font-medium text-text-main dark:text-white">Harga</span>
                </div>
                <p className="text-sm text-primary font-bold">{formatPrice(menu.price)}</p>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Bottom Action */}
          <div className="pt-4 flex items-center justify-between gap-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col">
              <span className="text-sm text-text-muted font-medium mb-1">Harga</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(menu.price)}</span>
            </div>
            {menu.is_available ? (
              <button
                onClick={() => onAddToCart(menu)}
                className="flex-1 bg-primary text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/40 hover:bg-opacity-90 active:scale-95 transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Tambah
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold py-4 rounded-2xl cursor-not-allowed text-center"
              >
                Tidak Tersedia
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
