# Sistem Manajemen Koperasi Pasar Padang Pangan

Aplikasi web untuk manajemen keuangan dan administrasi Koperasi Pasar Padang Pangan yang dikembangkan berdasarkan hasil notulensi pertemuan klien pada tanggal 21 Juni 2025.

## 🔗 Integrasi Backend

Sistem ini telah diintegrasikan dengan backend API yang mendukung:
- ✅ **Mode Online/Offline Hybrid**: Otomatis beralih ke localStorage jika backend tidak tersedia
- ✅ **Real-time Connection Monitoring**: Monitor koneksi setiap 30 detik
- ✅ **Auto-sync**: Sinkronisasi data ketika koneksi pulih
- ✅ **Status Indikator**: Menampilkan status koneksi (Online/Offline)

### Konfigurasi Backend
Backend API harus berjalan di `http://localhost:3000/api`

Edit file `assets/js/config.js` untuk mengubah URL backend:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',  // Ubah sesuai kebutuhan
    // ... konfigurasi lainnya
};
```

Lihat file `API_DOCUMENTATION.md` untuk detail lengkap endpoint yang dibutuhkan.

## 📋 Fitur Utama

### 1. Dashboard

- Ringkasan total kas, piutang, simpanan, dan jumlah anggota
- Transaksi terbaru
- Statistik real-time

### 2. Input Neraca Harian (DEBET)

- **Kas**: Input total kas masuk
- **Piutang**:
  - Angsuran Pokok
  - Jasa
- **Piutang Danais**:
  - Angsuran Pokok
  - Jasa
- **Simpanan**:
  - Simpanan Pokok
  - Simpanan Wajib
  - Simpanan Sukarela
- **Keterangan Lain-lain**: Catatan tambahan dan kategori lain

### 3. Kas Koperasi

- Input pemasukan dan pengeluaran kas
- Tracking saldo kas real-time
- Riwayat transaksi lengkap

### 4. Laporan Keuangan

- Generate laporan bulanan
- Rekap neraca dan kas per periode
- Export laporan ke PDF/Print
- Filter berdasarkan bulan dan tahun

### 5. Data Anggota

- CRUD (Create, Read, Update, Delete) data anggota
- Auto-generate nomor anggota
- Status keanggotaan
- Detail informasi anggota

### 6. Manajemen Data

- Export/Import data JSON
- Backup dan restore data
- Penyimpanan lokal (localStorage)

## 🚀 Cara Menggunakan

### Instalasi

1. Clone atau download repository ini
2. Buka file `main.html` di web browser
3. Aplikasi siap digunakan

### Akses

- **Platform**: Laptop/Computer friendly
- **Akses**: Admin (satu orang)
- **Browser**: Modern web browser (Chrome, Firefox, Edge, Safari)

## 📁 Struktur File

```
koperasi/
├── main.html              # File utama aplikasi
├── assets/
│   ├── css/
│   │   └── style.css      # Styling aplikasi
│   └── js/
│       └── app.js         # Logika aplikasi
└── README.md              # Dokumentasi
```

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Storage**: localStorage (browser)

## 💾 Penyimpanan Data

Data disimpan secara lokal di browser menggunakan localStorage:

- `neracaData`: Data neraca harian
- `kasData`: Data transaksi kas
- `anggotaData`: Data anggota koperasi

## 📊 Fitur CRUD

### Neraca Harian

- ✅ Create: Tambah data neraca baru
- ✅ Read: Lihat daftar dan detail neraca
- ⏳ Update: Edit data neraca (dalam pengembangan)
- ✅ Delete: Hapus data neraca

### Kas Koperasi

- ✅ Create: Tambah transaksi kas
- ✅ Read: Lihat riwayat transaksi
- ⏳ Update: Edit transaksi (dalam pengembangan)
- ✅ Delete: Hapus transaksi

### Data Anggota

- ✅ Create: Daftar anggota baru
- ✅ Read: Lihat detail anggota
- ⏳ Update: Edit data anggota (dalam pengembangan)
- ✅ Delete: Hapus data anggota

## 📈 Laporan yang Tersedia

1. **Rekap Bulanan Neraca**

   - Total nilai neraca per bulan
   - Detail transaksi harian
   - Breakdown kas, piutang, dan simpanan

2. **Rekap Bulanan Kas**

   - Total pemasukan dan pengeluaran
   - Saldo akhir periode
   - Detail setiap transaksi

3. **Export Options**
   - Print laporan
   - Save as PDF (melalui print browser)

## 📊 Export Data

Sistem mendukung beberapa format export:

### 1. Export Backup Lengkap
- **JSON**: Backup lengkap semua data (neraca, kas, anggota)
- **CSV**: Export terpisah untuk setiap jenis data
  - File `koperasi_neraca_YYYY-MM-DD.csv`
  - File `koperasi_kas_YYYY-MM-DD.csv`
  - File `koperasi_anggota_YYYY-MM-DD.csv`

### 2. Export per Tabel
Setiap tabel data dilengkapi tombol "CSV" untuk export langsung:
- **Neraca Harian**: Export data neraca dengan semua field
- **Kas Koperasi**: Export transaksi kas dengan detail
- **Data Anggota**: Export daftar anggota lengkap

### 3. Export Laporan Keuangan
- **Print/PDF**: Tampilan laporan untuk print atau save sebagai PDF
- **CSV**: Export laporan dalam format spreadsheet
  - Ringkasan neraca bulanan
  - Ringkasan kas bulanan
  - Total dan subtotal otomatis

### Format CSV
- Encoding UTF-8 dengan BOM untuk kompatibilitas Excel
- Pemisah koma (,) standar
- Handling otomatis untuk teks yang mengandung koma/kutip
- Header kolom dalam bahasa Indonesia

## 🔧 Pengembangan Selanjutnya

- [ ] Fitur edit data (neraca, kas, anggota)
- [ ] Validasi data yang lebih komprehensif
- [ ] Dashboard dengan grafik/chart
- [ ] Export ke Excel
- [ ] Fitur pencarian dan filter
- [ ] Backup otomatis ke cloud
- [ ] Multi-user dengan role management
- [ ] Mobile responsive design
- [ ] Database integration (MySQL/PostgreSQL)

## 🎯 Sesuai Kebutuhan Klien

Aplikasi ini dikembangkan berdasarkan notulensi pertemuan dengan Koperasi Pasar Padang Pangan yang mencakup:

1. ✅ Input neraca harian dengan kolom-kolom yang sesuai
2. ✅ Manajemen kas koperasi (pemasukan & pengeluaran)
3. ✅ Output laporan keuangan bulanan
4. ✅ Tampilan laptop/computer friendly
5. ✅ Akses admin tunggal
6. ✅ Fitur CRUD lengkap

## 📞 Support

Untuk pertanyaan atau saran pengembangan, silakan hubungi tim developer.

---

**Koperasi Pasar Padang Pangan** | _Sistem Manajemen Keuangan Digital_
