# API Documentation untuk Backend Koperasi

## Troubleshooting 404 Error

Jika Anda mendapat error 404, kemungkinan struktur API backend berbeda. Berikut adalah langkah troubleshooting:

### 1. Cek Struktur API Backend

Pastikan backend Anda memiliki struktur endpoint seperti ini:

```
http://localhost:3000/
├── api/
│   ├── health          (GET)
│   ├── neraca          (GET, POST)
│   ├── neraca/:id      (GET, PUT, DELETE)
│   ├── kas             (GET, POST)
│   ├── kas/:id         (GET, PUT, DELETE)
│   ├── anggota         (GET, POST)
│   ├── anggota/:id     (GET, PUT, DELETE)
│   ├── laporan         (GET)
│   ├── export          (GET)
│   └── import          (POST)
```

### 2. Alternatif Struktur API

Jika struktur API Anda berbeda, edit file `config.js`:

#### Opsi 1: Tanpa prefix `/api`
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000',
    // ...
};
```

#### Opsi 2: Dengan prefix lain
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/koperasi',
    // ...
};
```

#### Opsi 3: Versi API
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/v1',
    // ...
};
```

### 3. Test Manual via Browser

Buka browser dan test endpoint ini:

1. **Health Check**: `http://localhost:3000/api/health`
2. **Get Neraca**: `http://localhost:3000/api/neraca`
3. **Get Kas**: `http://localhost:3000/api/kas`
4. **Get Anggota**: `http://localhost:3000/api/anggota`

### 4. Test via cURL

```bash
# Test health check
curl -X GET http://localhost:3000/api/health

# Test neraca
curl -X GET http://localhost:3000/api/neraca

# Test kas
curl -X GET http://localhost:3000/api/kas

# Test anggota
curl -X GET http://localhost:3000/api/anggota
```

### 5. Format Response yang Diharapkan

Backend harus mengembalikan JSON dengan format:

```json
{
    "success": true,
    "data": [...],
    "message": "Success"
}
```

### 6. CORS Configuration

Pastikan backend mengizinkan request dari frontend:

```javascript
// Express.js example
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

### 7. Debugging Frontend

1. Buka Developer Tools (F12)
2. Klik tab Console
3. Klik tombol "Test Connection" di sidebar
4. Lihat log untuk detail error

### 8. Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Endpoint tidak ada | Cek struktur API |
| CORS Error | CORS tidak dikonfigurasi | Setup CORS di backend |
| Network Error | Backend tidak jalan | Start backend server |
| 500 Internal Error | Error di backend | Cek log backend |

### 9. Backend Requirements

Minimal endpoint yang harus ada:

```javascript
// Health check
GET /api/health
Response: 200 OK

// Neraca endpoints
GET /api/neraca
POST /api/neraca
PUT /api/neraca/:id
DELETE /api/neraca/:id

// Kas endpoints
GET /api/kas
POST /api/kas
PUT /api/kas/:id
DELETE /api/kas/:id

// Anggota endpoints
GET /api/anggota
POST /api/anggota
PUT /api/anggota/:id
DELETE /api/anggota/:id
```

### 10. Quick Fix

Jika masih error 404, coba ganti URL di `config.js`:

```javascript
// Ganti dari:
API_BASE_URL: 'http://localhost:3000/api',

// Ke:
API_BASE_URL: 'http://localhost:3000',
```

Lalu refresh halaman dan test lagi.
