// API Service for Koperasi Management System
class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        this.timeout = CONFIG.REQUEST_TIMEOUT;
    }

    // Generic HTTP request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Neraca API endpoints - MENGGUNAKAN 'neraca-harian' SESUAI DOKUMENTASI
    async getAllNeraca() {
        return this.get('/neraca-harian');
    }

    async createNeraca(data) {
        // Format data sesuai dengan API backend
        const neracaData = {
            tanggal: data.tanggal,
            kas_masuk: data.kasMasuk || 0,
            piutang_pokok: data.piutangPokok || 0,
            piutang_jasa: data.piutangJasa || 0,
            danais_pokok: data.danaisPokok || 0,
            danais_jasa: data.danaisJasa || 0,
            simpanan_pokok: data.simpananPokok || 0,
            simpanan_wajib: data.simpananWajib || 0,
            simpanan_sukarela: data.simpananSukarela || 0,
            keterangan_lain: data.keteranganLain || ''
        };
        return this.post('/neraca-harian', neracaData);
    }

    async updateNeraca(id, data) {
        const neracaData = {
            tanggal: data.tanggal,
            kas_masuk: data.kasMasuk || 0,
            piutang_pokok: data.piutangPokok || 0,
            piutang_jasa: data.piutangJasa || 0,
            danais_pokok: data.danaisPokok || 0,
            danais_jasa: data.danaisJasa || 0,
            simpanan_pokok: data.simpananPokok || 0,
            simpanan_wajib: data.simpananWajib || 0,
            simpanan_sukarela: data.simpananSukarela || 0,
            keterangan_lain: data.keteranganLain || ''
        };
        return this.put(`/neraca-harian/${id}`, neracaData);
    }

    async deleteNeraca(id) {
        return this.delete(`/neraca-harian/${id}`);
    }

    async getNeracaById(id) {
        return this.get(`/neraca-harian/${id}`);
    }

    // Additional neraca methods based on documentation
    async getNeracaByDate(date) {
        return this.get(`/neraca-harian/date/${date}`);
    }

    // Kas API endpoints - MENGGUNAKAN 'transaksi-kas' SESUAI DOKUMENTASI
    async getAllKas() {
        return this.get('/transaksi-kas');
    }

    async createKas(data) {
        // Format data sesuai dengan API backend
        const kasData = {
            tanggal: data.tanggal,
            jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar', // Kapitalisasi sesuai backend
            jumlah: data.jumlah,
            keterangan: data.keterangan
        };
        return this.post('/transaksi-kas', kasData);
    }

    async updateKas(id, data) {
        const kasData = {
            tanggal: data.tanggal,
            jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar',
            jumlah: data.jumlah,
            keterangan: data.keterangan
        };
        return this.put(`/transaksi-kas/${id}`, kasData);
    }

    async deleteKas(id) {
        return this.delete(`/transaksi-kas/${id}`);
    }

    async getKasById(id) {
        return this.get(`/transaksi-kas/${id}`);
    }

    // Additional kas methods based on documentation
    async getKasSummaryDaily(date) {
        return this.get(`/transaksi-kas/summary/daily/${date}`);
    }

    async getKasSaldo(date) {
        return this.get(`/transaksi-kas/saldo/${date}`);
    }

    // Anggota API endpoints - SESUAI DENGAN DOKUMENTASI API
    async getAllAnggota() {
        return this.get('/anggota');
    }

    async createAnggota(data) {
        // Format data sesuai dengan API backend
        const anggotaData = {
            no_anggota: data.noAnggota,
            nama: data.nama,
            alamat: data.alamat || '',
            telepon: data.telepon || '',
            tanggal_bergabung: data.tanggalBergabung,
            simpanan_pokok: data.simpananPokok || 100000,
            simpanan_wajib: data.simpananWajib || 50000,
            status: data.status || 'Aktif'
        };
        return this.post('/anggota', anggotaData);
    }

    async updateAnggota(id, data) {
        const anggotaData = {
            nama: data.nama,
            alamat: data.alamat,
            telepon: data.telepon,
            status: data.status
        };
        return this.put(`/anggota/${id}`, anggotaData);
    }

    async deleteAnggota(id) {
        return this.delete(`/anggota/${id}`);
    }

    async getAnggotaById(id) {
        return this.get(`/anggota/${id}`);
    }

    // Additional anggota methods based on documentation
    async searchAnggotaByName(name) {
        return this.get(`/anggota/search/${name}`);
    }

    async getActiveAnggota() {
        return this.get('/anggota/active');
    }

    async getAnggotaStats() {
        return this.get('/anggota/stats');
    }

    // Riwayat Simpanan API endpoints - BERDASARKAN DOKUMENTASI
    async getAllRiwayatSimpanan() {
        return this.get('/riwayat-simpanan');
    }

    async createRiwayatSimpanan(data) {
        const simpananData = {
            anggota_id: data.anggotaId,
            tanggal: data.tanggal,
            jenis_simpanan: data.jenisSimpanan, // 'Pokok', 'Wajib', 'Sukarela'
            jumlah: data.jumlah,
            keterangan: data.keterangan || ''
        };
        return this.post('/riwayat-simpanan', simpananData);
    }

    async getRiwayatSimpananByAnggota(anggotaId) {
        return this.get(`/riwayat-simpanan/anggota/${anggotaId}`);
    }

    async getTotalSimpananByAnggota(anggotaId) {
        return this.get(`/riwayat-simpanan/total/${anggotaId}`);
    }

    async getReportSimpananAnggota() {
        return this.get('/riwayat-simpanan/report/anggota');
    }

    // System endpoints - BERDASARKAN DOKUMENTASI
    async testDatabase() {
        return this.get('/db-test', { baseURL: this.baseURL.replace('/api', '') });
    }

    async listTables() {
        return this.get('/list-tables', { baseURL: this.baseURL.replace('/api', '') });
    }

    async createTables() {
        return this.post('/create-tables', {}, { baseURL: this.baseURL.replace('/api', '') });
    }

    async checkTables() {
        return this.get('/check-tables', { baseURL: this.baseURL.replace('/api', '') });
    }

    // Dashboard/Summary endpoints
    async getDashboardData() {
        return this.get('/dashboard');
    }

    async getLaporanBulanan(bulan, tahun) {
        return this.get(`/laporan?bulan=${bulan}&tahun=${tahun}`);
    }

    // Export/Import endpoints
    async exportAllData() {
        return this.get('/export');
    }

    async importData(data) {
        return this.post('/import', data);
    }

    // Health check - MENGGUNAKAN ENDPOINT YANG BENAR
    async healthCheck() {
        try {
            console.log('🔍 Checking backend connection...', this.baseURL);
            
            // Try health endpoint from documentation
            const healthEndpoints = ['/health', '/anggota', '/db-test'];
            
            for (const endpoint of healthEndpoints) {
                try {
                    const url = endpoint === '/health' || endpoint === '/db-test' ? 
                        this.baseURL.replace('/api', '') + endpoint : 
                        `${this.baseURL}${endpoint}`;
                    
                    console.log(`🔍 Trying health check: ${url}`);
                    
                    const response = await fetch(url);
                    
                    if (response.ok) {
                        console.log('✅ Backend connection successful at:', url);
                        
                        // Test if it returns valid JSON
                        try {
                            const data = await response.json();
                            console.log('✅ Valid API response:', data);
                            return true;
                        } catch (e) {
                            // Not JSON, but still a valid response
                            console.log('✅ Server responding (non-JSON):', url);
                            return true;
                        }
                    } else {
                        console.log(`❌ Health check failed at ${url} with status:`, response.status);
                    }
                } catch (error) {
                    console.log(`❌ Health check failed at ${endpoint}:`, error.message);
                }
            }
            
            console.log('❌ All health check endpoints failed');
            return false;
        } catch (error) {
            console.log('❌ Backend connection failed:', error.message);
            return false;
        }
    }

    // Test connection function
    async testConnection() {
        console.log('🧪 Testing API connection...');
        console.log('📡 Backend URL:', this.baseURL);
        console.log('📡 Original URL (without /api):', this.baseURL.replace('/api', ''));
        
        try {
            // Test basic server connection first
            console.log('🔍 Testing basic server connection...');
            try {
                const basicResponse = await fetch(this.baseURL.replace('/api', ''));
                console.log('🌐 Basic server response status:', basicResponse.status);
                console.log('🌐 Basic server response headers:', [...basicResponse.headers.entries()]);
            } catch (error) {
                console.log('🌐 Basic server connection failed:', error.message);
            }
            
            // Test health endpoint
            const healthCheck = await this.healthCheck();
            console.log('💓 Health check:', healthCheck ? 'PASSED' : 'FAILED');
            
            // Test different endpoint variations
            const endpointVariations = [
                { name: 'Neraca', endpoints: ['/neraca', '/api/neraca', '/koperasi/neraca'] },
                { name: 'Kas', endpoints: ['/kas', '/api/kas', '/koperasi/kas'] },
                { name: 'Anggota', endpoints: ['/anggota', '/api/anggota', '/koperasi/anggota'] }
            ];
            
            for (const category of endpointVariations) {
                console.log(`\n� Testing ${category.name} endpoints:`);
                
                for (const endpoint of category.endpoints) {
                    try {
                        const url = endpoint.startsWith('/api') ? 
                            `${this.baseURL.replace('/api', '')}${endpoint}` : 
                            `${this.baseURL}${endpoint}`;
                        
                        console.log(`� Trying: ${url}`);
                        const response = await fetch(url);
                        
                        if (response.ok) {
                            const data = await response.json();
                            console.log(`✅ ${category.name} endpoint ACCESSIBLE at: ${url}`);
                            console.log(`� ${category.name} data:`, data);
                            break;
                        } else {
                            console.log(`❌ ${category.name} endpoint failed at ${url} - Status: ${response.status}`);
                        }
                    } catch (error) {
                        console.log(`❌ ${category.name} endpoint error:`, error.message);
                    }
                }
            }
            
            return healthCheck;
        } catch (error) {
            console.error('🚨 Connection test failed:', error);
            return false;
        }
    }

    // Auto-detect correct API structure
    async detectApiStructure() {
        console.log('🔍 Auto-detecting API structure...');
        
        const possibleBases = [
            'http://localhost:3000/api',
            'http://localhost:3000',
            'http://localhost:3000/koperasi',
            'http://localhost:3000/v1'
        ];
        
        const testEndpoints = ['neraca', 'kas', 'anggota', 'health'];
        
        for (const base of possibleBases) {
            console.log(`🔍 Testing base URL: ${base}`);
            
            let successCount = 0;
            for (const endpoint of testEndpoints) {
                try {
                    const response = await fetch(`${base}/${endpoint}`);
                    if (response.ok || response.status === 200) {
                        successCount++;
                        console.log(`✅ ${base}/${endpoint} - Status: ${response.status}`);
                    } else {
                        console.log(`❌ ${base}/${endpoint} - Status: ${response.status}`);
                    }
                } catch (error) {
                    console.log(`❌ ${base}/${endpoint} - Error: ${error.message}`);
                }
            }
            
            if (successCount > 0) {
                console.log(`🎯 Found working API base: ${base} (${successCount}/${testEndpoints.length} endpoints working)`);
                return base;
            }
        }
        
        console.log('❌ No working API base found');
        return null;
    }

    // Update base URL if needed
    async updateBaseUrl() {
        const detectedBase = await this.detectApiStructure();
        if (detectedBase && detectedBase !== this.baseURL) {
            console.log(`🔄 Updating base URL from ${this.baseURL} to ${detectedBase}`);
            this.baseURL = detectedBase;
            return true;
        }
        return false;
    }
}

// Create global API instance
const apiService = new ApiService();
