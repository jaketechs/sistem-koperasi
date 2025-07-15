# Troubleshooting Error 400 pada Neraca

## Masalah
Saat menyimpan data neraca, terjadi error HTTP 400 (Bad Request) yang menunjukkan bahwa backend menolak data yang dikirim.

## Penyebab Umum Error 400
1. **Format field tidak sesuai** - Backend mengharapkan format field name yang berbeda (snake_case vs camelCase)
2. **Endpoint URL salah** - Backend mungkin menggunakan endpoint yang berbeda dari yang didokumentasikan
3. **Field yang tidak didukung** - Backend menolak field tertentu yang tidak ada di database
4. **Validasi data** - Backend memiliki validasi yang lebih ketat
5. **Missing required fields** - Backend membutuhkan field wajib yang tidak dikirim

## Solusi yang Telah Diimplementasi

### 1. Multiple Endpoint Testing
API service sekarang mencoba beberapa endpoint:
- `/neraca-harian` (default berdasarkan config)
- `/neraca` (berdasarkan dokumentasi)
- `/neraca-data` (alternatif)

### 2. Multiple Data Format Testing
API service mencoba 3 format data berbeda:

**Format 1: snake_case (backend umum)**
```json
{
  "tanggal": "2025-01-11",
  "kas_masuk": 100000,
  "piutang_pokok": 50000,
  "simpanan_pokok": 100000,
  "keterangan_lain": "Test"
}
```

**Format 2: camelCase (JavaScript standard)**
```json
{
  "tanggal": "2025-01-11",
  "kasMasuk": 100000,
  "piutangPokok": 50000,
  "simpananPokok": 100000,
  "keteranganLain": "Test"
}
```

**Format 3: Minimal (hanya field penting)**
```json
{
  "tanggal": "2025-01-11",
  "kas_masuk": 100000,
  "total": 100000
}
```

### 3. Detailed Error Logging
Semua error 400 sekarang dicatat dengan detail:
- Endpoint yang digunakan
- Format data yang dikirim
- Response error lengkap

## Testing Tools

### 1. Debug API Tool
File: `debug-api.html`
- Test koneksi API
- Test berbagai format data neraca
- Raw request testing
- Manual form testing

### 2. Browser Console Logging
Buka browser console (F12) untuk melihat:
- Data yang dikirim ke backend
- Response error detail
- Endpoint yang dicoba

## Langkah Debugging

### Step 1: Test Koneksi
1. Buka `debug-api.html`
2. Klik "Test Koneksi"
3. Pastikan API server dapat diakses

### Step 2: Test Get Data
1. Klik "Get All Neraca"
2. Lihat apakah endpoint GET berfungsi
3. Periksa struktur data yang dikembalikan

### Step 3: Test Create Minimal
1. Klik "Create Neraca Minimal"
2. Lihat di console endpoint dan format mana yang berhasil
3. Catat format yang berhasil

### Step 4: Manual Testing
1. Isi form manual test
2. Klik "Test Manual"
3. Bandingkan dengan format yang berhasil di step 3

## Kemungkinan Perlu Update Backend

Jika semua format dan endpoint gagal, kemungkinan backend perlu diupdate:

### 1. Periksa Schema Database
Backend mungkin mengharapkan:
```sql
CREATE TABLE neraca_harian (
  id INTEGER PRIMARY KEY,
  tanggal DATE NOT NULL,
  kas_masuk DECIMAL(15,2),
  piutang_pokok DECIMAL(15,2),
  -- dst...
);
```

### 2. Periksa Endpoint Route
Backend mungkin perlu route:
```javascript
// Express.js example
app.post('/api/neraca', (req, res) => {
  // Validasi dan simpan data
});
```

### 3. Periksa Validasi
Backend mungkin memiliki validasi ketat:
```javascript
const { tanggal, kas_masuk } = req.body;
if (!tanggal) return res.status(400).json({ error: 'Tanggal required' });
if (kas_masuk < 0) return res.status(400).json({ error: 'Kas masuk must be positive' });
```

## Solusi Sementara

Jika backend tidak bisa diupdate segera:

### 1. Mode Offline
Aplikasi otomatis menyimpan ke localStorage jika API gagal:
```javascript
// Data tersimpan di browser
localStorage.setItem('neracaData', JSON.stringify(data));
```

### 2. Data Export
User masih bisa export data ke CSV untuk backup manual.

### 3. Sinkronisasi Nanti
Ketika backend diperbaiki, data offline bisa disinkronkan.

## Monitoring

### 1. Error Tracking
Semua error 400 dicatat dengan detail untuk analisis.

### 2. Success Rate
Monitor berapa persen request yang berhasil vs gagal.

### 3. User Feedback
Informasikan user jika ada masalah backend dan solusi sementara.

## Next Steps

1. **Run debug tool** untuk identifikasi format yang benar
2. **Contact backend developer** dengan hasil debug
3. **Update backend** sesuai format yang dibutuhkan frontend
4. **Test integrasi** setelah backend diupdate
5. **Update dokumentasi** dengan format final yang benar

## File yang Dimodifikasi

- `assets/js/api.js` - Multiple endpoint & format testing
- `debug-api.html` - Comprehensive debugging tool
- `ERROR_400_TROUBLESHOOTING.md` - Dokumentasi ini

## Status Update

✅ **Frontend Ready** - Dapat handle multiple format dan endpoint
⚠️ **Backend Check Needed** - Perlu verifikasi endpoint dan format yang benar
🔄 **Testing Phase** - Gunakan debug tool untuk identifikasi masalah
