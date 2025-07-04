# Backend API Documentation

## Base URL
`http://localhost:3000/api`

## Expected API Endpoints

### Health Check
- **GET** `/health`
- **Response**: `{ "status": "ok" }`

### Neraca Endpoints
- **GET** `/neraca` - Get all neraca data
- **POST** `/neraca` - Create new neraca entry
- **PUT** `/neraca/:id` - Update neraca entry
- **DELETE** `/neraca/:id` - Delete neraca entry
- **GET** `/neraca/:id` - Get specific neraca entry

### Kas Endpoints
- **GET** `/kas` - Get all kas transactions
- **POST** `/kas` - Create new kas transaction
- **PUT** `/kas/:id` - Update kas transaction
- **DELETE** `/kas/:id` - Delete kas transaction
- **GET** `/kas/:id` - Get specific kas transaction

### Anggota Endpoints
- **GET** `/anggota` - Get all member data
- **POST** `/anggota` - Create new member
- **PUT** `/anggota/:id` - Update member
- **DELETE** `/anggota/:id` - Delete member
- **GET** `/anggota/:id` - Get specific member

### Dashboard Endpoint
- **GET** `/dashboard` - Get dashboard summary data

### Laporan Endpoint
- **GET** `/laporan?bulan=<month>&tahun=<year>` - Get monthly report

### Export/Import Endpoints
- **GET** `/export` - Export all data
- **POST** `/import` - Import data

## Data Structures

### Neraca Data
```json
{
  "id": "number",
  "tanggal": "YYYY-MM-DD",
  "kasMasuk": "number",
  "piutangPokok": "number",
  "piutangJasa": "number",
  "danaisPokok": "number",
  "danaisJasa": "number",
  "simpananPokok": "number",
  "simpananWajib": "number",
  "simpananSukarela": "number",
  "keteranganLain": "string",
  "jumlahLain": "number",
  "total": "number"
}
```

### Kas Data
```json
{
  "id": "number",
  "tanggal": "YYYY-MM-DD",
  "jenis": "masuk|keluar",
  "jumlah": "number",
  "keterangan": "string"
}
```

### Anggota Data
```json
{
  "id": "number",
  "noAnggota": "string",
  "nama": "string",
  "telepon": "string",
  "tanggalBergabung": "YYYY-MM-DD",
  "alamat": "string",
  "status": "Aktif|Nonaktif"
}
```

## Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": "actual data"
}
```

For errors:
```json
{
  "success": false,
  "message": "Error message",
  "error": "detailed error information"
}
```

## CORS Configuration

Make sure your backend has CORS enabled to allow requests from your frontend:

```javascript
// Example for Express.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

## Notes

- The frontend will automatically fall back to localStorage if the backend is unavailable
- Connection status is monitored every 30 seconds
- Data is synchronized when the connection is restored
- Make sure all endpoints return proper HTTP status codes (200, 201, 400, 404, 500, etc.)
