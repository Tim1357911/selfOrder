import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import OrderStatusPage from './pages/OrderStatusPage'
import CashierDashboard from './pages/CashierDashboard'
import KitchenDashboard from './pages/KitchenDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/status/:orderId" element={<OrderStatusPage />} />
        
        {/* Staff Routes */}
        <Route path="/cashier" element={<CashierDashboard />} />
        <Route path="/kitchen" element={<KitchenDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
