import { useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../services/api';
import { formatTime } from '../utils/format';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Order, WebSocketMessage } from '../types';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const ordersData = await orderAPI.getKitchen();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // WebSocket for real-time updates
  useWebSocket('kitchen', undefined, (message: WebSocketMessage) => {
    if (
      message.type === 'NEW_ORDER' || 
      message.type === 'ORDER_STATUS_UPDATE' || 
      message.type === 'PAYMENT_SUCCESS'
    ) {
      loadOrders();
    }
  });

  useEffect(() => {
    loadOrders();
    // Auto refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus as Order['status']);
      loadOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const pendingOrders = getOrdersByStatus('paid');
  const processingOrders = getOrdersByStatus('processing');
  const readyOrders = getOrdersByStatus('ready');

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      {/* Header */}
      <div className={`p-4 ${
        order.status === 'paid' ? 'bg-blue-500' :
        order.status === 'processing' ? 'bg-orange-500' :
        'bg-green-500'
      } text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-xl">Meja {order.table_number}</p>
            <p className="text-sm opacity-90">{order.customer_name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">{formatTime(order.created_at)}</p>
            <p className="text-xs opacity-75 font-mono">#{order.id.slice(0, 6)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-sm font-bold text-primary">
                {item.quantity}x
              </span>
              <div className="flex-1">
                <p className="font-semibold text-text-main">{item.menu_name}</p>
                {item.note && (
                  <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        {order.status === 'paid' && (
          <button
            onClick={() => handleStatusUpdate(order.id, 'processing')}
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
          >
            <span className="material-symbols-outlined">skillet</span>
            Mulai Proses
          </button>
        )}
        {order.status === 'processing' && (
          <button
            onClick={() => handleStatusUpdate(order.id, 'ready')}
            className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
          >
            <span className="material-symbols-outlined">notifications_active</span>
            Siap Diantar
          </button>
        )}
        {order.status === 'ready' && (
          <div className="py-3 bg-green-100 text-green-700 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            Menunggu Diambil
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-40 border-b border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="material-symbols-outlined text-white text-2xl">soup_kitchen</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Dashboard Dapur</h1>
                <p className="text-sm text-gray-400">
                  {orders.length} pesanan aktif
                </p>
              </div>
            </div>
            <button
              onClick={loadOrders}
              className="p-3 bg-gray-700 border border-gray-600 rounded-full hover:bg-gray-600 transition-all"
            >
              <span className="material-symbols-outlined text-gray-300">refresh</span>
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-5xl text-orange-500 animate-spin">progress_activity</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="material-symbols-outlined text-6xl mb-4 text-gray-600">soup_kitchen</span>
          <p className="text-gray-400">Tidak ada pesanan saat ini</p>
        </div>
      ) : (
        <main className="p-4">
          {/* Kanban Board */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Pending Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-400">schedule</span>
                <h2 className="font-bold text-white">Baru Masuk</h2>
                <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                  {pendingOrders.length}
                </span>
              </div>
              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {pendingOrders.length === 0 && (
                  <div className="bg-gray-800 rounded-2xl p-6 text-center text-gray-500 border border-gray-700">
                    <span className="material-symbols-outlined text-3xl mb-2">inbox</span>
                    <p>Tidak ada pesanan baru</p>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-orange-400">local_fire_department</span>
                <h2 className="font-bold text-white">Diproses</h2>
                <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                  {processingOrders.length}
                </span>
              </div>
              <div className="space-y-4">
                {processingOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {processingOrders.length === 0 && (
                  <div className="bg-gray-800 rounded-2xl p-6 text-center text-gray-500 border border-gray-700">
                    <span className="material-symbols-outlined text-3xl mb-2">skillet</span>
                    <p>Tidak ada yang diproses</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ready Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-green-400">notifications_active</span>
                <h2 className="font-bold text-white">Siap</h2>
                <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                  {readyOrders.length}
                </span>
              </div>
              <div className="space-y-4">
                {readyOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {readyOrders.length === 0 && (
                  <div className="bg-gray-800 rounded-2xl p-6 text-center text-gray-500 border border-gray-700">
                    <span className="material-symbols-outlined text-3xl mb-2">coffee</span>
                    <p>Tidak ada yang siap</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
