# Backend Connection Fix - Sistem Koperasi

## Masalah yang Diperbaiki

Error 404 dan 400 saat menyimpan neraca dan data lain ke backend API di http://localhost:3000/

## Perbaikan yang Dilakukan

### 1. **Multi-Endpoint Discovery** 
Mengupdate `api.js` untuk mencoba multiple endpoint dan base URL:
- Base URLs: `http://localhost:3000`, `http://localhost:3000/api`, `http://localhost:3000/koperasi`, dll
- Endpoints untuk Neraca: `/neraca-harian`, `/neraca`, `/neraca-data`, `/api/neraca`, dll
- Endpoints untuk Kas: `/transaksi-kas`, `/kas`, `/api/transaksi-kas`, `/api/kas`, dll  
- Endpoints untuk Anggota: `/anggota`, `/api/anggota`, `/koperasi/anggota`

### 2. **Multi-Format Data Support**
Mencoba multiple format data untuk kompatibilitas dengan berbagai backend:
- `snake_case` format (sesuai dokumentasi API)
- `camelCase` format
- Format minimal dengan field wajib saja

### 3. **Connection Discovery pada Startup**
Mengupdate `app.js` untuk melakukan discovery endpoint saat aplikasi dimulai:
- Auto-detect working backend URL
- Test semua endpoints untuk memastikan koneksi
- Fallback ke mode offline jika backend tidak tersedia

### 4. **Enhanced Error Handling**
- Detailed error logging dengan informasi endpoint dan format yang gagal
- Automatic fallback ke localStorage (offline mode)
- User-friendly error messages

### 5. **Connection Testing Tools**
Membuat `connection-tester.html` untuk debugging:
- Test basic connection ke backend
- Test health endpoints
- Test semua API endpoints
- Manual testing tools

## Cara Menggunakan

### 1. **Gunakan Connection Tester**
```
Buka: connection-tester.html
Klik: "Test Basic Connection" untuk cek koneksi dasar
Klik: "Full Discovery" untuk auto-discovery semua endpoints
```

### 2. **Aplikasi Utama**
```
Buka: main.html
Aplikasi akan otomatis melakukan discovery dan terhubung ke backend yang tersedia
Jika backend tidak ditemukan, akan beralih ke mode offline
```

### 3. **Debugging**
- Buka Developer Console (F12) untuk melihat log detail
- Gunakan connection-tester.html untuk testing manual
- Periksa Network tab untuk melihat request/response

## Files yang Dimodifikasi

1. **assets/js/config.js** - Update base URL dan alternative URLs
2. **assets/js/api.js** - Multi-endpoint discovery dan format support
3. **assets/js/app.js** - Discovery pada startup
4. **connection-tester.html** - Tool untuk testing koneksi
5. **README_CONNECTION_FIX.md** - Dokumentasi ini

## Status Backend Support

✅ **Multi-Base URL**: Mendukung berbagai base URL backend
✅ **Multi-Endpoint**: Mencoba berbagai endpoint pattern
✅ **Multi-Format**: Mendukung snake_case, camelCase, dan minimal format
✅ **Auto-Discovery**: Otomatis menemukan endpoint yang working
✅ **Offline Fallback**: Beralih ke localStorage jika backend tidak ada
✅ **Error Recovery**: Robust error handling dan recovery

## Kemungkinan Backend Patterns yang Didukung

### Pattern 1: API dengan prefix /api
```
GET  http://localhost:3000/api/anggota
POST http://localhost:3000/api/anggota
GET  http://localhost:3000/api/neraca-harian
POST http://localhost:3000/api/neraca-harian
```

### Pattern 2: API tanpa prefix
```
GET  http://localhost:3000/anggota
POST http://localhost:3000/anggota  
GET  http://localhost:3000/neraca
POST http://localhost:3000/neraca
```

### Pattern 3: API dengan prefix koperasi
```
GET  http://localhost:3000/koperasi/anggota
POST http://localhost:3000/koperasi/anggota
```

## Next Steps

1. **Test dengan Backend Aktual**: Jalankan backend server dan test dengan connection-tester.html
2. **Verification**: Pastikan semua CRUD operations bekerja
3. **Performance**: Monitor performa dengan discovery overhead
4. **Documentation**: Update API documentation dengan endpoint yang confirmed working

## Troubleshooting

### Jika masih error 404:
1. Pastikan backend server berjalan di port 3000
2. Gunakan connection-tester.html untuk test manual endpoints
3. Periksa console log untuk melihat endpoints mana yang dicoba
4. Verifikasi structure endpoints di backend

### Jika error 400:
1. Periksa format data yang dikirim vs yang diharapkan backend
2. Lihat console log untuk format data details
3. Test dengan format minimal dulu

### Jika connection timeout:
1. Periksa apakah backend server responsive
2. Coba dengan base URL alternatif
3. Check firewall/network issues
