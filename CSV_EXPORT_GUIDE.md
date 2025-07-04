# Panduan Export CSV - Sistem Manajemen Koperasi

## 📊 Overview

Sistem Manajemen Koperasi mendukung export data dalam format CSV (Comma-Separated Values) yang kompatibel dengan Excel, Google Sheets, dan aplikasi spreadsheet lainnya.

## 🎯 Jenis Export CSV

### 1. Export Backup Lengkap
**Akses**: Sidebar → Export Data → Pilih format CSV

**Fitur**:
- Export selektif: Pilih data mana yang ingin di-export
- Multiple files: Setiap jenis data menghasilkan file terpisah
- Penamaan otomatis dengan timestamp

**File yang dihasilkan**:
```
koperasi_neraca_2025-07-04.csv
koperasi_kas_2025-07-04.csv
koperasi_anggota_2025-07-04.csv
```

### 2. Export per Tabel
**Akses**: Tombol "CSV" di header setiap tabel

**Lokasi tombol**:
- **Neraca Harian**: Tabel Data Neraca Harian
- **Kas Koperasi**: Tabel Daftar Transaksi Kas
- **Data Anggota**: Tabel Daftar Anggota

**Keunggulan**:
- Export instant dari data yang sedang ditampilkan
- Tidak perlu membuka modal dialog
- Sesuai dengan filter/sorting yang aktif

### 3. Export Laporan Keuangan
**Akses**: Halaman Laporan → Generate Laporan → Export → Pilih CSV

**Fitur**:
- Export laporan bulanan yang sudah di-generate
- Include ringkasan dan total
- Format siap untuk analisis

## 📋 Format dan Struktur CSV

### Data Neraca Harian
```csv
Tanggal,Kas Masuk,Piutang Pokok,Piutang Jasa,Danais Pokok,Danais Jasa,Simpanan Pokok,Simpanan Wajib,Simpanan Sukarela,Keterangan Lain,Jumlah Lain,Total
2025-07-01,5000000,2000000,200000,1500000,150000,500000,300000,800000,Pendapatan jasa administrasi,100000,10550000
2025-07-02,3500000,1800000,180000,1200000,120000,400000,250000,600000,Denda keterlambatan,50000,8100000
```

### Data Kas Koperasi
```csv
Tanggal,Jenis,Keterangan,Jumlah
2025-07-01,masuk,Setoran kas awal bulan,5000000
2025-07-01,keluar,Biaya operasional kantor,500000
2025-07-02,masuk,Penerimaan angsuran anggota,3500000
```

### Data Anggota
```csv
No. Anggota,Nama,Telepon,Alamat,Tanggal Bergabung,Status
KPP2025001,Budi Santoso,08123456789,Jl. Pasar Raya No. 12,2025-01-15,Aktif
KPP2025002,Siti Aminah,08234567890,Jl. Mawar No. 5,2025-02-01,Aktif
```

### Laporan Keuangan
```csv
LAPORAN KEUANGAN KOPERASI PASAR PADANG PANGAN
Periode: Juli 2025
Tanggal Export: 04/07/2025

RINGKASAN NERACA HARIAN
Tanggal,Kas Masuk,Piutang Pokok,Piutang Jasa,Danais Pokok,Danais Jasa,Simpanan Pokok,Simpanan Wajib,Simpanan Sukarela,Lain-lain,Total
2025-07-01,5000000,2000000,200000,1500000,150000,500000,300000,800000,100000,10550000
2025-07-02,3500000,1800000,180000,1200000,120000,400000,250000,600000,50000,8100000
TOTAL,8500000,3800000,380000,2700000,270000,900000,550000,1400000,150000,18650000

RINGKASAN KAS
Tanggal,Jenis,Keterangan,Jumlah
2025-07-01,masuk,Setoran kas awal bulan,5000000
2025-07-01,keluar,Biaya operasional kantor,500000

RINGKASAN KAS
Total Pemasukan,8500000
Total Pengeluaran,700000
Saldo Kas,7800000
```

## 🔧 Spesifikasi Teknis

### Encoding
- **UTF-8 with BOM**: Memastikan karakter Indonesia ditampilkan dengan benar di Excel
- **Comma delimiter**: Standar CSV menggunakan pemisah koma

### Handling Data Khusus
- **Teks dengan koma**: Dibungkus dalam tanda kutip ganda
- **Teks dengan kutip**: Escape dengan double quote (`""`)
- **Newline dalam teks**: Dipertahankan dalam quoted field
- **Angka**: Tidak ada formatting, raw number untuk kemudahan kalkulasi

### Nama File
Pattern: `[tipe]_[timestamp].csv`
- `koperasi_neraca_2025-07-04.csv`
- `koperasi_kas_2025-07-04.csv`
- `koperasi_anggota_2025-07-04.csv`
- `laporan_keuangan_Juli_2025.csv`

## 📈 Keunggulan Export CSV

### 1. Kompatibilitas Universal
- ✅ Microsoft Excel (semua versi)
- ✅ Google Sheets
- ✅ LibreOffice Calc
- ✅ Numbers (Mac)
- ✅ Aplikasi database (MySQL, PostgreSQL, dll)

### 2. Fleksibilitas Analisis
- Sorting dan filtering lanjutan
- Pivot tables
- Grafik dan visualisasi
- Formula dan kalkulasi
- Integrasi dengan BI tools

### 3. Backup dan Migrasi
- Format terbuka dan standar
- Ukuran file kecil
- Mudah dibaca manusia
- Version control friendly

## 🛠️ Tips Penggunaan

### 1. Buka di Excel
1. Buka Excel
2. File → Open → Pilih file CSV
3. Jika encoding bermasalah: Data → From Text → Pilih UTF-8

### 2. Buka di Google Sheets
1. Buka Google Sheets
2. File → Import → Upload file CSV
3. Pilih separator: Comma
4. Detect automatically biasanya bekerja dengan baik

### 3. Import ke Database
```sql
LOAD DATA INFILE 'koperasi_kas_2025-07-04.csv'
INTO TABLE kas_koperasi
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

### 4. Analisis Data
- Gunakan filter untuk periode tertentu
- Buat pivot table untuk ringkasan bulanan
- Gunakan formula SUM, AVERAGE untuk kalkulasi
- Buat grafik untuk visualisasi trend

## 🔄 Workflow Rekomendasi

### 1. Backup Rutin
```
Mingguan: Export semua data → Simpan di cloud storage
Bulanan: Export laporan → Arsip untuk audit
Tahunan: Export lengkap → Backup offline
```

### 2. Analisis Bulanan
```
1. Generate laporan bulanan
2. Export ke CSV
3. Buka di Excel/Google Sheets
4. Buat pivot table dan grafik
5. Simpan sebagai template untuk bulan berikutnya
```

### 3. Sharing Data
```
1. Export data yang diperlukan
2. Bersihkan data sensitif jika perlu
3. Share via email/cloud storage
4. Sertakan panduan atau template jika perlu
```

## 🚨 Catatan Penting

### Keamanan Data
- Jangan share file CSV yang berisi data sensitif
- Gunakan password protection di Excel jika perlu
- Hapus file temporary setelah digunakan

### Validasi Data
- Selalu cek jumlah baris setelah export
- Validasi total amount untuk data keuangan
- Periksa format tanggal sesuai kebutuhan

### Performance
- Export data besar mungkin memerlukan waktu
- Browser modern mendukung download multiple files
- Gunakan export per tabel untuk data yang sangat besar

## 📞 Troubleshooting

### Error: "Tidak ada data untuk di-export"
- Pastikan ada data di tabel
- Coba refresh halaman dan load ulang data
- Periksa koneksi internet jika menggunakan mode online

### Encoding bermasalah di Excel
- Gunakan import wizard: Data → From Text
- Pilih UTF-8 encoding
- Atau buka dengan notepad dulu, save as ANSI

### File tidak ter-download
- Periksa browser settings untuk download
- Disable popup blocker
- Coba browser lain jika masih bermasalah

### Data tidak sesuai
- Pastikan sudah generate laporan dulu (untuk export laporan)
- Periksa filter tanggal yang aktif
- Refresh data jika menggunakan mode online
