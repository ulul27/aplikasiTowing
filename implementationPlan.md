# Rencana Implementasi Aplikasi Towing

## Deskripsi Tujuan
Membuat purwarupa aplikasi pemesanan jasa towing berbasis web menggunakan framework **Next.js**. Aplikasi ini ditujukan untuk pelanggan (customer) agar bisa memesan jasa angkut kendaraan (motor, mobil) atau mesin industri. 

Fitur utama meliputi:
1. Input data pelanggan dan jenis barang.
2. Pemilihan titik lokasi penjemputan dan pengantaran menggunakan peta interaktif (Google Maps).
3. Perhitungan otomatis jarak dan rincian harga (Tarif Dasar + Tambahan Jenis Barang + Biaya per Jarak).
4. Penyimpanan data pesanan ke database (Supabase).
5. Pengalihan (redirect) ke WhatsApp admin beserta detail pesanan dan instruksi pembayaran via transfer bank.
6. Halaman Admin Dashboard sederhana untuk melihat daftar seluruh pesanan yang masuk.

## Keputusan Desain (Design Decisions)
- **Tarif per KM:** Ditetapkan sebesar Rp 150.000 / KM.
- **API Keys & Layanan Eksternal:** Karena API key Google Maps dan Supabase belum disiapkan, pada fase awal pengembangan kita akan menggunakan **mock data** (data tiruan) untuk tampilan peta, perhitungan jarak, dan simulasi penyimpanan database.
- **Keamanan:** Halaman Admin Dashboard akan dilindungi dengan sistem login sederhana. Serta, ketika Supabase sudah siap, proses penyimpanan data akan menggunakan Next.js Server Actions.


## Rencana Perubahan (Proposed Changes)

### 1. Persiapan Proyek (Tech Stack Setup)
- **Framework:** Next.js (App Router, React).
- **Styling:** Tailwind CSS (akan dikustomisasi agar desainnya terlihat modern, dinamis, dan premium sesuai standar aplikasi masa kini).
- **Database:** Supabase.
- **Maps:** Integrasi Google Maps API (Maps JavaScript API & Distance Matrix API).

### 2. Skema Database (Supabase)
Kita akan membuat tabel `orders` di Supabase dengan kolom berikut:
- `id` (UUID)
- `customer_name` (Text)
- `item_type` (Text: motor_kecil, motor_besar, mobil_kecil, mobil_besar, mesin_industri)
- `pickup_lat` (Float) / `pickup_lng` (Float)
- `dropoff_lat` (Float) / `dropoff_lng` (Float)
- `distance_km` (Float)
- `total_price` (Integer)
- `created_at` (Timestamp)

### 3. Halaman Pemesanan (Customer Flow)
#### [NEW] `app/page.tsx` (Landing Page & Form)
- **Desain UI/UX:** Tampilan modern dengan *hero section* yang menarik.
- **Form Interaktif:**
  - Input Nama.
  - Dropdown Jenis Barang.
  - Dua komponen peta interaktif (Google Maps) untuk pelanggan mengeklik/menentukan titik **Jemput** dan titik **Antar**.
- **Logika Perhitungan:**
  - Saat dua titik lokasi sudah dipilih, aplikasi otomatis menghitung jarak menggunakan Google Maps API.
  - Total Harga = `Rp 150.000 + Biaya Tambahan (berdasarkan tipe kendaraan) + (Jarak KM x Tarif per KM)`.
- **Rangkuman Pesanan:** 
  - Menampilkan box rincian pesanan, jarak, dan total biaya kepada pengguna.
  - Menampilkan tombol **"Pesan & Hubungi WhatsApp"**.
- **Aksi Tombol Pesan:**
  1. Menyimpan data pesanan (sementara disimulasikan, nantinya dikirim via Next.js Server Actions ke Supabase).
  2. Membuka tab baru (redirect) ke `wa.me/<NOMOR_ADMIN>` dengan teks *pre-filled* yang rapi berisi rincian pesanan dan jumlah uang yang harus ditransfer ke rekening bank Anda.

### 4. Halaman Admin Dashboard
#### [NEW] `app/admin/page.tsx`
- Halaman internal khusus admin.
- Dilindungi dengan sistem login sederhana (password) agar tidak bisa diakses publik.
- Menampilkan tabel daftar pesanan (sementara menggunakan mock data, nantinya ditarik dari Supabase).
- Menampilkan detail: Nama Pemesan, Jenis Barang, Jarak, Harga Total, dan Waktu Pemesanan.

## Rencana Pengujian (Verification Plan)

### Pengujian Manual (Manual Verification)
1. **Simulasi Pelanggan:** Membuka web, mengisi data, meletakkan *pin* lokasi di peta, dan memastikan jarak serta harga yang muncul sudah terhitung dengan rumus yang benar secara otomatis.
2. **Simulasi Pemesanan:** Mengeklik tombol pesan, memastikan tidak ada pesan *error*, data masuk ke dalam *database* Supabase, dan kita diarahkan ke WhatsApp dengan teks yang sesuai format.
3. **Pengecekan Admin:** Membuka halaman `/admin` dan memastikan pesanan yang baru saja disimulasikan muncul di baris paling atas tabel laporan.
