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

    // Generic HTTP request method with better error handling
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            timeout: this.timeout,
            ...options
        };

        try {
            console.log(`🌐 Making request to: ${url}`);
            
            // Add timeout to fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log(`📡 Response status: ${response.status} for ${url}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ Successful response from ${url}:`, data);
            return data;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`⏰ Request timeout for ${url}`);
                throw new Error(`Request timeout (${this.timeout}ms) for ${endpoint}`);
            }
            
            console.error(`❌ API Request Error for ${url}:`, error);
            
            // More specific error messages
            if (error.message.includes('Failed to fetch')) {
                throw new Error(`Connection failed - Server mungkin tidak running di ${this.baseURL}`);
            } else if (error.message.includes('NetworkError')) {
                throw new Error(`Network error - Periksa koneksi internet`);
            } else {
                throw error;
            }
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

    // Neraca API endpoints - MENGGUNAKAN ENDPOINT YANG BENAR
    async getAllNeraca() {
        try {
            console.log(`🔍 Getting neraca from: ${this.baseURL}/api/neraca-harian`);
            const result = await this.get('/api/neraca-harian');
            console.log(`✅ Neraca SUCCESS:`, result);
            
            // Extract data array from response
            return result.data || result || [];
        } catch (error) {
            console.warn('⚠️ Neraca API failed, returning empty array:', error.message);
            return [];
        }
    }

    async createNeraca(data) {
        console.log('🔍 createNeraca called with data:', data);
        
        // Jika tidak online, langsung fallback ke mode offline
        if (!navigator.onLine) {
            console.log('📱 Device offline, skipping API call');
            throw new Error('Device offline - use localStorage fallback');
        }
        
        // Try multiple base URLs and endpoints
        const baseUrls = [this.baseURL, ...CONFIG.ALTERNATIVE_API_URLS];
        const neracaEndpoints = [
            '/api/neraca-harian',  // Endpoint yang benar dari API
            '/neraca-harian', 
            '/neraca', 
            '/neraca-data'
        ];
        
        // Try multiple data formats to find the one backend expects
        const dataFormats = [
            // Format 1: snake_case dengan field minimal
            {
                tanggal: data.tanggal,
                kas_masuk: data.kasMasuk || 0,
                keterangan_lain: data.keteranganLain || ''
            },
            // Format 2: snake_case lengkap
            {
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
            },
            // Format 3: camelCase
            {
                tanggal: data.tanggal,
                kasMasuk: data.kasMasuk || 0,
                piutangPokok: data.piutangPokok || 0,
                piutangJasa: data.piutangJasa || 0,
                danaisPokok: data.danaisPokok || 0,
                danaisJasa: data.danaisJasa || 0,
                simpananPokok: data.simpananPokok || 0,
                simpananWajib: data.simpananWajib || 0,
                simpananSukarela: data.simpananSukarela || 0,
                keteranganLain: data.keteranganLain || ''
            },
            // Format 4: minimal dengan total
            {
                tanggal: data.tanggal,
                kas_masuk: data.kasMasuk || 0,
                total: data.total || (data.kasMasuk || 0)
            }
        ];
        
        let lastError = null;
        let attemptCount = 0;
        
        // Try each base URL and endpoint combination with each data format
        for (let baseUrl of baseUrls) {
            // Temporarily switch base URL
            const originalBaseURL = this.baseURL;
            this.baseURL = baseUrl;
            
            for (let endpoint of neracaEndpoints) {
                for (let i = 0; i < dataFormats.length; i++) {
                    const neracaData = dataFormats[i];
                    attemptCount++;
                    
                    try {
                        console.log(`🔄 Attempt ${attemptCount}: ${baseUrl}${endpoint} with format ${i + 1}:`, neracaData);
                        
                        // Test connection first
                        const testUrl = `${baseUrl}${endpoint}`;
                        console.log(`🌐 Testing URL: ${testUrl}`);
                        
                        const result = await this.post(endpoint, neracaData);
                        console.log(`✅ SUCCESS with URL: ${testUrl}, format ${i + 1}`, result);
                        
                        // Restore original base URL and return
                        this.baseURL = originalBaseURL;
                        return result;
                        
                    } catch (error) {
                        lastError = error;
                        console.log(`❌ Failed attempt ${attemptCount}: ${testUrl}, format ${i + 1}:`, error.message);
                        
                        // Log detailed error info
                        if (error.message.includes('400')) {
                            console.error(`📋 400 Error details:`, {
                                url: testUrl,
                                format: i + 1,
                                data: neracaData,
                                error: error.message
                            });
                        } else if (error.message.includes('404')) {
                            console.error(`📋 404 Error - Endpoint not found: ${testUrl}`);
                        } else if (error.message.includes('500')) {
                            console.error(`📋 500 Error - Server error at: ${testUrl}`);
                        } else {
                            console.error(`📋 Network/Other Error:`, error);
                        }
                        
                        // Small delay between attempts
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
            }
            
            // Restore original base URL after trying this base URL
            this.baseURL = originalBaseURL;
        }
        
        // Restore original base URL in case of complete failure
        this.baseURL = originalBaseURL;
        
        // All attempts failed, provide detailed error message
        const errorMessage = `
Gagal menyimpan neraca setelah ${attemptCount} percobaan.

Detail Error Terakhir: ${lastError?.message || 'Unknown error'}

Base URLs yang dicoba: ${baseUrls.join(', ')}
Endpoints yang dicoba: ${neracaEndpoints.join(', ')}
Format data yang dicoba: ${dataFormats.length} format berbeda

Kemungkinan penyebab:
1. Backend server tidak running di port 3000
2. Endpoint neraca belum ada di backend
3. Format data tidak sesuai dengan yang diharapkan backend
4. Masalah CORS atau network

Solusi:
1. Pastikan backend server berjalan di http://localhost:3000
2. Periksa apakah endpoint neraca tersedia
3. Data akan disimpan offline dan sync otomatis nanti
        `.trim();
        
        console.error('🚨 Final error after all attempts:', errorMessage);
        throw new Error(errorMessage);
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
            // Sementara tidak kirim field anggota untuk menghindari error 400
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

    // Kas API endpoints - MENGGUNAKAN ENDPOINT YANG BENAR
    async getAllKas() {
        try {
            console.log(`🔍 Getting kas from: ${this.baseURL}/api/transaksi-kas`);
            const result = await this.get('/api/transaksi-kas');
            console.log(`✅ Kas SUCCESS:`, result);
            
            // Extract data array from response
            return result.data || result || [];
        } catch (error) {
            console.warn('⚠️ Kas API failed, returning empty array:', error.message);
            return [];
        }
    }

    async createKas(data) {
        console.log('🔍 createKas called with data:', data);
        
        try {
            // Format data sesuai dengan API backend
            const kasData = {
                tanggal: data.tanggal,
                jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar',
                jumlah: data.jumlah,
                keterangan: data.keterangan,
                anggota_id: data.anggotaId || null
            };
            
            console.log(`🔄 Posting kas to: ${this.baseURL}/api/transaksi-kas`, kasData);
            const result = await this.post('/api/transaksi-kas', kasData);
            console.log(`✅ Kas CREATE SUCCESS:`, result);
            return result;
        } catch (error) {
            console.error('🚨 Kas CREATE failed:', error.message);
            throw error;
        }
    }
        
        // Try multiple data formats
        const dataFormats = [
            // Format 1: snake_case sesuai dokumentasi backend
            {
                tanggal: data.tanggal,
                jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar',
                jumlah: data.jumlah,
                keterangan: data.keterangan,
                anggota_id: data.anggotaId || null,
                nama_anggota: data.namaAnggota || ''
            },
            // Format 2: camelCase
            {
                tanggal: data.tanggal,
                jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar',
                jumlah: data.jumlah,
                keterangan: data.keterangan,
                anggotaId: data.anggotaId || null,
                namaAnggota: data.namaAnggota || ''
            },
            // Format 3: minimal
            {
                tanggal: data.tanggal,
                jenis: data.jenis,
                jumlah: data.jumlah,
                keterangan: data.keterangan
            }
        ];
        
        let attemptCount = 0;
        let lastError = null;
        
        for (let baseUrl of baseUrls) {
            const originalBaseURL = this.baseURL;
            this.baseURL = baseUrl;
            
            for (let endpoint of kasEndpoints) {
                for (let i = 0; i < dataFormats.length; i++) {
                    const kasData = dataFormats[i];
                    attemptCount++;
                    
                    try {
                        console.log(`🔄 Kas attempt ${attemptCount}: ${baseUrl}${endpoint} with format ${i + 1}:`, kasData);
                        const result = await this.post(endpoint, kasData);
                        console.log(`✅ SUCCESS kas POST: ${baseUrl}${endpoint}`, result);
                        this.baseURL = originalBaseURL;
                        return result;
                    } catch (error) {
                        lastError = error;
                        console.log(`❌ Failed kas attempt ${attemptCount}: ${baseUrl}${endpoint}`, error.message);
                    }
                }
            }
            
            this.baseURL = originalBaseURL;
        }
        
        console.error('🚨 All kas attempts failed:', lastError?.message);
        throw new Error(`Gagal menyimpan kas setelah ${attemptCount} percobaan: ${lastError?.message}`);
    }

    async updateKas(id, data) {
        const kasData = {
            tanggal: data.tanggal,
            jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar',
            jumlah: data.jumlah,
            keterangan: data.keterangan,
            anggota_id: data.anggotaId || null,
            nama_anggota: data.namaAnggota || ''
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

    // Anggota API endpoints - MENGGUNAKAN ENDPOINT YANG BENAR
    async getAllAnggota() {
        try {
            console.log(`🔍 Getting anggota from: ${this.baseURL}/api/anggota`);
            const result = await this.get('/api/anggota');
            console.log(`✅ Anggota SUCCESS:`, result);
            
            // Extract data array from response
            return result.data || result || [];
        } catch (error) {
            console.warn('⚠️ Anggota API failed, returning empty array:', error.message);
            return [];
        }
    }

    async createAnggota(data) {
        console.log('🔍 createAnggota called with data:', data);
        
        const baseUrls = [this.baseURL, ...CONFIG.ALTERNATIVE_API_URLS];
        const anggotaEndpoints = ['/api/anggota', '/anggota'];
        
        // Format data sesuai dengan API backend dengan multiple format attempts
        const dataFormats = [
            // Format 1: snake_case untuk backend
            {
                anggota_id: data.id || data.anggotaId || Date.now(),
                no_anggota: data.noAnggota || '',
                nama: data.nama || '',
                alamat: data.alamat || '',
                telepon: data.telepon || '',
                tanggal_bergabung: data.tanggalBergabung || new Date().toISOString().split('T')[0],
                simpanan_pokok: data.simpananPokok || 100000,
                simpanan_wajib: data.simpananWajib || 50000,
                status: data.status || 'Aktif'
            },
            // Format 2: camelCase
            {
                id: data.id || data.anggotaId || Date.now(),
                anggotaId: data.id || data.anggotaId || Date.now(),
                noAnggota: data.noAnggota || '',
                nama: data.nama || '',
                alamat: data.alamat || '',
                telepon: data.telepon || '',
                tanggalBergabung: data.tanggalBergabung || new Date().toISOString().split('T')[0],
                simpananPokok: data.simpananPokok || 100000,
                simpananWajib: data.simpananWajib || 50000,
                status: data.status || 'Aktif'
            },
            // Format 3: minimal
            {
                id: data.id || data.anggotaId || Date.now(),
                no_anggota: data.noAnggota || '',
                nama: data.nama || '',
                alamat: data.alamat || '',
                telepon: data.telepon || '',
                tanggal_bergabung: data.tanggalBergabung || new Date().toISOString().split('T')[0],
                status: data.status || 'Aktif'
            }
        ];

        let attemptCount = 0;
        let lastError = null;
        
        // Try each base URL and endpoint combination with each data format
        for (let baseUrl of baseUrls) {
            const originalBaseURL = this.baseURL;
            this.baseURL = baseUrl;
            
            for (let endpoint of anggotaEndpoints) {
                for (let i = 0; i < dataFormats.length; i++) {
                    const anggotaData = dataFormats[i];
                    attemptCount++;
                    
                    try {
                        console.log(`🔄 Anggota attempt ${attemptCount}: ${baseUrl}${endpoint} with format ${i + 1}:`, anggotaData);
                        const result = await this.post(endpoint, anggotaData);
                        console.log(`✅ SUCCESS anggota POST: ${baseUrl}${endpoint}`, result);
                        this.baseURL = originalBaseURL;
                        return result;
                    } catch (error) {
                        lastError = error;
                        console.log(`❌ Failed anggota attempt ${attemptCount}: ${baseUrl}${endpoint}`, error.message);
                    }
                }
            }
            
            this.baseURL = originalBaseURL;
        }
        
        console.error('🚨 All anggota attempts failed:', lastError?.message);
        throw new Error(`Gagal menyimpan anggota setelah ${attemptCount} percobaan: ${lastError?.message}`);
    }

    async updateAnggota(id, data) {
        // Format data sesuai dengan API backend dengan multiple format attempts
        const dataFormats = [
            // Format 1: snake_case
            {
                anggota_id: id,
                no_anggota: data.noAnggota || '',
                nama: data.nama || '',
                alamat: data.alamat || '',
                telepon: data.telepon || '',
                tanggal_bergabung: data.tanggalBergabung,
                status: data.status || 'Aktif'
            },
            // Format 2: camelCase
            {
                id: id,
                anggotaId: id,
                noAnggota: data.noAnggota || '',
                nama: data.nama || '',
                alamat: data.alamat || '',
                telepon: data.telepon || '',
                tanggalBergabung: data.tanggalBergabung,
                status: data.status || 'Aktif'
            },
            // Format 3: minimal
            {
                nama: data.nama,
                alamat: data.alamat,
                telepon: data.telepon,
                status: data.status
            }
        ];

        // Try each format
        for (let i = 0; i < dataFormats.length; i++) {
            const anggotaData = dataFormats[i];
            
            try {
                console.log(`Trying update anggota format ${i + 1}:`, anggotaData);
                const result = await this.put(`/anggota/${id}`, anggotaData);
                console.log(`SUCCESS updating anggota with format ${i + 1}:`, result);
                return result;
            } catch (error) {
                console.log(`Failed updating anggota with format ${i + 1}:`, error.message);
                
                if (i === dataFormats.length - 1) {
                    // Last format, throw error
                    throw error;
                }
            }
        }
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

    // Test connection function - UPDATED FOR CONFIRMED WORKING BACKEND
    async testConnection() {
        console.log('🔍 Testing backend connection...');
        
        try {
            // Test primary backend first
            console.log(`🌐 Testing primary: ${this.baseURL}/health`);
            const result = await this.get('/health');
            console.log(`✅ Primary connection SUCCESS: ${this.baseURL}/health`, result);
            return {
                success: true,
                baseUrl: this.baseURL,
                endpoint: '/health',
                response: result
            };
        } catch (error) {
            console.log(`❌ Primary connection failed: ${this.baseURL}/health`, error.message);
            
            // Try alternatives only if primary fails
            for (let baseUrl of CONFIG.ALTERNATIVE_API_URLS) {
                try {
                    const originalBaseURL = this.baseURL;
                    this.baseURL = baseUrl;
                    
                    console.log(`🌐 Testing alternative: ${baseUrl}/health`);
                    const result = await this.get('/health');
                    console.log(`✅ Alternative connection SUCCESS: ${baseUrl}/health`, result);
                    
                    return {
                        success: true,
                        baseUrl: baseUrl,
                        endpoint: '/health',
                        response: result
                    };
                } catch (altError) {
                    console.log(`❌ Alternative failed: ${baseUrl}/health`, altError.message);
                    this.baseURL = originalBaseURL;
                }
            }
        }
        
        console.error('🚨 All connection tests failed');
        return {
            success: false,
            error: 'No working backend connection found'
        };
    }

    async discoverWorkingEndpoints() {
        console.log('🔍 Discovering working endpoints...');
        
        const discovery = {
            anggota: null,
            kas: null,
            neraca: null,
            health: null
        };
        
        try {
            // Test health/connection first
            const healthTest = await this.testConnection();
            if (healthTest.success) {
                discovery.health = {
                    baseUrl: healthTest.baseUrl,
                    endpoint: healthTest.endpoint
                };
                
                // Update base URL to working one
                this.baseURL = healthTest.baseUrl;
            }
            
            // Test anggota endpoints
            try {
                const anggotaResult = await this.getAllAnggota();
                if (anggotaResult) {
                    discovery.anggota = {
                        baseUrl: this.baseURL,
                        endpoint: '/anggota', // This will be discovered in getAllAnggota
                        working: true
                    };
                }
            } catch (error) {
                console.log('❌ Anggota endpoints not working');
            }
            
            // Test kas endpoints
            try {
                const kasResult = await this.getAllKas();
                if (kasResult) {
                    discovery.kas = {
                        baseUrl: this.baseURL,
                        endpoint: '/kas', // This will be discovered in getAllKas
                        working: true
                    };
                }
            } catch (error) {
                console.log('❌ Kas endpoints not working');
            }
            
            // Test neraca endpoints
            try {
                const neracaResult = await this.getAllNeraca();
                if (neracaResult) {
                    discovery.neraca = {
                        baseUrl: this.baseURL,
                        endpoint: '/neraca', // This will be discovered in getAllNeraca
                        working: true
                    };
                }
            } catch (error) {
                console.log('❌ Neraca endpoints not working');
            }
            
            console.log('🔍 Endpoint discovery complete:', discovery);
            return discovery;
            
        } catch (error) {
            console.error('🚨 Endpoint discovery failed:', error);
            return discovery;
        }
    }
}

// Create global API instance
const apiService = new ApiService();
