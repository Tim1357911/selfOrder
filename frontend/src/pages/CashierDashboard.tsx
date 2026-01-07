import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../services/api';
import { formatPrice, formatTime, getStatusLabel, getStatusColor } from '../utils/format';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Order, WebSocketMessage } from '../types';

export default function CashierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    completed_orders: 0,
    cancelled_orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active'>('active');

  const loadData = useCallback(async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        filter === 'active' ? orderAPI.getActive() : orderAPI.getToday(),
        orderAPI.getStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // WebSocket for real-time updates
  useWebSocket('cashier', undefined, (message: WebSocketMessage) => {
    if (message.type === 'NEW_ORDER' || message.type === 'ORDER_STATUS_UPDATE' || message.type === 'PAYMENT_SUCCESS') {
      loadData();
    }
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus as Order['status']);
      loadData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
    try {
      await orderAPI.cancel(orderId);
      loadData();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting_payment':
        return 'schedule';
      case 'paid':
        return 'payments';
      case 'processing':
        return 'soup_kitchen';
      case 'ready':
        return 'notifications_active';
      case 'completed':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'schedule';
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-surface-light shadow-soft sticky top-0 z-40 border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">point_of_sale</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-text-main">Dashboard Kasir</h1>
                <p className="text-sm text-text-muted">Kelola pesanan</p>
              </div>
            </div>
            <button
              onClick={() => loadData()}
              className="p-3 bg-surface-light border border-gray-100 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-light rounded-2xl p-4 shadow-soft border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">coffee</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">Total Pesanan</p>
                <p className="text-xl font-bold text-text-main">{stats.total_orders}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-light rounded-2xl p-4 shadow-soft border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">payments</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">Pendapatan</p>
                <p className="text-lg font-bold text-text-main">{formatPrice(stats.total_revenue || 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-light rounded-2xl p-4 shadow-soft border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">Selesai</p>
                <p className="text-xl font-bold text-text-main">{stats.completed_orders}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-light rounded-2xl p-4 shadow-soft border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">cancel</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-medium">Dibatalkan</p>
                <p className="text-xl font-bold text-text-main">{stats.cancelled_orders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('active')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              filter === 'active'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-surface-light text-text-muted border border-gray-100 hover:bg-gray-50'
            }`}
          >
            Pesanan Aktif
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-surface-light text-text-muted border border-gray-100 hover:bg-gray-50'
            }`}
          >
            Semua Hari Ini
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
            <p className="text-text-muted mt-4">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-surface-light rounded-3xl shadow-soft border border-gray-100">
            <span className="material-symbols-outlined text-6xl text-gray-300">coffee</span>
            <p className="text-text-muted mt-4">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-surface-light rounded-2xl shadow-soft overflow-hidden border-l-4 ${
                  order.status === 'ready'
                    ? 'border-l-green-500'
                    : order.status === 'waiting_payment'
                    ? 'border-l-yellow-500'
                    : order.status === 'processing'
                    ? 'border-l-orange-500'
                    : order.status === 'cancelled'
                    ? 'border-l-red-500'
                    : 'border-l-gray-300'
                }`}
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-text-main">{order.customer_name}</p>
                      <p className="text-sm text-text-muted">
                        Meja {order.table_number} • {formatTime(order.created_at)}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      <span className="material-symbols-outlined text-sm">{getStatusIcon(order.status)}</span>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-2 mb-4">
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
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-text-main">Total</span>
                      <span className="text-primary">{formatPrice(order.total_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!['completed', 'cancelled'].includes(order.status) && (
                  <div className="px-4 pb-4 flex gap-2">
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 flex items-center justify-center gap-1 shadow-lg shadow-green-600/30"
                      >
                        <span className="material-symbols-outlined text-lg">check</span>
                        Serahkan
                      </button>
                    )}
                    {['waiting_payment', 'paid', 'processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex-1 py-2.5 bg-red-100 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-200 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                        Batalkan
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
