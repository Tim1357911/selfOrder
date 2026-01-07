import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { menuAPI } from '../services/api';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../utils/format';
import type { MenuItem } from '../types';
import MenuDetailModal from '../components/MenuDetailModal';

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = parseInt(searchParams.get('table') || '0');

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const { 
    items: cartItems, 
    addItem, 
    getTotalItems, 
    setCustomerName: saveCustomerName,
    setTableNumber,
    customerName: savedName 
  } = useCartStore();

  useEffect(() => {
    if (tableNumber <= 0) {
      navigate('/');
      return;
    }
    setTableNumber(tableNumber);
    
    if (savedName) {
      setCustomerName(savedName);
      setShowNameModal(false);
    }

    loadMenuData();
  }, [tableNumber, navigate, setTableNumber, savedName]);

  const loadMenuData = async () => {
    try {
      const [menuData, categoryData] = await Promise.all([
        menuAPI.getAll(),
        menuAPI.getCategories(),
      ]);
      setMenus(menuData);
      setCategories(['All', ...categoryData]);
      setActiveCategory('All');
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim()) {
      saveCustomerName(customerName.trim());
      setShowNameModal(false);
    }
  };

  const filteredMenus = menus.filter(menu => {
    const matchCategory = activeCategory === 'All' || menu.category === activeCategory;
    const matchSearch = searchQuery === '' || 
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (menu: MenuItem) => {
    addItem({
      menu_id: menu.id,
      menu_name: menu.name,
      price: menu.price,
      quantity: 1,
      image_url: menu.image_url,
    });
  };

  const getItemQuantity = (menuId: number) => {
    const item = cartItems.find(i => i.menu_id === menuId);
    return item?.quantity || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="material-symbols-outlined text-primary text-3xl">local_cafe</span>
          </div>
          <p className="text-text-muted">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300 pb-24 md:pb-8">
      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 w-full max-w-sm fade-in shadow-soft border border-gray-100 dark:border-gray-800">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-4xl filled">local_cafe</span>
              </div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white">Selamat Datang!</h2>
              <p className="text-text-muted mt-2">Meja {tableNumber}</p>
            </div>
            
            <form onSubmit={handleNameSubmit}>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Nama Anda
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full px-5 py-4 bg-background-light dark:bg-background-dark border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all text-text-main dark:text-white placeholder:text-gray-400"
                autoFocus
                required
              />
              <button
                type="submit"
                className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30"
              >
                Mulai Pesan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">local_cafe</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wide text-text-muted font-bold">Meja {tableNumber}</span>
                <span className="font-bold text-base text-text-main dark:text-white">{customerName || 'Pelanggan'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getTotalItems() > 0 && (
                <button 
                  onClick={() => navigate('/cart')}
                  className="hidden md:flex relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-text-main dark:text-white">shopping_cart</span>
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>
              )}
              <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-md overflow-hidden bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-surface-light dark:bg-surface-dark border-none rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 focus:ring-2 focus:ring-primary/50 text-sm transition-all placeholder:text-gray-400 text-text-main dark:text-white"
              placeholder="Cari menu kopi..."
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className="p-2 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all shadow-glow flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
        {/* Promo Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-soft h-52 sm:h-64 group shrink-0">
          <img 
            alt="Promo" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-center items-start">
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg mb-3 shadow-lg uppercase tracking-wider">Promo</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-md">
              Beli 2 Gratis <br/> <span className="text-primary">1 Minuman!</span>
            </h1>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="font-bold text-xl text-text-main dark:text-white">Kategori</h2>
            <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
              {filteredMenus.length} menu
            </span>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`snap-start px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-surface-light dark:bg-surface-dark text-text-muted hover:text-primary hover:bg-primary/5 border border-gray-100 dark:border-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMenus.map((menu) => {
            const quantity = getItemQuantity(menu.id);
            return (
              <div
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                className="bg-surface-light dark:bg-surface-dark p-3 sm:p-4 rounded-[1.5rem] shadow-sm hover:shadow-soft transition-all duration-300 group border border-gray-100 dark:border-gray-800 flex flex-col relative overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={menu.image_url}
                    alt={menu.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-yellow-400 text-[14px] filled">star</span>
                    <span className="text-[10px] font-bold text-text-main dark:text-white">4.8</span>
                  </div>
                  {/* Sold Out Overlay */}
                  {!menu.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Habis</span>
                    </div>
                  )}
                  {/* Quantity Badge */}
                  {quantity > 0 && (
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      {quantity}x
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 mb-4 flex-grow">
                  <h3 className="font-bold text-lg text-text-main dark:text-white leading-tight line-clamp-1">
                    {menu.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-1">{menu.description}</p>
                </div>

                {/* Price & Add Button */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-text-main dark:text-white">
                    {formatPrice(menu.price)}
                  </span>
                  {menu.is_available && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(menu);
                      }}
                      className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all group-hover:scale-105"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMenus.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">search_off</span>
            <p className="text-text-muted">Menu tidak ditemukan</p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark py-3 px-8 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] border-t border-gray-100 dark:border-gray-800">
        <button className="text-primary flex flex-col items-center gap-1">
          <span className="material-symbols-outlined filled text-[26px]">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="text-gray-400 hover:text-primary transition-colors flex flex-col items-center gap-1 group">
          <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">favorite</span>
        </button>
        <div className="relative -top-8">
          <button 
            onClick={() => navigate('/cart')}
            className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-glow hover:scale-105 transition-transform border-4 border-surface-light dark:border-surface-dark"
          >
            <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute top-3 right-3 h-5 w-5 bg-white text-primary text-[9px] font-bold flex items-center justify-center rounded-full shadow-md">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
        <button className="text-gray-400 hover:text-primary transition-colors flex flex-col items-center gap-1 group">
          <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">notifications</span>
        </button>
        <button 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-primary transition-colors flex flex-col items-center gap-1 group"
        >
          <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">logout</span>
        </button>
      </nav>

      {/* Menu Detail Modal */}
      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAddToCart={(menu: MenuItem) => {
            handleAddToCart(menu);
            setSelectedMenu(null);
          }}
        />
      )}
    </div>
  );
}
