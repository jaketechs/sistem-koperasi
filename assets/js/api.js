// API Service for Koperasi Management System - SIMPLIFIED VERSION
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
                // Try to get error details from response body
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage += ` - ${errorData.message}`;
                    }
                } catch (e) {
                    // If can't parse error response, use default message
                }
                throw new Error(errorMessage);
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

    // Health check
    async healthCheck() {
        try {
            console.log('🔍 Health check...');
            const result = await this.get('/health');
            console.log('✅ Health check result:', result);
            return result && (result.status === 'OK' || result.success === true);
        } catch (error) {
            console.log('❌ Health check failed:', error.message);
            return false;
        }
    }

    // Simple connection test
    async simpleHealthCheck() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                return data && (data.status === 'OK' || data.success === true);
            }
            return false;
        } catch (error) {
            console.log('❌ Simple health check failed:', error.message);
            return false;
        }
    }

    // NERACA API ENDPOINTS
    async getAllNeraca() {
        try {
            console.log(`🔍 Getting neraca from: ${this.baseURL}/api/neraca-harian`);
            const result = await this.get('/api/neraca-harian');
            console.log(`✅ Neraca SUCCESS:`, result);
            
            // Return the full response so app.js can access .data property
            return result;
        } catch (error) {
            console.warn('⚠️ Neraca API failed, returning empty response:', error.message);
            return { data: [] };
        }
    }

    async createNeraca(data) {
        console.log('🔍 createNeraca called with data:', data);
        
        try {
            // Format data sesuai dengan API backend
            const neracaData = {
                tanggal: data.tanggal,
                kas_masuk: Number(data.kasMasuk) || 0,
                piutang_pokok: Number(data.piutangPokok) || 0,
                piutang_jasa: Number(data.piutangJasa) || 0,
                danais_pokok: Number(data.danaisPokok) || 0,
                danais_jasa: Number(data.danaisJasa) || 0,
                simpanan_pokok: Number(data.simpananPokok) || 0,
                simpanan_wajib: Number(data.simpananWajib) || 0,
                simpanan_sukarela: Number(data.simpananSukarela) || 0,
                keterangan_lain: String(data.keteranganLain || ''),
                anggota_id: data.anggotaId ? Number(data.anggotaId) : null
            };
            
            console.log(`🔄 Posting neraca to: ${this.baseURL}/api/neraca-harian`);
            console.log(`📋 Formatted data:`, neracaData);
            
            const result = await this.post('/api/neraca-harian', neracaData);
            console.log(`✅ Neraca CREATE SUCCESS:`, result);
            return result;
        } catch (error) {
            console.error('🚨 Neraca CREATE failed:', error.message);
            console.error('🚨 Original data:', data);
            throw error;
        }
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
        return this.put(`/api/neraca-harian/${id}`, neracaData);
    }

    async deleteNeraca(id) {
        return this.delete(`/api/neraca-harian/${id}`);
    }

    async getNeracaById(id) {
        return this.get(`/api/neraca-harian/${id}`);
    }

    // KAS API ENDPOINTS
    async getAllKas() {
        try {
            console.log(`🔍 Getting kas from: ${this.baseURL}/api/transaksi-kas`);
            const result = await this.get('/api/transaksi-kas');
            console.log(`✅ Kas SUCCESS:`, result);
            
            // Return the full response so app.js can access .data property
            return result;
        } catch (error) {
            console.warn('⚠️ Kas API failed, returning empty response:', error.message);
            return { data: [] };
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

    async updateKas(id, data) {
        const kasData = {
            tanggal: data.tanggal,
            jenis: data.jenis === 'masuk' ? 'Masuk' : 'Keluar',
            jumlah: data.jumlah,
            keterangan: data.keterangan,
            anggota_id: data.anggotaId || null
        };
        return this.put(`/api/transaksi-kas/${id}`, kasData);
    }

    async deleteKas(id) {
        return this.delete(`/api/transaksi-kas/${id}`);
    }

    async getKasById(id) {
        return this.get(`/api/transaksi-kas/${id}`);
    }

    // ANGGOTA API ENDPOINTS
    async getAllAnggota() {
        try {
            console.log(`🔍 Getting anggota from: ${this.baseURL}/api/anggota`);
            const result = await this.get('/api/anggota');
            console.log(`✅ Anggota SUCCESS:`, result);
            
            // Return the full response so app.js can access .data property
            return result;
        } catch (error) {
            console.warn('⚠️ Anggota API failed, returning empty response:', error.message);
            return { data: [] };
        }
    }

    async createAnggota(data) {
        console.log('🔍 createAnggota called with data:', data);
        
        try {
            // Format data sesuai dengan API backend
            const anggotaData = {
                no_anggota: data.noAnggota || '',
                nama: data.nama || '',
                alamat: data.alamat || '',
                telepon: data.telepon || '',
                tanggal_bergabung: data.tanggalBergabung || new Date().toISOString().split('T')[0],
                simpanan_pokok: data.simpananPokok || 100000,
                simpanan_wajib: data.simpananWajib || 50000,
                status: data.status || 'Aktif'
            };
            
            console.log(`🔄 Posting anggota to: ${this.baseURL}/api/anggota`, anggotaData);
            const result = await this.post('/api/anggota', anggotaData);
            console.log(`✅ Anggota CREATE SUCCESS:`, result);
            return result;
        } catch (error) {
            console.error('🚨 Anggota CREATE failed:', error.message);
            throw error;
        }
    }

    async updateAnggota(id, data) {
        const anggotaData = {
            no_anggota: data.noAnggota || '',
            nama: data.nama || '',
            alamat: data.alamat || '',
            telepon: data.telepon || '',
            tanggal_bergabung: data.tanggalBergabung || new Date().toISOString().split('T')[0],
            simpanan_pokok: data.simpananPokok || 100000,
            simpanan_wajib: data.simpananWajib || 50000,
            status: data.status || 'Aktif'
        };
        return this.put(`/api/anggota/${id}`, anggotaData);
    }

    async deleteAnggota(id) {
        return this.delete(`/api/anggota/${id}`);
    }

    async getAnggotaById(id) {
        return this.get(`/api/anggota/${id}`);
    }

    // DASHBOARD API ENDPOINTS
    async getDashboard() {
        return this.get('/api/dashboard');
    }

    async getDashboardOverview() {
        return this.get('/api/dashboard/overview');
    }

    // REPORTING API ENDPOINTS
    async getLaporanBulanan(bulan, tahun) {
        try {
            console.log(`🔍 Getting laporan bulanan for bulan ${bulan}, tahun ${tahun}`);
            const endpoint = `/api/laporan/bulanan?bulan=${bulan}&tahun=${tahun}`;
            const result = await this.get(endpoint);
            console.log(`✅ Laporan bulanan SUCCESS:`, result);
            return result;
        } catch (error) {
            console.warn('⚠️ Laporan bulanan API failed:', error.message);
            throw error;
        }
    }

    async getLaporan3Bulan(tahun) {
        try {
            console.log(`🔍 Getting laporan triwulan for tahun ${tahun}`);
            const endpoint = `/api/laporan/triwulan?tahun=${tahun}`;
            const result = await this.get(endpoint);
            console.log(`✅ Laporan triwulan SUCCESS:`, result);
            return result;
        } catch (error) {
            console.warn('⚠️ Laporan triwulan API failed:', error.message);
            throw error;
        }
    }

    async getLaporanTahunan(tahun) {
        try {
            console.log(`🔍 Getting laporan tahunan for tahun ${tahun}`);
            const endpoint = `/api/laporan/tahunan?tahun=${tahun}`;
            const result = await this.get(endpoint);
            console.log(`✅ Laporan tahunan SUCCESS:`, result);
            return result;
        } catch (error) {
            console.warn('⚠️ Laporan tahunan API failed:', error.message);
            throw error;
        }
    }

    // Test connection function
    async testConnection() {
        console.log('🔍 Testing backend connection...');
        
        try {
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
}

// Create global API service instance
const apiService = new ApiService();
