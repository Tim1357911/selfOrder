# Product Requirements Document (PRD)

## 1. Overview Produk
**Nama Produk:** Web Katalog & Self-Order Coffee Shop  
**Jenis Produk:** Web-based application (Mobile-first)  
**Target Pengguna:** Pelanggan coffee shop (dine-in), Kasir, Dapur  
**Tujuan Utama:**
Menyediakan sistem pemesanan mandiri berbasis web melalui QR Code yang memungkinkan pelanggan melihat menu, membuat pesanan, dan melakukan pembayaran QRIS secara efisien tanpa login akun.

---

## 2. Problem Statement
- Antrian kasir memperlambat pelayanan
- Menu fisik statis dan sulit diperbarui
- Human error dalam pencatatan pesanan
- Kurangnya transparansi status pesanan

---

## 3. Goals & Objectives
- Mempercepat proses pemesanan dine-in
- Mengurangi beban kasir
- Meningkatkan pengalaman pelanggan melalui self-order
- Memisahkan alur kerja kasir dan dapur secara jelas

---

## 4. Scope Produk (MVP)
### Termasuk:
- Scan QR meja
- Input nama pelanggan (tanpa login & tanpa nomor HP)
- Katalog menu interaktif
- Keranjang & checkout
- Pembayaran QRIS dinamis + auto validasi
- Dashboard kasir
- Dashboard dapur
- Status pesanan real-time

### Tidak Termasuk (Out of Scope):
- Promo & loyalty
- AI recommendation
- Delivery
- Akun pelanggan

---

## 5. User Flow Utama
1. Pelanggan scan QR di meja
2. Sistem otomatis mengenali nomor meja
3. Pelanggan mengisi **nama**
4. Pelanggan masuk ke katalog menu
5. Tambah menu ke keranjang
6. Checkout & generate QRIS dinamis
7. Pembayaran tervalidasi otomatis
8. Status pesanan ditampilkan di web pelanggan
9. Dapur menyiapkan pesanan
10. Kasir menyerahkan pesanan

---

## 6. User Roles
### 6.1 Pelanggan
- Scan QR
- Melihat menu & harga
- Membuat pesanan
- Melihat status pesanan

### 6.2 Kasir (1 Device)
- Melihat semua pesanan
- Melihat status pembayaran
- Validasi manual (opsional jika terjadi edge case)
- Tidak mengelola dapur

### 6.3 Dapur
- Melihat pesanan masuk
- Mengubah status: *Diproses → Disiapkan → Selesai*
- Dapat membatalkan pesanan **jika belum diproses**

---

## 7. Business Rules
- Tidak ada login pelanggan
- Nomor meja berasal dari QR
- Pesanan **tidak dapat dibatalkan** jika status sudah *Disiapkan*
- QRIS bersifat dinamis per pesanan
- Pembayaran tervalidasi otomatis
- Status pesanan menjadi sumber notifikasi utama

---

## 8. Functional Requirements
### 8.1 Menu & Katalog
- Kategori menu
- Foto menu
- Harga
- Deskripsi singkat
- Status ketersediaan

### 8.2 Keranjang
- Tambah / hapus item
- Update quantity
- Catatan pesanan

### 8.3 Checkout
- Ringkasan pesanan
- Generate QRIS dinamis
- Auto validasi pembayaran

### 8.4 Status Pesanan
- Menunggu pembayaran
- Dibayar
- Diproses
- Disiapkan
- Selesai

---

## 9. Non-Functional Requirements
- Mobile-first
- Fast loading (<3s)
- Simple & clean UI
- Aman dari manipulasi status
- Single outlet support

---

## 10. Data Model (High Level)
### Order
- order_id
- customer_name
- table_number
- status
- total_price
- payment_status

### OrderItem
- menu_id
- quantity
- note

### Menu
- menu_id
- name
- category
- price
- image_url
- is_available

---

## 11. Dummy Menu Data (Lengkap – Coffee Shop)

### A. Coffee Based
1. **Espresso** – Rp22.000  
   Single shot espresso  
   Image: Unsplash – espresso coffee

2. **Americano** – Rp25.000  
   Espresso dengan air panas  
   Image: Freepik – americano coffee

3. **Long Black** – Rp25.000  
   Air panas dengan espresso di atasnya  
   Image: Pexels – long black coffee

4. **Cappuccino** – Rp30.000  
   Espresso, susu, dan foam  
   Image: Unsplash – cappuccino coffee

5. **Cafe Latte** – Rp32.000  
   Espresso dengan susu creamy  
   Image: Pexels – latte art

6. **Flat White** – Rp32.000  
   Espresso dengan microfoam  
   Image: Freepik – flat white coffee

7. **Mocha** – Rp34.000  
   Espresso, coklat, dan susu  
   Image: Unsplash – mocha coffee

---

### B. Manual Brew
8. **V60** – Rp35.000  
   Seduhan manual pour over  
   Image: Unsplash – v60 brew

9. **Japanese Iced Coffee** – Rp38.000  
   Manual brew dengan es  
   Image: Freepik – iced pour over

10. **French Press** – Rp33.000  
    Kopi seduh metode press  
    Image: Pexels – french press coffee

---

### C. Non-Coffee
11. **Matcha Latte** – Rp32.000  
    Matcha Jepang dan susu  
    Image: Freepik – matcha latte

12. **Chocolate Drink** – Rp28.000  
    Coklat premium panas/dingin  
    Image: Pexels – chocolate drink

13. **Taro Latte** – Rp30.000  
    Minuman taro creamy  
    Image: Freepik – taro latte

14. **Red Velvet Latte** – Rp32.000  
    Red velvet dan susu  
    Image: Freepik – red velvet drink

---

### D. Tea Series
15. **English Breakfast Tea** – Rp25.000  
    Teh hitam klasik  
    Image: Unsplash – black tea

16. **Lemon Tea** – Rp25.000  
    Teh dengan lemon segar  
    Image: Pexels – lemon tea

17. **Peach Tea** – Rp28.000  
    Teh dengan rasa peach  
    Image: Freepik – peach tea

---

### E. Food – Pastry & Snack
18. **Butter Croissant** – Rp22.000  
    Pastry butter flaky  
    Image: Unsplash – croissant pastry

19. **Chocolate Croissant** – Rp25.000  
    Croissant isi coklat  
    Image: Freepik – chocolate croissant

20. **Banana Bread** – Rp24.000  
    Roti pisang lembut  
    Image: Pexels – banana bread

21. **French Fries** – Rp20.000  
    Kentang goreng crispy  
    Image: Freepik – french fries

22. **Onion Rings** – Rp22.000  
    Bawang goreng crispy  
    Image: Freepik – onion rings

---

### F. Light Meal
23. **Chicken Sandwich** – Rp35.000  
    Roti lapis ayam dan sayur  
    Image: Pexels – chicken sandwich

24. **Beef Burger** – Rp45.000  
    Burger daging sapi  
    Image: Unsplash – beef burger

25. **Spaghetti Aglio Olio** – Rp38.000  
    Pasta bawang putih dan olive oil  
    Image: Pexels – aglio olio pasta

---



## 12. UX Principles
- No friction (tanpa login & no HP)
- Transparansi status
- Familiar seperti aplikasi food-order
- Minim input user

---

## 13. Future Enhancement (Di Luar MVP)
- Promo & loyalty
- Takeaway
- Multi outlet
- WhatsApp notification
- Analytics penjualan

---

## 14. Success Metrics
- Waktu order < 2 menit
- Pengurangan antrian kasir
- Error pesanan < 1%
- Kepuasan pengguna

---

**Status Dokumen:** Final – MVP Ready

