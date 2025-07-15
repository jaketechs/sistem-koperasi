// Configuration for Koperasi Frontend
const CONFIG = {
    // Backend API Configuration - Backend running at port 3000
    API_BASE_URL: 'http://localhost:3000',
    
    // Alternative API URLs to try (in case main URL fails) - Only 3000 and 3001
    ALTERNATIVE_API_URLS: [
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001'
    ],
    
    // Endpoint mapping - SESUAI DENGAN API RESPONSE YANG SEBENARNYA
    ENDPOINTS: {
        // Health & System
        HEALTH: '/health',                    // GET /health
        DB_TEST: '/api/database',            // GET /api/database
        
        // Anggota
        ANGGOTA: '/api/anggota',             // GET, POST /api/anggota
        ANGGOTA_BY_ID: '/api/anggota/:id',   // GET, PUT /api/anggota/:id
        
        // Kas (transaksi-kas)
        KAS: '/api/transaksi-kas',           // GET, POST /api/transaksi-kas
        KAS_BY_ID: '/api/transaksi-kas/:id', // GET, PUT, DELETE /api/transaksi-kas/:id
        KAS_TOP_CONTRIBUTORS: '/api/transaksi-kas/top-contributors', // GET /api/transaksi-kas/top-contributors
        
        // Neraca (neraca-harian)
        NERACA: '/api/neraca-harian',        // GET, POST /api/neraca-harian
        NERACA_BY_ID: '/api/neraca-harian/:id', // GET, PUT, DELETE /api/neraca-harian/:id
        
        // Simpanan
        RIWAYAT_SIMPANAN: '/api/riwayat-simpanan',               // GET, POST /api/riwayat-simpanan
        SIMPANAN_BY_ID: '/api/riwayat-simpanan/:id',             // GET, PUT, DELETE /api/riwayat-simpanan/:id
        
        // Dashboard
        DASHBOARD: '/api/dashboard',                             // GET /api/dashboard
        DASHBOARD_OVERVIEW: '/api/dashboard/overview',           // GET /api/dashboard/overview
        
        // Laporan (Reporting)
        LAPORAN_BULANAN: '/api/laporan/bulanan',                 // GET /api/laporan/bulanan?bulan=1&tahun=2024
        LAPORAN_3BULAN: '/api/laporan/triwulan',                 // GET /api/laporan/triwulan?tahun=2024
        LAPORAN_TAHUNAN: '/api/laporan/tahunan'                  // GET /api/laporan/tahunan?tahun=2024
    },
    
    // Connection Settings
    CONNECTION_CHECK_INTERVAL: 30000, // 30 seconds
    REQUEST_TIMEOUT: 10000, // 10 seconds
    
    // Application Settings
    APP_NAME: 'Sistem Manajemen Koperasi',
    APP_SUBTITLE: 'Pasar Padang Pangan',
    
    // Pagination Settings
    ITEMS_PER_PAGE: 10,
    
    // Date Format
    DATE_FORMAT: {
        locale: 'id-ID',
        options: {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
    },
    
    // Currency Format
    CURRENCY_FORMAT: {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        locale: 'id-ID'
    }
};
