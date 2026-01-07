import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-secondary/20 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
          <span className="material-symbols-outlined filled text-primary text-5xl">local_cafe</span>
        </div>
        <h1 className="text-3xl font-bold text-text-main mb-2">Coffee Shop</h1>
        <p className="text-text-muted">Self Order System</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-surface-light rounded-3xl p-6 shadow-soft border border-gray-100">
          <h2 className="font-semibold text-lg text-text-main mb-4">
            Pilih Akses
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/order?table=1')}
              className="w-full flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all group"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-white">local_cafe</span>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-text-main group-hover:text-primary transition-colors">Demo Pelanggan</p>
                <p className="text-sm text-text-muted">Pesan menu (Meja 1)</p>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
            </button>

            <button
              onClick={() => navigate('/cashier')}
              className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-white">point_of_sale</span>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-text-main group-hover:text-blue-600 transition-colors">Dashboard Kasir</p>
                <p className="text-sm text-text-muted">Kelola pesanan & pembayaran</p>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-blue-600 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
            </button>

            <button
              onClick={() => navigate('/kitchen')}
              className="w-full flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all group"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-white">restaurant</span>
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-text-main group-hover:text-orange-600 transition-colors">Dashboard Dapur</p>
                <p className="text-sm text-text-muted">Proses pesanan</p>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-orange-600 group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-8">
          Scan QR Code di meja untuk memulai pemesanan
        </p>
      </div>
    </div>
  );
}
