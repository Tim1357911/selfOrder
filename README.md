# Web Katalog & Self-Order Coffee Shop

Sistem pemesanan mandiri berbasis web untuk coffee shop dengan fitur scan QR code di meja.

## Fitur Utama

### Pelanggan
- Scan QR code untuk memulai pesanan
- Input nama (tanpa login/akun)
- Katalog menu interaktif dengan kategori
- Keranjang belanja dengan catatan pesanan
- Pembayaran QRIS dinamis
- Status pesanan real-time

### Kasir
- Dashboard melihat semua pesanan
- Monitoring status pembayaran
- Serah terima pesanan ke pelanggan
- Statistik penjualan harian

### Dapur
- Kanban board pesanan
- Update status: Diproses → Siap
- Notifikasi pesanan baru real-time

## Tech Stack

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- WebSocket untuk real-time updates
- QRCode generator

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router

## Menjalankan Aplikasi

### 1. Install Dependencies

```bash
# Di root folder
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Seed Data Menu

```bash
cd backend
npm run seed
```

### 3. Jalankan Development Server

```bash
# Di root folder
npm run dev
```

Atau jalankan terpisah:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Akses Aplikasi

- **Pelanggan**: http://localhost:5173/order?table=1
- **Kasir**: http://localhost:5173/cashier
- **Dapur**: http://localhost:5173/kitchen
- **Home (Demo)**: http://localhost:5173

## API Endpoints

### Menu
- `GET /api/menu` - Daftar semua menu
- `GET /api/menu/categories` - Daftar kategori
- `GET /api/menu/:id` - Detail menu

### Orders
- `GET /api/orders` - Semua pesanan
- `GET /api/orders/active` - Pesanan aktif
- `GET /api/orders/kitchen` - Pesanan untuk dapur
- `POST /api/orders` - Buat pesanan baru
- `PATCH /api/orders/:id/status` - Update status
- `PATCH /api/orders/:id/cancel` - Batalkan pesanan

### Payment
- `POST /api/payment/generate-qris/:orderId` - Generate QRIS
- `POST /api/payment/verify/:orderId` - Verifikasi pembayaran
- `POST /api/payment/simulate-payment/:orderId` - Simulasi pembayaran (demo)

### Tables
- `GET /api/tables` - Daftar meja
- `GET /api/tables/:tableNumber/qr` - Generate QR code meja

## Status Pesanan

1. `waiting_payment` - Menunggu pembayaran
2. `paid` - Sudah dibayar
3. `processing` - Sedang diproses di dapur
4. `ready` - Siap diantar
5. `completed` - Selesai
6. `cancelled` - Dibatalkan

## Struktur Folder

```
webCoffee/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── Menu.js
│   │   │   ├── Order.js
│   │   │   └── Table.js
│   │   ├── routes/
│   │   │   ├── menuRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── tableRoutes.js
│   │   ├── seeds/
│   │   │   └── seedMenu.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── OrderPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   ├── OrderStatusPage.tsx
│   │   │   ├── CashierDashboard.tsx
│   │   │   └── KitchenDashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── stores/
│   │   │   └── cartStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── format.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
└── package.json
```

## Demo

1. Buka halaman home untuk memilih role
2. Sebagai pelanggan:
   - Isi nama → Pilih menu → Checkout → Bayar (simulasi) → Lihat status
3. Buka dashboard kasir di tab/device lain untuk melihat pesanan masuk
4. Buka dashboard dapur untuk memproses pesanan

## Catatan

- Pembayaran QRIS bersifat simulasi untuk demo
- WebSocket digunakan untuk update real-time
- Data disimpan di SQLite (file-based database)