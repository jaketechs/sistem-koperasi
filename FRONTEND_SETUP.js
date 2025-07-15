// Simple Python HTTP Server untuk Frontend
// Jalankan dengan: python -m http.server 8080

// Atau gunakan Live Server VS Code extension
// Atau buka langsung file:///path/to/main.html

console.log(`
🚀 FRONTEND SETUP INSTRUCTIONS:

OPTION 1 - File System (Recommended):
   Buka: file:///e:/kuliah_sem_6/koperasi/koperasi/main.html

OPTION 2 - Python HTTP Server:
   1. Buka terminal di folder koperasi
   2. Jalankan: python -m http.server 8080
   3. Buka: http://localhost:8080/main.html

OPTION 3 - Live Server (VS Code):
   1. Install Live Server extension di VS Code
   2. Right-click main.html > "Open with Live Server"

BACKEND API: http://localhost:3000/
FRONTEND: http://localhost:8080/ (jika menggunakan server)

Error 404 terjadi karena frontend mencoba akses HTML melalui backend API.
Frontend harus dijalankan terpisah dari backend API.
`);
