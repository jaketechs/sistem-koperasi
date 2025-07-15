# 🏛️ Sistem Manajemen Koperasi Pasar Padang Pangan

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com)

🌐 **[Live Demo](https://jaketechs.github.io/sistem-koperasi)**

> Aplikasi web modern untuk manajemen keuangan dan administrasi Koperasi Pasar Padang Pangan. Mendukung mode online/offline dengan integrasi backend API yang fleksibel.

## 🌟 Fitur Utama

### 📊 Dashboard
- **Real-time Summary**: Total kas, piutang, simpanan, dan jumlah anggota
- **Transaksi Terbaru**: Monitoring aktivitas keuangan terkini
- **Status Koneksi**: Indikator online/offline dengan auto-reconnect

### 🧮 Manajemen Neraca Harian
- **Input Terstruktur**: Kas, piutang, danais, dan simpanan
- **Validasi Otomatis**: Kalkulasi total dan validasi data
- **Edit & Delete**: Fitur CRUD lengkap dengan modal interface

### 💰 Kas Koperasi
- **Pencatatan Transaksi**: Pemasukan dan pengeluaran
- **Saldo Real-time**: Monitoring saldo kas otomatis
- **Laporan Kas**: Ringkasan pemasukan, pengeluaran, dan saldo

### 👥 Manajemen Anggota
- **Database Anggota**: Informasi lengkap anggota koperasi
- **Status Tracking**: Monitoring status keanggotaan
- **Export Data**: Daftar anggota dalam format CSV

### 📈 Laporan Keuangan
- **Laporan Bulanan**: Generate laporan periode tertentu
- **Multiple Format**: Export dalam format Print/PDF dan CSV
- **Analisis Data**: Ringkasan dan total otomatis

### 💾 Export & Import
- **Format Fleksibel**: JSON (backup) dan CSV (spreadsheet)
- **Selective Export**: Pilih data yang ingin di-export
- **Batch Processing**: Export multiple file sekaligus

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/username/koperasi-management.git
cd koperasi-management
```

### 2. Setup Local Server
```bash
# Menggunakan Python (recommended)
python -m http.server 8080

# Atau menggunakan Node.js
npx http-server -p 8080

# Atau menggunakan PHP
php -S localhost:8080
```

### 3. Akses Aplikasi
Buka browser dan akses: `http://localhost:8080`

### 4. Setup Backend (Opsional)
```bash
# Konfigurasi URL backend di assets/js/config.js
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    // ... konfigurasi lainnya
};
```

## 📁 Struktur Proyek

```
koperasi/
├── main.html              # Halaman utama aplikasi
├── api-tester.html         # Tool testing API endpoints
├── csv-test.html           # Tool testing export CSV
├── assets/
│   ├── css/
│   │   └── style.css       # Stylesheet utama
│   └── js/
│       ├── app.js          # Logika aplikasi utama
│       ├── api.js          # Service layer untuk API
│       └── config.js       # Konfigurasi aplikasi
├── docs/
│   ├── README.md           # Dokumentasi lengkap
│   ├── CSV_EXPORT_GUIDE.md # Panduan export CSV
│   ├── EDIT_FEATURES.md    # Dokumentasi fitur edit
│   ├── FIXES_SUMMARY.md    # Ringkasan perbaikan
│   └── API_TROUBLESHOOTING.md # Panduan troubleshooting
├── demo-data.js            # Data demo untuk testing
├── package.json            # Metadata proyek
└── .gitignore             # File yang diabaikan Git
```

## 🔧 Konfigurasi

### Backend Integration
Edit `assets/js/config.js` untuk menyesuaikan konfigurasi:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    CONNECTION_CHECK_INTERVAL: 30000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    // ... konfigurasi lainnya
};
```

### Offline Mode
Aplikasi secara otomatis beralih ke mode offline jika backend tidak tersedia:
- Data disimpan di localStorage
- Indikator status koneksi
- Auto-sync ketika koneksi pulih

## 📊 Export Data

### Format yang Didukung
- **JSON**: Backup lengkap semua data
- **CSV**: Format spreadsheet untuk Excel/Google Sheets

### Cara Export
1. **Backup Lengkap**: Sidebar → Export Data → Pilih format
2. **Per Tabel**: Klik tombol "CSV" di header tabel
3. **Laporan**: Generate laporan → Export → Pilih format

## 🛠️ Development

### Prerequisites
- Browser modern dengan dukungan ES6+
- Local server (Python, Node.js, atau PHP)
- Backend API (opsional)

### Development Setup
```bash
# Clone dan masuk ke directory
git clone https://github.com/username/koperasi-management.git
cd koperasi-management

# Jalankan local server
python -m http.server 8080

# Akses di browser
open http://localhost:8080
```

### Testing
```bash
# Test API endpoints
open http://localhost:8080/api-tester.html

# Test CSV export
open http://localhost:8080/csv-test.html

# Load demo data
# Buka browser console dan jalankan:
# Object.assign(window, demoData); app.loadDemoData();
```

## 🔄 Workflow

### 1. Input Data Harian
```
Dashboard → Neraca Harian → Input data → Simpan
Dashboard → Kas Koperasi → Tambah transaksi → Simpan
```

### 2. Generate Laporan
```
Laporan Keuangan → Pilih periode → Generate → Export
```

### 3. Backup Data
```
Sidebar → Export Data → Pilih format → Download
```

## 🐛 Troubleshooting

### Connection Issues
- Periksa status koneksi di sidebar
- Klik "Test Connection" untuk diagnosa
- Lihat browser console untuk error details

### Export Problems
- Pastikan browser mengizinkan download
- Disable popup blocker
- Periksa format data yang di-export

### Data Validation
- Pastikan semua field required terisi
- Validasi format tanggal (YYYY-MM-DD)
- Periksa tipe data numerik

## 📝 API Documentation

### Required Endpoints
```
GET    /api/health              # Health check
GET    /api/neraca              # Get all neraca
POST   /api/neraca              # Create neraca
PUT    /api/neraca/:id          # Update neraca
DELETE /api/neraca/:id          # Delete neraca
GET    /api/kas                 # Get all kas
POST   /api/kas                 # Create kas
PUT    /api/kas/:id             # Update kas
DELETE /api/kas/:id             # Delete kas
GET    /api/anggota             # Get all anggota
POST   /api/anggota             # Create anggota
PUT    /api/anggota/:id         # Update anggota
DELETE /api/anggota/:id         # Delete anggota
GET    /api/export              # Export all data
POST   /api/import              # Import data
```

Lihat `API_TROUBLESHOOTING.md` untuk detail lengkap.

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Gunakan ES6+ JavaScript
- Follow naming convention yang konsisten
- Tambahkan error handling yang proper
- Update dokumentasi untuk fitur baru
- Test di multiple browser

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Authors

- **Developer Name** - *Initial work* - [GitHub](https://github.com/username)

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com) - UI Framework
- [Font Awesome](https://fontawesome.com) - Icons
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - HTTP requests
- Koperasi Pasar Padang Pangan - Domain expertise

## 🔗 Links

- [Live Demo](https://username.github.io/koperasi-management)
- [Documentation](./docs/README.md)
- [API Guide](./docs/API_TROUBLESHOOTING.md)
- [CSV Export Guide](./docs/CSV_EXPORT_GUIDE.md)
- [Issue Tracker](https://github.com/username/koperasi-management/issues)

---

### 🏷️ Version
**v1.0.0** - Feature complete with CSV export, offline mode, and full CRUD operations.

### 📱 Browser Support
- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 🔐 Security
- No sensitive data stored in localStorage
- CSRF protection ready
- Input validation and sanitization
- XSS protection

---

**Made with ❤️ for Koperasi Pasar Padang Pangan**
