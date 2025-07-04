// Configuration for Koperasi Frontend
const CONFIG = {
    // Backend API Configuration - SESUAI DENGAN DOKUMENTASI API
    API_BASE_URL: 'http://localhost:3000/api',
    
    // Alternative API URLs to try (in case main URL fails)
    ALTERNATIVE_API_URLS: [
        'http://localhost:3000',
        'http://localhost:3000/koperasi',
        'http://localhost:3000/v1',
        'http://127.0.0.1:3000/api',
        'http://127.0.0.1:3000'
    ],
    
    // Endpoint mapping - DISESUAIKAN DENGAN BACKEND YANG ADA
    ENDPOINTS: {
        // Health & System
        HEALTH: '/health',                    // GET /health
        DB_TEST: '/db-test',                 // GET /db-test
        LIST_TABLES: '/list-tables',         // GET /list-tables
        CREATE_TABLES: '/create-tables',     // POST /create-tables
        CHECK_TABLES: '/check-tables',       // GET /check-tables
        
        // Anggota
        ANGGOTA: '/anggota',                 // GET, POST /api/anggota
        ANGGOTA_BY_ID: '/anggota/:id',       // GET, PUT /api/anggota/:id
        ANGGOTA_SEARCH: '/anggota/search/:name', // GET /api/anggota/search/:name
        ANGGOTA_ACTIVE: '/anggota/active',   // GET /api/anggota/active
        ANGGOTA_STATS: '/anggota/stats',     // GET /api/anggota/stats
        
        // Kas (bukan 'kas' tapi 'transaksi-kas')
        KAS: '/transaksi-kas',               // GET, POST /api/transaksi-kas
        KAS_SUMMARY: '/transaksi-kas/summary/daily/:date',  // GET /api/transaksi-kas/summary/daily/:date
        KAS_SALDO: '/transaksi-kas/saldo/:date',            // GET /api/transaksi-kas/saldo/:date
        
        // Neraca (bukan 'neraca' tapi 'neraca-harian')
        NERACA: '/neraca-harian',            // GET, POST /api/neraca-harian
        NERACA_BY_DATE: '/neraca-harian/date/:date', // GET /api/neraca-harian/date/:date
        
        // Simpanan
        RIWAYAT_SIMPANAN: '/riwayat-simpanan',               // GET, POST /api/riwayat-simpanan
        SIMPANAN_BY_ANGGOTA: '/riwayat-simpanan/anggota/:id', // GET /api/riwayat-simpanan/anggota/:id
        SIMPANAN_TOTAL: '/riwayat-simpanan/total/:id',        // GET /api/riwayat-simpanan/total/:id
        SIMPANAN_REPORT: '/riwayat-simpanan/report/anggota'   // GET /api/riwayat-simpanan/report/anggota
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
