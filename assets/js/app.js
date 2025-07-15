// JavaScript for Koperasi Management System
// Backend API Integration
class KoperasiApp {
    constructor() {
        this.neracaData = [];
        this.kasData = [];
        this.anggotaData = [];
        this.isOnline = false;
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Koperasi App...');
        
        // Set initial status
        this.updateConnectionStatus(false);
        
        // Test backend connection
        console.log('🔍 Testing backend connection...');
        try {
            const connectionTest = await apiService.testConnection();
            
            if (connectionTest.success) {
                this.isOnline = true;
                console.log(`✅ Backend connected at: ${connectionTest.baseUrl}`);
                this.updateConnectionStatus(true);
                this.showAlert('success', `✅ Terhubung ke server backend: ${connectionTest.baseUrl}`);
                
                // Load data from backend
                await this.loadAllData();
            } else {
                throw new Error(connectionTest.error || 'Connection test failed');
            }
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            this.isOnline = false;
            this.updateConnectionStatus(false);
            this.showAlert('warning', '⚠️ Tidak dapat terhubung ke server backend. Menggunakan mode offline.');
            
            // Load offline data
            this.loadOfflineData();
        }

        // Initialize UI
        this.updateCurrentDate();
        this.updateDashboard();
        this.loadNeracaTable();
        this.loadKasTable();
        this.loadAnggotaTable();
        this.updateKasSummary();
        this.setupEventListeners();
        this.startConnectionMonitoring();
        
        console.log(`📊 App initialized - Status: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
        console.log(`📈 Data counts - Anggota: ${this.anggotaData.length}, Kas: ${this.kasData.length}, Neraca: ${this.neracaData.length}`);
    }

    loadOfflineData() {
        console.log('📱 Loading offline data from localStorage...');
        try {
            this.neracaData = JSON.parse(localStorage.getItem('neracaData')) || [];
            this.kasData = JSON.parse(localStorage.getItem('kasData')) || [];
            this.anggotaData = JSON.parse(localStorage.getItem('anggotaData')) || [];
            
            console.log('📱 Offline data loaded:', {
                neraca: this.neracaData.length,
                kas: this.kasData.length,
                anggota: this.anggotaData.length
            });
        } catch (error) {
            console.error('❌ Failed to load offline data:', error);
            // Initialize with empty arrays
            this.neracaData = [];
            this.kasData = [];
            this.anggotaData = [];
        }
    }

    async checkBackendConnection() {
        try {
            console.log('🔍 Checking backend connection...');
            
            // Use simple health check first
            const isHealthy = await apiService.simpleHealthCheck();
            
            if (isHealthy) {
                console.log('✅ Backend connection successful');
                this.updateConnectionStatus(true);
                return true;
            } else {
                throw new Error('Health check failed');
            }
        } catch (error) {
            console.warn('❌ Backend connection failed:', error.message);
            this.updateConnectionStatus(false);
            return false;
        }
    }

    updateConnectionStatus(isOnline) {
        this.isOnline = isOnline;
        
        // Update main status indicator
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            if (isOnline) {
                statusElement.innerHTML = '<i class="fas fa-wifi text-success"></i> Online';
                statusElement.className = 'badge bg-success';
            } else {
                statusElement.innerHTML = '<i class="fas fa-wifi-slash text-danger"></i> Offline';
                statusElement.className = 'badge bg-danger';
            }
        }

        // Update test connection button
        const testButton = document.querySelector('[onclick="app.testConnection()"]');
        if (testButton) {
            if (isOnline) {
                testButton.className = 'btn btn-outline-success btn-sm me-2';
                testButton.innerHTML = '<i class="fas fa-wifi"></i> Online';
            } else {
                testButton.className = 'btn btn-outline-danger btn-sm me-2';
                testButton.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
            }
        }

        // Update navbar indicator
        const navStatus = document.getElementById('navConnectionStatus');
        if (navStatus) {
            navStatus.className = `badge ${isOnline ? 'bg-success' : 'bg-danger'}`;
            navStatus.innerHTML = `<i class="fas fa-${isOnline ? 'wifi' : 'wifi-slash'}"></i> ${isOnline ? 'Online' : 'Offline'}`;
        }
    }

    startConnectionMonitoring() {
        console.log('🔄 Starting connection monitoring...');
        
        // Initial check
        this.checkBackendConnection();
        
        // Check connection every 30 seconds
        this.connectionInterval = setInterval(async () => {
            const wasOnline = this.isOnline;
            const isNowOnline = await this.checkBackendConnection();
            
            // If connection status changed, show notification and take action
            if (wasOnline !== isNowOnline) {
                if (isNowOnline) {
                    console.log('🎉 Connection restored!');
                    this.showAlert('success', '🎉 Koneksi ke server berhasil dipulihkan! Memuat data terbaru...');
                    // Reload data from server when back online
                    try {
                        await this.loadAllData();
                        this.updateDashboard();
                        this.loadNeracaTable();
                        this.loadKasTable();
                        this.loadAnggotaTable();
                    } catch (error) {
                        console.error('Failed to reload data after connection restored:', error);
                    }
                } else {
                    console.log('⚠️ Connection lost!');
                    this.showAlert('warning', '⚠️ Koneksi ke server terputus. Beralih ke mode offline.');
                }
            }
        }, CONFIG.CONNECTION_CHECK_INTERVAL);
    }

    stopConnectionMonitoring() {
        if (this.connectionInterval) {
            clearInterval(this.connectionInterval);
            this.connectionInterval = null;
            console.log('⏹️ Connection monitoring stopped');
        }
    }

    // Manual test connection function
    async testConnection() {
        console.log('🧪 Manual connection test triggered');
        this.showAlert('info', '🔍 Testing connection...');
        
        const isConnected = await this.checkBackendConnection();
        
        if (isConnected) {
            this.showAlert('success', '✅ Connection test successful! Backend is reachable.');
            // Try to reload data
            try {
                await this.loadAllData();
                this.showAlert('success', '📊 Data successfully reloaded from backend!');
                this.updateDashboard();
                this.loadNeracaTable();
                this.loadKasTable();
                this.loadAnggotaTable();
            } catch (error) {
                this.showAlert('warning', 'Connection OK but failed to load data. Check console for details.');
            }
        } else {
            this.showAlert('error', '❌ Connection test failed! Backend is not reachable.');
        }
    }

    async loadAllData() {
        try {
            console.log('📡 Fetching data from backend...');
            
            const [neracaResponse, kasResponse, anggotaResponse] = await Promise.all([
                apiService.getAllNeraca(),
                apiService.getAllKas(),
                apiService.getAllAnggota()
            ]);

            console.log('📥 Raw API responses:', {
                neraca: neracaResponse,
                kas: kasResponse,
                anggota: anggotaResponse
            });

            this.neracaData = neracaResponse.data || [];
            this.kasData = kasResponse.data || [];
            
            // Normalize anggota data to handle both camelCase and snake_case
            this.anggotaData = (anggotaResponse.data || []).map(item => ({
                id: item.id,
                noAnggota: item.noAnggota || item.no_anggota || '',
                nama: item.nama || '',
                alamat: item.alamat || '',
                telepon: item.telepon || '',
                tanggalBergabung: item.tanggalBergabung || item.tanggal_bergabung || '',
                simpananPokok: item.simpananPokok || item.simpanan_pokok || 0,
                simpananWajib: item.simpananWajib || item.simpanan_wajib || 0,
                status: item.status || 'Aktif',
                // Keep original fields for backward compatibility
                ...item
            }));

            console.log('✅ Data loaded successfully:', {
                neraca: this.neracaData.length,
                kas: this.kasData.length,
                anggota: this.anggotaData.length
            });
            
            // Save to localStorage as backup
            localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
            localStorage.setItem('kasData', JSON.stringify(this.kasData));
            localStorage.setItem('anggotaData', JSON.stringify(this.anggotaData));
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showAlert('error', 'Gagal memuat data dari server');
            throw error;
        }
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('neracaHarianForm').addEventListener('submit', (e) => this.submitNeraca(e));
        document.getElementById('kasFormElement').addEventListener('submit', (e) => this.submitKas(e));
        document.getElementById('anggotaFormElement').addEventListener('submit', (e) => this.submitAnggota(e));

        // Auto-generate member number
        document.getElementById('namaAnggota').addEventListener('input', () => this.generateMemberNumber());
    }

    // Navigation Functions
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Find and activate the clicked nav link
        const clickedLink = document.querySelector(`[onclick="app.showSection('${sectionId}')"]`);
        if (clickedLink) {
            clickedLink.classList.add('active');
        }
    }

    // Date Functions
    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', options);
    }

    // Dashboard Functions
    updateDashboard() {
        // Hitung total kas dengan normalisasi jenis transaksi
        const totalKas = (this.kasData || []).reduce((sum, item) => {
            const jumlah = parseFloat(item.jumlah || 0);
            const jenis = (item.jenis || '').toLowerCase();
            
            // Normalize jenis field - support berbagai format
            const isMasuk = jenis === 'masuk' || jenis.includes('masuk') || jenis === 'pemasukan';
            
            return sum + (isMasuk ? jumlah : -jumlah);
        }, 0);
        
        // Hitung total piutang dengan safe parsing
        const totalPiutang = (this.neracaData || []).reduce((sum, item) => {
            const piutangPokok = parseFloat(item.piutang_pokok || item.piutangPokok || 0);
            const piutangJasa = parseFloat(item.piutang_jasa || item.piutangJasa || 0);
            const danaisPokok = parseFloat(item.danais_pokok || item.danaisPokok || 0);
            const danaisJasa = parseFloat(item.danais_jasa || item.danaisJasa || 0);
            
            return sum + piutangPokok + piutangJasa + danaisPokok + danaisJasa;
        }, 0);
        
        // Hitung total simpanan dengan safe parsing
        const totalSimpanan = (this.neracaData || []).reduce((sum, item) => {
            const simpananPokok = parseFloat(item.simpanan_pokok || item.simpananPokok || 0);
            const simpananWajib = parseFloat(item.simpanan_wajib || item.simpananWajib || 0);
            const simpananSukarela = parseFloat(item.simpanan_sukarela || item.simpananSukarela || 0);
            
            return sum + simpananPokok + simpananWajib + simpananSukarela;
        }, 0);

        // Update dashboard cards
        document.getElementById('totalKas').textContent = this.formatCurrency(totalKas);
        document.getElementById('totalPiutang').textContent = this.formatCurrency(totalPiutang);
        document.getElementById('totalSimpanan').textContent = this.formatCurrency(totalSimpanan);
        document.getElementById('totalAnggota').textContent = (this.anggotaData || []).length;

        // Set current date
        const currentDate = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('currentDate').textContent = currentDate;

        this.updateRecentTransactions();
    }

    updateRecentTransactions() {
        const kasTransactions = (this.kasData || []).map(k => {
            const jenis = (k.jenis || '').toLowerCase();
            const isMasuk = jenis === 'masuk' || jenis.includes('masuk') || jenis === 'pemasukan';
            
            // Get nama anggota berdasarkan anggota_id
            let namaAnggota = '-';
            if (k.anggota_id) {
                const anggota = this.anggotaData.find(a => 
                    String(a.id) === String(k.anggota_id) || 
                    String(a.anggota_id) === String(k.anggota_id)
                );
                namaAnggota = anggota ? anggota.nama : `ID: ${k.anggota_id}`;
            }
            
            return {
                tanggal: k.tanggal || '',
                jenis: isMasuk ? 'Pemasukan' : 'Pengeluaran',
                anggota: namaAnggota,
                keterangan: k.keterangan || '',
                jumlah: parseFloat(k.jumlah || 0)
            };
        });

        const neracaTransactions = (this.neracaData || []).map(n => {
            // Hitung total neraca dengan safe parsing
            const kasMasuk = parseFloat(n.kas_masuk || n.kasMasuk || 0);
            const piutangPokok = parseFloat(n.piutang_pokok || n.piutangPokok || 0);
            const piutangJasa = parseFloat(n.piutang_jasa || n.piutangJasa || 0);
            const danaisPokok = parseFloat(n.danais_pokok || n.danaisPokok || 0);
            const danaisJasa = parseFloat(n.danais_jasa || n.danaisJasa || 0);
            const simpananPokok = parseFloat(n.simpanan_pokok || n.simpananPokok || 0);
            const simpananWajib = parseFloat(n.simpanan_wajib || n.simpananWajib || 0);
            const simpananSukarela = parseFloat(n.simpanan_sukarela || n.simpananSukarela || 0);
            const jumlahLain = parseFloat(n.keterangan_lain_jumlah || n.jumlahLain || 0);
            
            const total = kasMasuk + piutangPokok + piutangJasa + danaisPokok + danaisJasa + 
                         simpananPokok + simpananWajib + simpananSukarela + jumlahLain;

            // Get nama anggota berdasarkan anggota_id
            let namaAnggota = '-';
            if (n.anggota_id) {
                const anggota = this.anggotaData.find(a => 
                    String(a.id) === String(n.anggota_id) || 
                    String(a.anggota_id) === String(n.anggota_id)
                );
                namaAnggota = anggota ? anggota.nama : `ID: ${n.anggota_id}`;
            }

            return {
                tanggal: n.tanggal || '',
                jenis: 'Neraca',
                anggota: namaAnggota,
                keterangan: 'Input neraca harian',
                jumlah: total
            };
        });

        const recentTransactions = [...kasTransactions, ...neracaTransactions]
            .filter(t => t.tanggal) // Only include transactions with valid dates
            .sort((a, b) => {
                const dateA = new Date(a.tanggal || '1970-01-01');
                const dateB = new Date(b.tanggal || '1970-01-01');
                return dateB - dateA;
            })
            .slice(0, 5);

        const tbody = document.getElementById('recentTransactions');
        if (recentTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada transaksi</td></tr>';
        } else {
            tbody.innerHTML = recentTransactions.map(t => `
                <tr>
                    <td>${this.formatDate(t.tanggal)}</td>
                    <td><span class="badge ${this.getBadgeClass(t.jenis)}">${t.jenis}</span></td>
                    <td><strong>${t.anggota}</strong></td>
                    <td>${t.keterangan}</td>
                    <td>${this.formatCurrency(t.jumlah)}</td>
                </tr>
            `).join('');
        }
    }

    getBadgeClass(jenis) {
        switch(jenis) {
            case 'Pemasukan': return 'bg-success';
            case 'Pengeluaran': return 'bg-danger';
            case 'Neraca': return 'bg-info';
            default: return 'bg-secondary';
        }
    }

    // Neraca Harian Functions
    showNeracaForm() {
        document.getElementById('neracaForm').style.display = 'block';
        document.getElementById('tanggalNeraca').value = new Date().toISOString().split('T')[0];
        this.populateAnggotaDropdown('anggotaNeraca');
        this.scrollToElement('neracaForm');
    }

    hideNeracaForm() {
        document.getElementById('neracaForm').style.display = 'none';
        document.getElementById('neracaHarianForm').reset();
    }

    async submitNeraca(e) {
        e.preventDefault();
        
        try {
            const tanggal = document.getElementById('tanggalNeraca').value;
            const anggotaId = document.getElementById('anggotaNeraca')?.value || '';
            
            console.log('Submit neraca - tanggal:', tanggal, 'anggotaId:', anggotaId);
            
            if (!tanggal) {
                this.showAlert('warning', 'Tanggal harus diisi');
                return;
            }
            
            const data = {
                tanggal: tanggal,
                kasMasuk: parseFloat(document.getElementById('kasMasuk')?.value || 0) || 0,
                piutangPokok: parseFloat(document.getElementById('piutangPokok')?.value || 0) || 0,
                piutangJasa: parseFloat(document.getElementById('piutangJasa')?.value || 0) || 0,
                danaisPokok: parseFloat(document.getElementById('danaisPokok')?.value || 0) || 0,
                danaisJasa: parseFloat(document.getElementById('danaisJasa')?.value || 0) || 0,
                simpananPokok: parseFloat(document.getElementById('simpananPokok')?.value || 0) || 0,
                simpananWajib: parseFloat(document.getElementById('simpananWajib')?.value || 0) || 0,
                simpananSukarela: parseFloat(document.getElementById('simpananSukarela')?.value || 0) || 0,
                keteranganLain: document.getElementById('keteranganLain')?.value || '',
                jumlahLain: parseFloat(document.getElementById('jumlahLain')?.value || 0) || 0,
                anggotaId: anggotaId || null,
                namaAnggota: anggotaId ? this.getAnggotaNameById(anggotaId) : ''
            };
            
            data.total = data.kasMasuk + data.piutangPokok + data.piutangJasa + 
                        data.danaisPokok + data.danaisJasa + data.simpananPokok + 
                        data.simpananWajib + data.simpananSukarela + data.jumlahLain;
            
            console.log('Data neraca yang akan disimpan:', data);
            
            // Validation
            if (data.total === 0) {
                this.showAlert('warning', 'Minimal satu field harus diisi dengan nilai lebih dari 0');
                return;
            }

            // Check for duplicate date
            const existingDate = this.neracaData.find(item => {
                const existingDateStr = new Date(item.tanggal).toISOString().split('T')[0];
                const newDateStr = new Date(data.tanggal).toISOString().split('T')[0];
                return existingDateStr === newDateStr;
            });

            if (existingDate) {
                this.showAlert('warning', `Data neraca untuk tanggal ${data.tanggal} sudah ada. Silakan gunakan tanggal lain atau edit data yang sudah ada.`);
                return;
            }

            if (this.isOnline) {
                console.log('🌐 Mencoba menyimpan ke server...');
                try {
                    const response = await apiService.createNeraca(data);
                    if (response && (response.success || response.data)) {
                        const newData = response.data || { ...data, id: Date.now() };
                        this.neracaData.push(newData);
                        this.showAlert('success', 'Data neraca berhasil disimpan ke server!');
                    } else {
                        throw new Error(response?.message || 'Response tidak valid dari server');
                    }
                } catch (apiError) {
                    console.warn('⚠️ API failed, falling back to offline mode:', apiError.message);
                    
                    // Auto-fallback to localStorage if API fails
                    data.id = Date.now();
                    data.created_at = new Date().toISOString();
                    data.syncStatus = 'pending'; // Mark for later sync
                    this.neracaData.push(data);
                    localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
                    
                    this.showAlert('warning', 
                        'Server tidak tersedia. Data disimpan offline dan akan sync otomatis ketika server tersedia.',
                        8000
                    );
                }
            } else {
                console.log('📱 Menyimpan ke localStorage (mode offline)...');
                // Fallback to localStorage
                data.id = Date.now();
                data.created_at = new Date().toISOString();
                data.syncStatus = 'offline';
                this.neracaData.push(data);
                localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
                this.showAlert('info', 'Data neraca berhasil disimpan (offline mode)!');
            }
            
            console.log('✅ Neraca berhasil disimpan, updating UI...');
            this.loadNeracaTable();
            this.updateDashboard();
            this.hideNeracaForm();
            
        } catch (error) {
            console.error('🚨 Error saving neraca:', error);
            
            // Emergency fallback - always save to localStorage if everything fails
            try {
                data.id = Date.now();
                data.created_at = new Date().toISOString();
                data.syncStatus = 'error';
                this.neracaData.push(data);
                localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
                
                this.showAlert('warning', 
                    'Terjadi error saat menyimpan. Data tersimpan offline sebagai backup.',
                    6000
                );
                
                this.loadNeracaTable();
                this.updateDashboard();
                this.hideNeracaForm();
                
            } catch (fallbackError) {
                console.error('🚨 Even fallback failed:', fallbackError);
                this.showAlert('error', 
                    `Gagal menyimpan data neraca: ${error.message}. Silakan coba lagi.`,
                    10000
                );
            }
        }
    }

    loadNeracaTable() {
        const tbody = document.getElementById('neracaTableBody');
        if (!this.neracaData || this.neracaData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">Belum ada data neraca</td></tr>';
            return;
        }

        const sortedData = this.safeSort(this.neracaData, (a, b) => {
            const dateA = new Date(a.tanggal || '1970-01-01');
            const dateB = new Date(b.tanggal || '1970-01-01');
            return dateB - dateA;
        });

        tbody.innerHTML = sortedData.map(item => {
            // Normalize field names (support both camelCase and snake_case)
            const kasMasuk = parseFloat(item.kas_masuk || item.kasMasuk || 0);
            const piutangPokok = parseFloat(item.piutang_pokok || item.piutangPokok || 0);
            const piutangJasa = parseFloat(item.piutang_jasa || item.piutangJasa || 0);
            const danaisPokok = parseFloat(item.danais_pokok || item.danaisPokok || 0);
            const danaisJasa = parseFloat(item.danais_jasa || item.danaisJasa || 0);
            const simpananPokok = parseFloat(item.simpanan_pokok || item.simpananPokok || 0);
            const simpananWajib = parseFloat(item.simpanan_wajib || item.simpananWajib || 0);
            const simpananSukarela = parseFloat(item.simpanan_sukarela || item.simpananSukarela || 0);
            const jumlahLain = parseFloat(item.keterangan_lain_jumlah || item.jumlahLain || 0);
            
            const totalPiutang = piutangPokok + piutangJasa;
            const totalDanais = danaisPokok + danaisJasa;
            const totalSimpanan = simpananPokok + simpananWajib + simpananSukarela;
            const total = kasMasuk + totalPiutang + totalDanais + totalSimpanan + jumlahLain;

            return `
                <tr>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td>${item.namaAnggota || '-'}</td>
                    <td>${this.formatCurrency(kasMasuk)}</td>
                    <td>${this.formatCurrency(totalPiutang)}</td>
                    <td>${this.formatCurrency(totalDanais)}</td>
                    <td>${this.formatCurrency(totalSimpanan)}</td>
                    <td>${this.formatCurrency(jumlahLain)}</td>
                    <td><strong class="text-primary">${this.formatCurrency(total)}</strong></td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-info" onclick="app.viewNeraca(${item.id})" title="Detail">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-warning" onclick="app.editNeraca(${item.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="app.deleteNeraca(${item.id})" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    viewNeraca(id) {
        const item = this.neracaData.find(n => n.id === id);
        if (!item) return;

        const modalHTML = `
            <div class="modal fade" id="neracaDetailModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detail Neraca Harian</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <strong>Tanggal:</strong> ${this.formatDate(item.tanggal)}
                                </div>
                                <div class="col-md-6">
                                    <strong>Total:</strong> ${this.formatCurrency(item.total)}
                                </div>
                            </div>
                            <table class="table table-bordered">
                                <tr><td><strong>Kas Masuk</strong></td><td>${this.formatCurrency(item.kasMasuk)}</td></tr>
                                <tr><td><strong>Piutang Pokok</strong></td><td>${this.formatCurrency(item.piutangPokok)}</td></tr>
                                <tr><td><strong>Piutang Jasa</strong></td><td>${this.formatCurrency(item.piutangJasa)}</td></tr>
                                <tr><td><strong>Danais Pokok</strong></td><td>${this.formatCurrency(item.danaisPokok)}</td></tr>
                                <tr><td><strong>Danais Jasa</strong></td><td>${this.formatCurrency(item.danaisJasa)}</td></tr>
                                <tr><td><strong>Simpanan Pokok</strong></td><td>${this.formatCurrency(item.simpananPokok)}</td></tr>
                                <tr><td><strong>Simpanan Wajib</strong></td><td>${this.formatCurrency(item.simpananWajib)}</td></tr>
                                <tr><td><strong>Simpanan Sukarela</strong></td><td>${this.formatCurrency(item.simpananSukarela)}</td></tr>
                                <tr><td><strong>Lain-lain</strong></td><td>${this.formatCurrency(item.jumlahLain)}</td></tr>
                            </table>
                            ${item.keteranganLain ? `<p><strong>Keterangan:</strong> ${item.keteranganLain}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('neracaDetailModal'));
        modal.show();

        document.getElementById('neracaDetailModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    async deleteNeraca(id) {
        if (confirm('Yakin ingin menghapus data neraca ini?')) {
            try {
                if (this.isOnline) {
                    const response = await apiService.deleteNeraca(id);
                    if (response.success) {
                        this.neracaData = this.neracaData.filter(item => item.id !== id);
                        this.showAlert('success', 'Data neraca berhasil dihapus');
                    }
                } else {
                    // Fallback to localStorage
                    this.neracaData = this.neracaData.filter(item => item.id !== id);
                    localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
                    this.showAlert('success', 'Data neraca berhasil dihapus (offline)');
                }
                
                this.loadNeracaTable();
                this.updateDashboard();
                
            } catch (error) {
                console.error('Error deleting neraca:', error);
                this.showAlert('error', 'Gagal menghapus data neraca');
            }
        }
    }

    // Kas Koperasi Functions
    async showKasForm() {
        document.getElementById('kasForm').style.display = 'block';
        document.getElementById('tanggalKas').value = new Date().toISOString().split('T')[0];
        
        // Force refresh anggota data dan populate dropdown dengan error handling
        console.log('🔍 Loading anggota dropdown for kas form...');
        try {
            await this.populateAnggotaDropdown('anggotaKas');
            console.log('✅ Kas form anggota dropdown populated successfully');
        } catch (error) {
            console.error('❌ Failed to populate kas form anggota dropdown:', error);
            this.showAlert('warning', 'Gagal memuat daftar anggota. Coba refresh halaman.');
        }
        
        this.scrollToElement('kasForm');
    }

    hideKasForm() {
        document.getElementById('kasForm').style.display = 'none';
        document.getElementById('kasFormElement').reset();
    }

    async submitKas(e) {
        e.preventDefault();
        
        const tanggal = document.getElementById('tanggalKas').value;
        const jenis = document.getElementById('jenisKas').value;
        const jumlah = parseFloat(document.getElementById('jumlahKas').value);
        const keterangan = document.getElementById('keteranganKas').value;
        const anggotaId = document.getElementById('anggotaKas').value;
        
        // Validation
        if (!tanggal || !jenis || !keterangan) {
            this.showAlert('warning', 'Semua field harus diisi');
            return;
        }
        
        if (isNaN(jumlah) || jumlah <= 0) {
            this.showAlert('warning', 'Jumlah harus lebih dari 0');
            return;
        }
        
        const data = {
            tanggal: tanggal,
            jenis: jenis,
            jumlah: jumlah,
            keterangan: keterangan,
            anggotaId: anggotaId || null,
            namaAnggota: anggotaId ? this.getAnggotaNameById(anggotaId) : ''
        };

        try {
            if (this.isOnline) {
                const response = await apiService.createKas(data);
                if (response && (response.success || response.data)) {
                    const newData = response.data || { ...data, id: Date.now() };
                    this.kasData.push(newData);
                    this.showAlert('success', 'Transaksi kas berhasil disimpan!');
                } else {
                    throw new Error(response.message || 'Failed to save data');
                }
            } else {
                // Fallback to localStorage
                data.id = Date.now();
                data.created_at = new Date().toISOString();
                this.kasData.push(data);
                localStorage.setItem('kasData', JSON.stringify(this.kasData));
                this.showAlert('success', 'Transaksi kas berhasil disimpan (offline)!');
            }
            
            this.loadKasTable();
            this.updateKasSummary();
            this.updateDashboard();
            this.hideKasForm();
            
            // Reset form
            document.getElementById('kasFormElement').reset();
            
        } catch (error) {
            console.error('Error saving kas:', error);
            this.showAlert('error', `Gagal menyimpan transaksi kas: ${error.message}`);
        }
    }

    loadKasTable() {
        const tbody = document.getElementById('kasTableBody');
        if (!this.kasData || this.kasData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada transaksi kas</td></tr>';
            return;
        }

        let saldo = 0;
        const sortedData = this.safeSort(this.kasData, (a, b) => {
            const dateA = new Date(a.tanggal || '1970-01-01');
            const dateB = new Date(b.tanggal || '1970-01-01');
            return dateA - dateB;
        });

        tbody.innerHTML = sortedData.map(item => {
            const jumlah = parseFloat(item.jumlah || 0);
            const jenis = (item.jenis || '').toLowerCase();
            
            // Normalize jenis field
            const jenisNormalized = (jenis === 'masuk' || jenis.includes('masuk')) ? 'masuk' : 'keluar';
            
            if (jenisNormalized === 'masuk') {
                saldo += jumlah;
            } else {
                saldo -= jumlah;
            }

            // Get nama anggota berdasarkan anggota_id
            let namaAnggota = '-';
            if (item.anggota_id) {
                const anggota = this.anggotaData.find(a => 
                    String(a.id) === String(item.anggota_id) || 
                    String(a.anggota_id) === String(item.anggota_id)
                );
                namaAnggota = anggota ? anggota.nama : `ID: ${item.anggota_id}`;
            }

            return `
                <tr>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td>
                        <span class="badge ${jenisNormalized === 'masuk' ? 'bg-success' : 'bg-danger'}">
                            ${jenisNormalized === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                    </td>
                    <td><strong>${namaAnggota}</strong></td>
                    <td>${item.keterangan || '-'}</td>
                    <td class="text-success">${jenisNormalized === 'masuk' ? this.formatCurrency(jumlah) : '-'}</td>
                    <td class="text-danger">${jenisNormalized === 'keluar' ? this.formatCurrency(jumlah) : '-'}</td>
                    <td><strong class="text-primary">${this.formatCurrency(saldo)}</strong></td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-warning" onclick="app.editKas(${item.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="app.deleteKas(${item.id})" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateKasSummary() {
        if (!this.kasData || this.kasData.length === 0) {
            document.getElementById('saldoKas').textContent = this.formatCurrency(0);
            document.getElementById('totalPemasukan').textContent = this.formatCurrency(0);
            document.getElementById('totalPengeluaran').textContent = this.formatCurrency(0);
            return;
        }

        const pemasukan = this.kasData
            .filter(k => {
                const jenis = (k.jenis || '').toLowerCase();
                return jenis === 'masuk' || jenis.includes('masuk');
            })
            .reduce((sum, k) => sum + parseFloat(k.jumlah || 0), 0);
        
        const pengeluaran = this.kasData
            .filter(k => {
                const jenis = (k.jenis || '').toLowerCase();
                return jenis === 'keluar' || jenis.includes('keluar');
            })
            .reduce((sum, k) => sum + parseFloat(k.jumlah || 0), 0);
        
        const saldo = pemasukan - pengeluaran;

        document.getElementById('saldoKas').textContent = this.formatCurrency(saldo);
        document.getElementById('totalPemasukan').textContent = this.formatCurrency(pemasukan);
        document.getElementById('totalPengeluaran').textContent = this.formatCurrency(pengeluaran);
    }

    async deleteKas(id) {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            try {
                if (this.isOnline) {
                    const response = await apiService.deleteKas(id);
                    if (response.success) {
                        this.kasData = this.kasData.filter(item => item.id !== id);
                        this.showAlert('success', 'Transaksi berhasil dihapus');
                    }
                } else {
                    // Fallback to localStorage
                    this.kasData = this.kasData.filter(item => item.id !== id);
                    localStorage.setItem('kasData', JSON.stringify(this.kasData));
                    this.showAlert('success', 'Transaksi berhasil dihapus (offline)');
                }
                
                this.loadKasTable();
                this.updateKasSummary();
                this.updateDashboard();
                
            } catch (error) {
                console.error('Error deleting kas:', error);
                this.showAlert('error', 'Gagal menghapus transaksi');
            }
        }
    }

    // Anggota Functions
    showAnggotaForm() {
        document.getElementById('anggotaForm').style.display = 'block';
        document.getElementById('tanggalBergabung').value = new Date().toISOString().split('T')[0];
        this.generateMemberNumber();
        this.scrollToElement('anggotaForm');
    }

    hideAnggotaForm() {
        document.getElementById('anggotaForm').style.display = 'none';
        document.getElementById('anggotaFormElement').reset();
    }

    generateMemberNumber() {
        const year = new Date().getFullYear();
        const count = this.anggotaData.length + 1;
        const memberNo = `KPP${year}${count.toString().padStart(3, '0')}`;
        document.getElementById('noAnggota').value = memberNo;
    }

    async submitAnggota(e) {
        e.preventDefault();
        
        const data = {
            noAnggota: document.getElementById('noAnggota').value,
            nama: document.getElementById('namaAnggota').value,
            telepon: document.getElementById('teleponAnggota').value,
            tanggalBergabung: document.getElementById('tanggalBergabung').value,
            alamat: document.getElementById('alamatAnggota').value,
            status: 'Aktif'
        };
        
        // Check if member number already exists
        if (this.anggotaData.some(a => a.noAnggota === data.noAnggota)) {
            this.showAlert('warning', 'Nomor anggota sudah ada');
            return;
        }

        try {
            if (this.isOnline) {
                const response = await apiService.createAnggota(data);
                if (response.success) {
                    this.anggotaData.push(response.data);
                    this.showAlert('success', 'Data anggota berhasil disimpan!');
                }
            } else {
                // Fallback to localStorage
                data.id = Date.now();
                this.anggotaData.push(data);
                localStorage.setItem('anggotaData', JSON.stringify(this.anggotaData));
                this.showAlert('success', 'Data anggota berhasil disimpan (offline)!');
            }
            
            this.loadAnggotaTable();
            this.updateDashboard();
            this.hideAnggotaForm();
            
        } catch (error) {
            console.error('Error saving anggota:', error);
            this.showAlert('error', 'Gagal menyimpan data anggota');
        }
    }

    loadAnggotaTable() {
        const tbody = document.getElementById('anggotaTableBody');
        if (!this.anggotaData || this.anggotaData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">Belum ada data anggota</td></tr>';
            return;
        }

        const sortedData = this.safeSort(this.anggotaData, (a, b) => {
            const aNoAnggota = a.noAnggota || a.no_anggota || '';
            const bNoAnggota = b.noAnggota || b.no_anggota || '';
            return aNoAnggota.toString().localeCompare(bNoAnggota.toString());
        });

        tbody.innerHTML = sortedData.map(item => {
            const totalKontribusi = this.calculateAnggotaContribution(item.id);
            const simpananPokok = this.parseNumber(item.simpanan_pokok || item.simpananPokok);
            const simpananWajib = this.parseNumber(item.simpanan_wajib || item.simpananWajib);
            
            return `
                <tr>
                    <td><strong>${item.noAnggota || item.no_anggota || '-'}</strong></td>
                    <td><strong>${item.nama || '-'}</strong></td>
                    <td>${item.telepon || '-'}</td>
                    <td>${item.alamat || '-'}</td>
                    <td>${this.formatDate(item.tanggalBergabung || item.tanggal_bergabung)}</td>
                    <td class="text-end">${this.formatCurrency(simpananPokok)}</td>
                    <td class="text-end">${this.formatCurrency(simpananWajib)}</td>
                    <td class="text-end"><strong class="text-success">${this.formatCurrency(totalKontribusi)}</strong></td>
                    <td>
                        <span class="badge ${item.status === 'Aktif' ? 'bg-success' : 'bg-danger'}">
                            ${item.status || 'Aktif'}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-info" onclick="app.viewAnggota(${item.id})" title="Detail">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-warning" onclick="app.editAnggota(${item.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="app.deleteAnggota(${item.id})" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    viewAnggota(id) {
        const rawItem = this.anggotaData.find(a => a.id === id);
        if (!rawItem) {
            this.showAlert('error', 'Data anggota tidak ditemukan');
            return;
        }

        const item = this.validateAndNormalizeAnggota(rawItem);
        if (!item) {
            this.showAlert('error', 'Data anggota tidak valid');
            return;
        }

        const modalHTML = `
            <div class="modal fade" id="anggotaDetailModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detail Anggota</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-borderless">
                                <tr><td><strong>Nomor Anggota:</strong></td><td>${item.noAnggota || item.no_anggota || '-'}</td></tr>
                                <tr><td><strong>Nama:</strong></td><td>${item.nama || '-'}</td></tr>
                                <tr><td><strong>Telepon:</strong></td><td>${item.telepon || '-'}</td></tr>
                                <tr><td><strong>Tanggal Bergabung:</strong></td><td>${this.formatDate(item.tanggalBergabung || item.tanggal_bergabung)}</td></tr>
                                <tr><td><strong>Status:</strong></td><td>
                                    <span class="badge ${item.status === 'Aktif' ? 'bg-success' : 'bg-danger'}">
                                        ${item.status || 'Aktif'}
                                    </span>
                                </td></tr>
                                <tr><td><strong>Alamat:</strong></td><td>${item.alamat || '-'}</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('anggotaDetailModal'));
        modal.show();

        document.getElementById('anggotaDetailModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    async deleteAnggota(id) {
        if (confirm('Yakin ingin menghapus data anggota ini?')) {
            try {
                if (this.isOnline) {
                    const response = await apiService.deleteAnggota(id);
                    if (response.success) {
                        this.anggotaData = this.anggotaData.filter(item => item.id !== id);
                        this.showAlert('success', 'Data anggota berhasil dihapus');
                    }
                } else {
                    // Fallback to localStorage
                    this.anggotaData = this.anggotaData.filter(item => item.id !== id);
                    localStorage.setItem('anggotaData', JSON.stringify(this.anggotaData));
                    this.showAlert('success', 'Data anggota berhasil dihapus (offline)');
                }
                
                this.loadAnggotaTable();
                this.updateDashboard();
                
            } catch (error) {
                console.error('Error deleting anggota:', error);
                this.showAlert('error', 'Gagal menghapus data anggota');
            }
        }
    }

    // Laporan Functions
    async generateLaporan() {
        const bulan = document.getElementById('bulanLaporan').value;
        const tahun = document.getElementById('tahunLaporan').value;
        
        if (!bulan) {
            this.showAlert('warning', 'Pilih bulan terlebih dahulu');
            return;
        }

        try {
            let laporanData;
            
            if (this.isOnline) {
                try {
                    const response = await apiService.getLaporanBulanan(bulan, tahun);
                    if (response && (response.success || response.data)) {
                        laporanData = response.data || response;
                    } else {
                        throw new Error('No data received from server');
                    }
                } catch (apiError) {
                    console.warn('API laporan failed, using local calculation:', apiError);
                    laporanData = this.calculateLocalLaporan(bulan, tahun);
                }
            } else {
                // Use local calculation when offline
                laporanData = this.calculateLocalLaporan(bulan, tahun);
            }

            this.renderLaporan(laporanData, bulan, tahun);
            this.showAlert('success', 'Laporan berhasil di-generate');
            
        } catch (error) {
            console.error('Error generating laporan:', error);
            this.showAlert('error', `Gagal generate laporan: ${error.message}`);
        }
    }

    calculateLocalLaporan(bulan, tahun) {
        // Filter data berdasarkan bulan dan tahun
        const neracaBulan = (this.neracaData || []).filter(item => {
            if (!item.tanggal) return false;
            const date = new Date(item.tanggal);
            return date.getMonth() + 1 == bulan && date.getFullYear() == tahun;
        });

        const kasBulan = (this.kasData || []).filter(item => {
            if (!item.tanggal) return false;
            const date = new Date(item.tanggal);
            return date.getMonth() + 1 == bulan && date.getFullYear() == tahun;
        });

        // Calculate totals with safe parsing
        const totalNeraca = neracaBulan.reduce((sum, item) => {
            const kasMasuk = parseFloat(item.kas_masuk || item.kasMasuk || 0);
            const piutangPokok = parseFloat(item.piutang_pokok || item.piutangPokok || 0);
            const piutangJasa = parseFloat(item.piutang_jasa || item.piutangJasa || 0);
            const danaisPokok = parseFloat(item.danais_pokok || item.danaisPokok || 0);
            const danaisJasa = parseFloat(item.danais_jasa || item.danaisJasa || 0);
            const simpananPokok = parseFloat(item.simpanan_pokok || item.simpananPokok || 0);
            const simpananWajib = parseFloat(item.simpanan_wajib || item.simpananWajib || 0);
            const simpananSukarela = parseFloat(item.simpanan_sukarela || item.simpananSukarela || 0);
            
            const total = kasMasuk + piutangPokok + piutangJasa + danaisPokok + danaisJasa + 
                         simpananPokok + simpananWajib + simpananSukarela;
            return sum + total;
        }, 0);

        const totalPemasukan = kasBulan
            .filter(k => (k.jenis === 'masuk' || k.jenis === 'Masuk'))
            .reduce((sum, k) => sum + parseFloat(k.jumlah || 0), 0);
        
        const totalPengeluaran = kasBulan
            .filter(k => (k.jenis === 'keluar' || k.jenis === 'Keluar'))
            .reduce((sum, k) => sum + parseFloat(k.jumlah || 0), 0);
        
        const saldoAkhir = totalPemasukan - totalPengeluaran;

        return {
            neracaBulan: neracaBulan.map(item => ({
                ...item,
                kasMasuk: parseFloat(item.kas_masuk || item.kasMasuk || 0),
                piutangPokok: parseFloat(item.piutang_pokok || item.piutangPokok || 0),
                piutangJasa: parseFloat(item.piutang_jasa || item.piutangJasa || 0),
                danaisPokok: parseFloat(item.danais_pokok || item.danaisPokok || 0),
                danaisJasa: parseFloat(item.danais_jasa || item.danaisJasa || 0),
                simpananPokok: parseFloat(item.simpanan_pokok || item.simpananPokok || 0),
                simpananWajib: parseFloat(item.simpanan_wajib || item.simpananWajib || 0),
                simpananSukarela: parseFloat(item.simpanan_sukarela || item.simpananSukarela || 0),
                jumlahLain: parseFloat(item.keterangan_lain_jumlah || item.jumlahLain || 0)
            })),
            kasBulan,
            totalNeraca,
            totalPemasukan,
            totalPengeluaran,
            saldoAkhir
        };
    }

    renderLaporan(data, bulan, tahun) {
        const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        const laporanHTML = `
            <div class="text-center mb-4">
                <h4 class="text-primary">LAPORAN KEUANGAN KOPERASI</h4>
                <h5 class="text-secondary">Pasar Padang Pangan</h5>
                <h6>Periode: ${monthNames[bulan]} ${tahun}</h6>
                <hr>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white">
                            <h6><i class="fas fa-calculator"></i> RINGKASAN NERACA</h6>
                        </div>
                        <div class="card-body">
                            <table class="table table-borderless mb-0">
                                <tr>
                                    <td>Total Entri Neraca:</td>
                                    <td class="text-end fw-bold">${data.neracaBulan.length} entri</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Nilai Neraca:</strong></td>
                                    <td class="text-end"><strong class="text-primary">${this.formatCurrency(data.totalNeraca)}</strong></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-success">
                        <div class="card-header bg-success text-white">
                            <h6><i class="fas fa-money-bill-wave"></i> RINGKASAN KAS</h6>
                        </div>
                        <div class="card-body">
                            <table class="table table-borderless mb-0">
                                <tr>
                                    <td>Total Pemasukan:</td>
                                    <td class="text-end text-success fw-bold">${this.formatCurrency(data.totalPemasukan)}</td>
                                </tr>
                                <tr>
                                    <td>Total Pengeluaran:</td>
                                    <td class="text-end text-danger fw-bold">${this.formatCurrency(data.totalPengeluaran)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Saldo Akhir:</strong></td>
                                    <td class="text-end"><strong class="text-${data.saldoAkhir >= 0 ? 'success' : 'danger'}">${this.formatCurrency(data.saldoAkhir)}</strong></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h6><i class="fas fa-table"></i> DETAIL NERACA HARIAN</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-sm">
                            <thead class="table-dark">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Kas</th>
                                    <th>Piutang</th>
                                    <th>Simpanan</th>
                                    <th>Lain-lain</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.neracaBulan.map(item => `
                                    <tr>
                                        <td>${this.formatDate(item.tanggal)}</td>
                                        <td>${this.formatCurrency(item.kasMasuk)}</td>
                                        <td>${this.formatCurrency(item.piutangPokok + item.piutangJasa + item.danaisPokok + item.danaisJasa)}</td>
                                        <td>${this.formatCurrency(item.simpananPokok + item.simpananWajib + item.simpananSukarela)}</td>
                                        <td>${this.formatCurrency(item.jumlahLain)}</td>
                                        <td><strong>${this.formatCurrency(item.total)}</strong></td>
                                    </tr>
                                `).join('')}
                                ${data.neracaBulan.length === 0 ? '<tr><td colspan="6" class="text-center">Tidak ada data</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6><i class="fas fa-list"></i> DETAIL TRANSAKSI KAS</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-sm">
                            <thead class="table-dark">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Keterangan</th>
                                    <th>Pemasukan</th>
                                    <th>Pengeluaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.kasBulan.map(item => `
                                    <tr>
                                        <td>${this.formatDate(item.tanggal)}</td>
                                        <td>${item.keterangan}</td>
                                        <td class="text-success">${item.jenis === 'masuk' ? this.formatCurrency(item.jumlah) : '-'}</td>
                                        <td class="text-danger">${item.jenis === 'keluar' ? this.formatCurrency(item.jumlah) : '-'}</td>
                                    </tr>
                                `).join('')}
                                ${data.kasBulan.length === 0 ? '<tr><td colspan="4" class="text-center">Tidak ada data</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
                <small class="text-muted">Laporan dibuat pada: ${this.formatDate(new Date().toISOString().split('T')[0])}</small>
            </div>
        `;

        document.querySelector('#laporanContent .card-body').innerHTML = laporanHTML;
    }

    exportLaporan() {
        const content = document.querySelector('#laporanContent .card-body').innerHTML;
        if (!content || content.includes('Pilih bulan')) {
            this.showAlert('warning', 'Generate laporan terlebih dahulu');
            return;
        }

        // Show export format options
        this.showLaporanExportModal();
    }

    showLaporanExportModal() {
        const modalHtml = `
            <div class="modal fade" id="laporanExportModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-download"></i> Export Laporan
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Pilih format export laporan:</p>
                            
                            <div class="mb-3">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="laporanFormat" id="laporanPrint" value="print" checked>
                                    <label class="form-check-label" for="laporanPrint">
                                        <i class="fas fa-print"></i> Print / PDF
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="laporanFormat" id="laporanCSV" value="csv">
                                    <label class="form-check-label" for="laporanCSV">
                                        <i class="fas fa-file-csv"></i> CSV Spreadsheet
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="app.processLaporanExport()">
                                <i class="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if present
        const existingModal = document.getElementById('laporanExportModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('laporanExportModal'));
        modal.show();
    }

    processLaporanExport() {
        const format = document.querySelector('input[name="laporanFormat"]:checked').value;
        
        if (format === 'print') {
            this.exportLaporanAsPrint();
        } else if (format === 'csv') {
            this.exportLaporanAsCSV();
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('laporanExportModal'));
        modal.hide();
    }

    exportLaporanAsPrint() {
        const content = document.querySelector('#laporanContent .card-body').innerHTML;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Laporan Keuangan Koperasi</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    @media print {
                        .no-print { display: none; }
                        body { font-size: 12px; }
                        .card { border: 1px solid #ddd; margin-bottom: 10px; }
                        .card-header { background: #f8f9fa !important; color: #333 !important; }
                    }
                </style>
            </head>
            <body class="p-4">
                ${content}
                <div class="text-center mt-4 no-print">
                    <button onclick="window.print()" class="btn btn-primary me-2">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button onclick="window.close()" class="btn btn-secondary">Tutup</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    exportLaporanAsCSV() {
        try {
            const bulan = document.getElementById('bulanLaporan').value;
            const tahun = document.getElementById('tahunLaporan').value;
            
            if (!bulan || !tahun) {
                this.showAlert('warning', 'Pilih bulan dan tahun terlebih dahulu');
                return;
            }

            // Get current generated report data
            const laporanData = this.getCurrentLaporanData(bulan, tahun);
            
            if (!laporanData) {
                this.showAlert('warning', 'Data laporan tidak tersedia');
                return;
            }

            // Create CSV content
            const csvContent = this.createLaporanCSV(laporanData, bulan, tahun);
            
            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            const bulanNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                               'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            link.download = `laporan_keuangan_${bulanNames[parseInt(bulan)]}_${tahun}.csv`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
            
            this.showAlert('success', 'Laporan berhasil di-export sebagai CSV');
        } catch (error) {
            console.error('Error exporting laporan as CSV:', error);
            this.showAlert('error', `Gagal export laporan: ${error.message}`);
        }
    }

    getCurrentLaporanData(bulan, tahun) {
        // Filter data based on selected month and year
        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 0);
        
        const neracaFiltered = (this.neracaData || []).filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate >= startDate && itemDate <= endDate;
        });

        const kasFiltered = (this.kasData || []).filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate >= startDate && itemDate <= endDate;
        });

        return {
            neraca: neracaFiltered,
            kas: kasFiltered,
            periode: { bulan: parseInt(bulan), tahun: parseInt(tahun) }
        };
    }

    createLaporanCSV(laporanData, bulan, tahun) {
        const bulanNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                           'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        let csvContent = '';
        
        // Header
        csvContent += `LAPORAN KEUANGAN KOPERASI PASAR PADANG PANGAN\n`;
        csvContent += `Periode: ${bulanNames[parseInt(bulan)]} ${tahun}\n`;
        csvContent += `Tanggal Export: ${new Date().toLocaleDateString('id-ID')}\n\n`;
        
        // Ringkasan Neraca
        csvContent += `RINGKASAN NERACA HARIAN\n`;
        csvContent += `Tanggal,Kas Masuk,Piutang Pokok,Piutang Jasa,Danais Pokok,Danais Jasa,Simpanan Pokok,Simpanan Wajib,Simpanan Sukarela,Lain-lain,Total\n`;
        
        let totalNeraca = {
            kasMasuk: 0, piutangPokok: 0, piutangJasa: 0, danaisPokok: 0, danaisJasa: 0,
            simpananPokok: 0, simpananWajib: 0, simpananSukarela: 0, lainLain: 0, total: 0
        };
        
        laporanData.neraca.forEach(item => {
            const kasMasuk = parseFloat(item.kasMasuk || item.kas_masuk || 0);
            const piutangPokok = parseFloat(item.piutangPokok || item.piutang_pokok || 0);
            const piutangJasa = parseFloat(item.piutangJasa || item.piutang_jasa || 0);
            const danaisPokok = parseFloat(item.danaisPokok || item.danais_pokok || 0);
            const danaisJasa = parseFloat(item.danaisJasa || item.danais_jasa || 0);
            const simpananPokok = parseFloat(item.simpananPokok || item.simpanan_pokok || 0);
            const simpananWajib = parseFloat(item.simpananWajib || item.simpanan_wajib || 0);
            const simpananSukarela = parseFloat(item.simpananSukarela || item.simpanan_sukarela || 0);
            const lainLain = parseFloat(item.jumlahLain || item.keterangan_lain_jumlah || 0);
            const total = parseFloat(item.total || 0);
            
            csvContent += `${item.tanggal},${kasMasuk},${piutangPokok},${piutangJasa},${danaisPokok},${danaisJasa},${simpananPokok},${simpananWajib},${simpananSukarela},${lainLain},${total}\n`;
            
            totalNeraca.kasMasuk += kasMasuk;
            totalNeraca.piutangPokok += piutangPokok;
            totalNeraca.piutangJasa += piutangJasa;
            totalNeraca.danaisPokok += danaisPokok;
            totalNeraca.danaisJasa += danaisJasa;
            totalNeraca.simpananPokok += simpananPokok;
            totalNeraca.simpananWajib += simpananWajib;
            totalNeraca.simpananSukarela += simpananSukarela;
            totalNeraca.lainLain += lainLain;
            totalNeraca.total += total;
        });
        
        csvContent += `TOTAL,${totalNeraca.kasMasuk},${totalNeraca.piutangPokok},${totalNeraca.piutangJasa},${totalNeraca.danaisPokok},${totalNeraca.danaisJasa},${totalNeraca.simpananPokok},${totalNeraca.simpananWajib},${totalNeraca.simpananSukarela},${totalNeraca.lainLain},${totalNeraca.total}\n\n`;
        
        // Ringkasan Kas
        csvContent += `RINGKASAN KAS\n`;
        csvContent += `Tanggal,Jenis,Keterangan,Jumlah\n`;
        
        let totalPemasukan = 0;
        let totalPengeluaran = 0;
        
        laporanData.kas.forEach(item => {
            const jumlah = parseFloat(item.jumlah || 0);
            const jenis = (item.jenis || '').toLowerCase();
            const isMasuk = jenis === 'masuk' || jenis.includes('masuk');
            
            csvContent += `${item.tanggal},${item.jenis},"${item.keterangan || ''}",${jumlah}\n`;
            
            if (isMasuk) {
                totalPemasukan += jumlah;
            } else {
                totalPengeluaran += jumlah;
            }
        });
        
        csvContent += `\nRINGKASAN KAS\n`;
        csvContent += `Total Pemasukan,${totalPemasukan}\n`;
        csvContent += `Total Pengeluaran,${totalPengeluaran}\n`;
        csvContent += `Saldo Kas,${totalPemasukan - totalPengeluaran}\n`;
        
        // Add BOM for proper UTF-8 encoding in Excel
        return '\ufeff' + csvContent;
    }

    // 3-Month Reporting Function
    async generateLaporan3Bulan() {
        const tahun = document.getElementById('tahunLaporan').value;
        
        if (!tahun) {
            this.showAlert('warning', 'Pilih tahun terlebih dahulu');
            return;
        }

        try {
            let laporanData;
            
            if (this.isOnline) {
                try {
                    const response = await apiService.getLaporan3Bulan(tahun);
                    if (response && (response.success || response.data)) {
                        laporanData = response.data || response;
                    } else {
                        throw new Error('No data received from server');
                    }
                } catch (apiError) {
                    console.warn('API laporan 3 bulan failed, using local calculation:', apiError);
                    laporanData = this.calculate3BulanLocal(tahun);
                }
            } else {
                // Use local calculation when offline
                laporanData = this.calculate3BulanLocal(tahun);
            }

            this.render3BulanLaporan(laporanData, tahun);
            this.showAlert('success', 'Laporan 3 bulan berhasil di-generate');
            
        } catch (error) {
            console.error('Error generating 3-month laporan:', error);
            this.showAlert('error', `Gagal generate laporan 3 bulan: ${error.message}`);
        }
    }

    calculate3BulanLocal(tahun) {
        // Calculate quarterly summaries for the selected year
        const quarters = [
            { name: 'Q1 (Jan-Mar)', months: [1, 2, 3] },
            { name: 'Q2 (Apr-Jun)', months: [4, 5, 6] },
            { name: 'Q3 (Jul-Sep)', months: [7, 8, 9] },
            { name: 'Q4 (Okt-Des)', months: [10, 11, 12] }
        ];

        const quarterlyData = quarters.map(quarter => {
            let totalNeraca = 0;
            let totalPemasukan = 0;
            let totalPengeluaran = 0;
            let neracaEntries = 0;
            let kasEntries = 0;

            quarter.months.forEach(bulan => {
                // Filter neraca data for this month
                const neracaBulan = (this.neracaData || []).filter(item => {
                    if (!item.tanggal) return false;
                    const date = new Date(item.tanggal);
                    return date.getMonth() + 1 === bulan && date.getFullYear() == tahun;
                });

                // Filter kas data for this month
                const kasBulan = (this.kasData || []).filter(item => {
                    if (!item.tanggal) return false;
                    const date = new Date(item.tanggal);
                    return date.getMonth() + 1 === bulan && date.getFullYear() == tahun;
                });

                // Calculate neraca totals
                const neracaTotal = neracaBulan.reduce((sum, item) => {
                    const kasMasuk = parseFloat(item.kas_masuk || item.kasMasuk || 0);
                    const piutangPokok = parseFloat(item.piutang_pokok || item.piutangPokok || 0);
                    const piutangJasa = parseFloat(item.piutang_jasa || item.piutangJasa || 0);
                    const danaisPokok = parseFloat(item.danais_pokok || item.danaisPokok || 0);
                    const danaisJasa = parseFloat(item.danais_jasa || item.danaisJasa || 0);
                    const simpananPokok = parseFloat(item.simpanan_pokok || item.simpananPokok || 0);
                    const simpananWajib = parseFloat(item.simpanan_wajib || item.simpananWajib || 0);
                    const simpananSukarela = parseFloat(item.simpanan_sukarela || item.simpananSukarela || 0);
                    
                    const total = kasMasuk + piutangPokok + piutangJasa + danaisPokok + danaisJasa + 
                                 simpananPokok + simpananWajib + simpananSukarela;
                    return sum + total;
                }, 0);

                // Calculate kas totals
                const pemasukan = kasBulan
                    .filter(k => (k.jenis === 'masuk' || k.jenis === 'Masuk'))
                    .reduce((sum, k) => sum + parseFloat(k.jumlah || 0), 0);
                
                const pengeluaran = kasBulan
                    .filter(k => (k.jenis === 'keluar' || k.jenis === 'Keluar'))
                    .reduce((sum, k) => sum + parseFloat(k.jumlah || 0), 0);

                totalNeraca += neracaTotal;
                totalPemasukan += pemasukan;
                totalPengeluaran += pengeluaran;
                neracaEntries += neracaBulan.length;
                kasEntries += kasBulan.length;
            });

            return {
                quarter: quarter.name,
                totalNeraca,
                totalPemasukan,
                totalPengeluaran,
                saldoKas: totalPemasukan - totalPengeluaran,
                neracaEntries,
                kasEntries
            };
        });

        // Calculate yearly totals
        const yearlyTotals = quarterlyData.reduce((acc, quarter) => ({
            totalNeraca: acc.totalNeraca + quarter.totalNeraca,
            totalPemasukan: acc.totalPemasukan + quarter.totalPemasukan,
            totalPengeluaran: acc.totalPengeluaran + quarter.totalPengeluaran,
            neracaEntries: acc.neracaEntries + quarter.neracaEntries,
            kasEntries: acc.kasEntries + quarter.kasEntries
        }), { totalNeraca: 0, totalPemasukan: 0, totalPengeluaran: 0, neracaEntries: 0, kasEntries: 0 });

        return {
            quarterly: quarterlyData,
            yearly: {
                ...yearlyTotals,
                saldoKas: yearlyTotals.totalPemasukan - yearlyTotals.totalPengeluaran
            }
        };
    }

    render3BulanLaporan(data, tahun) {
        const laporanHTML = `
            <div class="text-center mb-4">
                <h4 class="text-primary">LAPORAN KEUANGAN TRIWULAN</h4>
                <h5 class="text-secondary">Koperasi Pasar Padang Pangan</h5>
                <h6>Tahun: ${tahun}</h6>
                <hr>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card border-info">
                        <div class="card-header bg-info text-white">
                            <h6><i class="fas fa-chart-pie"></i> RINGKASAN TAHUNAN ${tahun}</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h6 class="text-muted">Total Neraca</h6>
                                        <h5 class="text-primary">${this.formatCurrency(data.yearly.totalNeraca)}</h5>
                                        <small class="text-muted">${data.yearly.neracaEntries} entri</small>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h6 class="text-muted">Total Pemasukan</h6>
                                        <h5 class="text-success">${this.formatCurrency(data.yearly.totalPemasukan)}</h5>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h6 class="text-muted">Total Pengeluaran</h6>
                                        <h5 class="text-danger">${this.formatCurrency(data.yearly.totalPengeluaran)}</h5>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-center">
                                        <h6 class="text-muted">Saldo Kas</h6>
                                        <h5 class="text-${data.yearly.saldoKas >= 0 ? 'success' : 'danger'}">${this.formatCurrency(data.yearly.saldoKas)}</h5>
                                        <small class="text-muted">${data.yearly.kasEntries} transaksi</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h6><i class="fas fa-table"></i> DETAIL TRIWULAN</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th>Triwulan</th>
                                    <th>Total Neraca</th>
                                    <th>Entri Neraca</th>
                                    <th>Total Pemasukan</th>
                                    <th>Total Pengeluaran</th>
                                    <th>Saldo Kas</th>
                                    <th>Transaksi Kas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.quarterly.map(quarter => `
                                    <tr>
                                        <td><strong>${quarter.quarter}</strong></td>
                                        <td>${this.formatCurrency(quarter.totalNeraca)}</td>
                                        <td class="text-center">${quarter.neracaEntries}</td>
                                        <td class="text-success">${this.formatCurrency(quarter.totalPemasukan)}</td>
                                        <td class="text-danger">${this.formatCurrency(quarter.totalPengeluaran)}</td>
                                        <td class="text-${quarter.saldoKas >= 0 ? 'success' : 'danger'}"><strong>${this.formatCurrency(quarter.saldoKas)}</strong></td>
                                        <td class="text-center">${quarter.kasEntries}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot class="table-light">
                                <tr>
                                    <th>TOTAL TAHUN ${tahun}</th>
                                    <th>${this.formatCurrency(data.yearly.totalNeraca)}</th>
                                    <th class="text-center">${data.yearly.neracaEntries}</th>
                                    <th class="text-success">${this.formatCurrency(data.yearly.totalPemasukan)}</th>
                                    <th class="text-danger">${this.formatCurrency(data.yearly.totalPengeluaran)}</th>
                                    <th class="text-${data.yearly.saldoKas >= 0 ? 'success' : 'danger'}"><strong>${this.formatCurrency(data.yearly.saldoKas)}</strong></th>
                                    <th class="text-center">${data.yearly.kasEntries}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
                <small class="text-muted">Laporan Triwulan dibuat pada: ${this.formatDate(new Date().toISOString().split('T')[0])}</small>
            </div>
        `;

        document.querySelector('#laporanContent .card-header h5').innerHTML = '<i class="fas fa-calendar-alt"></i> Rekap Triwulan';
        document.querySelector('#laporanContent .card-body').innerHTML = laporanHTML;
    }

    // Test connection function
    async testConnection() {
        this.showAlert('info', 'Testing connection... Check console for details');
        
        const isConnected = await apiService.testConnection();
        
        if (isConnected) {
            this.showAlert('success', 'Backend connection test PASSED! Check console for details');
        } else {
            this.showAlert('error', 'Backend connection test FAILED! Check console for error details');
        }
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    }

    formatDate(dateString) {
        if (!dateString) {
            return '-';
        }
        
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.warn('Error formatting date:', dateString, error);
            return '-';
        }
    }

    scrollToElement(elementId) {
        setTimeout(() => {
            document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    showAlert(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'warning' ? 'alert-warning' : 
                          type === 'error' ? 'alert-danger' : 'alert-info';
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 
                    type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas ${icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', alertHTML);

        // Auto remove after 5 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert:last-of-type');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }

    // Edit functions (placeholders for future implementation)
    editNeraca(id) {
        const item = this.neracaData.find(n => n.id === id);
        if (!item) {
            this.showAlert('error', 'Data neraca tidak ditemukan');
            return;
        }

        const modalHTML = `
            <div class="modal fade" id="editNeracaModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Neraca Harian</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editNeracaForm">
                                <input type="hidden" id="editNeracaId" value="${item.id}">
                                
                                <div class="mb-3">
                                    <label for="editTanggalNeraca" class="form-label">Tanggal</label>
                                    <input type="date" class="form-control" id="editTanggalNeraca" 
                                           value="${item.tanggal}" required>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editKasMasuk" class="form-label">Kas Masuk</label>
                                            <input type="number" class="form-control" id="editKasMasuk" 
                                                   value="${item.kas_masuk || item.kasMasuk || 0}" min="0">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editPiutangPokok" class="form-label">Piutang Pokok</label>
                                            <input type="number" class="form-control" id="editPiutangPokok" 
                                                   value="${item.piutang_pokok || item.piutangPokok || 0}" min="0">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editPiutangJasa" class="form-label">Piutang Jasa</label>
                                            <input type="number" class="form-control" id="editPiutangJasa" 
                                                   value="${item.piutang_jasa || item.piutangJasa || 0}" min="0">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editDanaisPokok" class="form-label">Danais Pokok</label>
                                            <input type="number" class="form-control" id="editDanaisPokok" 
                                                   value="${item.danais_pokok || item.danaisPokok || 0}" min="0">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editDanaisJasa" class="form-label">Danais Jasa</label>
                                            <input type="number" class="form-control" id="editDanaisJasa" 
                                                   value="${item.danais_jasa || item.danaisJasa || 0}" min="0">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editSimpananPokok" class="form-label">Simpanan Pokok</label>
                                            <input type="number" class="form-control" id="editSimpananPokok" 
                                                   value="${item.simpanan_pokok || item.simpananPokok || 0}" min="0">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editSimpananWajib" class="form-label">Simpanan Wajib</label>
                                            <input type="number" class="form-control" id="editSimpananWajib" 
                                                   value="${item.simpanan_wajib || item.simpananWajib || 0}" min="0">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editSimpananSukarela" class="form-label">Simpanan Sukarela</label>
                                            <input type="number" class="form-control" id="editSimpananSukarela" 
                                                   value="${item.simpanan_sukarela || item.simpananSukarela || 0}" min="0">
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="editKeteranganNeraca" class="form-label">Keterangan Lain</label>
                                    <textarea class="form-control" id="editKeteranganNeraca" rows="3">${item.keterangan_lain || item.keteranganLain || ''}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="app.saveEditNeraca()">
                                <i class="fas fa-save"></i> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('editNeracaModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('editNeracaModal'));
        modal.show();
    }

    editKas(id) {
        const item = this.kasData.find(k => k.id === id);
        if (!item) {
            this.showAlert('error', 'Data kas tidak ditemukan');
            return;
        }

        const modalHTML = `
            <div class="modal fade" id="editKasModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Transaksi Kas</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editKasForm">
                                <input type="hidden" id="editKasId" value="${item.id}">
                                
                                <div class="mb-3">
                                    <label for="editTanggalKas" class="form-label">Tanggal</label>
                                    <input type="date" class="form-control" id="editTanggalKas" 
                                           value="${item.tanggal}" required>
                                </div>

                                <div class="mb-3">
                                    <label for="editJenisKas" class="form-label">Jenis Transaksi</label>
                                    <select class="form-select" id="editJenisKas" required>
                                        <option value="">Pilih jenis transaksi</option>
                                        <option value="masuk" ${item.jenis === 'Masuk' || item.jenis === 'masuk' ? 'selected' : ''}>Kas Masuk</option>
                                        <option value="keluar" ${item.jenis === 'Keluar' || item.jenis === 'keluar' ? 'selected' : ''}>Kas Keluar</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="editJumlahKas" class="form-label">Jumlah</label>
                                    <input type="number" class="form-control" id="editJumlahKas" 
                                           value="${item.jumlah}" min="0" required>
                                </div>

                                <div class="mb-3">
                                    <label for="editKeteranganKas" class="form-label">Keterangan</label>
                                    <textarea class="form-control" id="editKeteranganKas" rows="3" required>${item.keterangan}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="app.saveEditKas()">
                                <i class="fas fa-save"></i> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('editKasModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('editKasModal'));
        modal.show();
    }

    editAnggota(id) {
        const rawItem = this.anggotaData.find(a => a.id === id);
        if (!rawItem) {
            this.showAlert('error', 'Data anggota tidak ditemukan');
            return;
        }

        const item = this.validateAndNormalizeAnggota(rawItem);
        if (!item) {
            this.showAlert('error', 'Data anggota tidak valid');
            return;
        }

        const modalHTML = `
            <div class="modal fade" id="editAnggotaModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Data Anggota</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editAnggotaForm">
                                <input type="hidden" id="editAnggotaId" value="${item.id}">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editNoAnggota" class="form-label">Nomor Anggota</label>
                                            <input type="text" class="form-control" id="editNoAnggota" 
                                                   value="${item.noAnggota}" readonly>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editNamaAnggota" class="form-label">Nama Lengkap *</label>
                                            <input type="text" class="form-control" id="editNamaAnggota" 
                                                   
                                                   value="${item.nama}" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editTeleponAnggota" class="form-label">Telepon</label>
                                            <input type="tel" class="form-control" id="editTeleponAnggota" 
                                                   value="${item.telepon}">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editStatusAnggota" class="form-label">Status</label>
                                            <select class="form-select" id="editStatusAnggota" required>
                                                <option value="Aktif" ${item.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
                                                <option value="Non-Aktif" ${item.status === 'Non-Aktif' ? 'selected' : ''}>Non-Aktif</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="editAlamatAnggota" class="form-label">Alamat</label>
                                    <textarea class="form-control" id="editAlamatAnggota" rows="3">${item.alamat}</textarea>
                                </div>

                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle"></i>
                                    <strong>Info:</strong> Tanggal bergabung dan simpanan pokok tidak dapat diubah.
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="app.saveEditAnggota()">
                                <i class="fas fa-save"></i> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('editAnggotaModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('editAnggotaModal'));
        modal.show();
    }

    async saveEditAnggota() {
        const id = document.getElementById('editAnggotaId').value;
        const nama = document.getElementById('editNamaAnggota').value.trim();
        const telepon = document.getElementById('editTeleponAnggota').value.trim();
        const status = document.getElementById('editStatusAnggota').value;
        const alamat = document.getElementById('editAlamatAnggota').value.trim();

        if (!nama) {
            this.showAlert('error', 'Nama anggota harus diisi');
            return;
        }

        const editData = {
            nama: nama,
            telepon: telepon,
            status: status,
            alamat: alamat
        };

        try {
            if (this.isOnline) {
                // Update via API
                const response = await apiService.updateAnggota(id, editData);
                if (response.success || response.data) {
                    // Update local data
                    const index = this.anggotaData.findIndex(item => item.id == id);
                    if (index !== -1) {
                        this.anggotaData[index] = { ...this.anggotaData[index], ...editData };
                    }
                    
                    this.showAlert('success', 'Data anggota berhasil diupdate');
                    this.loadAnggotaTable();
                    this.updateDashboard();
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editAnggotaModal'));
                    modal.hide();
                } else {
                    throw new Error(response.message || 'Gagal mengupdate data');
                }
            } else {
                // Update in localStorage (offline mode)
                const index = this.anggotaData.findIndex(item => item.id == id);
                if (index !== -1) {
                    this.anggotaData[index] = { ...this.anggotaData[index], ...editData };
                    localStorage.setItem('anggotaData', JSON.stringify(this.anggotaData));
                    
                    this.showAlert('success', 'Data anggota berhasil diupdate (offline)');
                    this.loadAnggotaTable();
                    this.updateDashboard();
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editAnggotaModal'));
                    modal.hide();
                } else {
                    throw new Error('Data anggota tidak ditemukan');
                }
            }
        } catch (error) {
            console.error('Error updating anggota:', error);
            this.showAlert('error', `Gagal mengupdate data anggota: ${error.message}`);
        }
    }

    async saveEditNeraca() {
        const id = document.getElementById('editNeracaId').value;
        const tanggal = document.getElementById('editTanggalNeraca').value;
        const kasMasuk = parseFloat(document.getElementById('editKasMasuk').value) || 0;
        const piutangPokok = parseFloat(document.getElementById('editPiutangPokok').value) || 0;
        const piutangJasa = parseFloat(document.getElementById('editPiutangJasa').value) || 0;
        const danaisPokok = parseFloat(document.getElementById('editDanaisPokok').value) || 0;
        const danaisJasa = parseFloat(document.getElementById('editDanaisJasa').value) || 0;
        const simpananPokok = parseFloat(document.getElementById('editSimpananPokok').value) || 0;
        const simpananWajib = parseFloat(document.getElementById('editSimpananWajib').value) || 0;
        const simpananSukarela = parseFloat(document.getElementById('editSimpananSukarela').value) || 0;
        const keterangan = document.getElementById('editKeteranganNeraca').value.trim();

        if (!tanggal) {
            this.showAlert('error', 'Tanggal harus diisi');
            return;
        }

        const editData = {
            tanggal: tanggal,
            kasMasuk: kasMasuk,
            piutangPokok: piutangPokok,
            piutangJasa: piutangJasa,
            danaisPokok: danaisPokok,
            danaisJasa: danaisJasa,
            simpananPokok: simpananPokok,
            simpananWajib: simpananWajib,
            simpananSukarela: simpananSukarela,
            keteranganLain: keterangan
        };

        try {
            if (this.isOnline) {
                // Update via API
                const response = await apiService.updateNeraca(id, editData);
                if (response.success || response.data) {
                    // Update local data
                    const index = this.neracaData.findIndex(item => item.id == id);
                    if (index !== -1) {
                        this.neracaData[index] = { ...this.neracaData[index], ...editData };
                    }
                    
                    this.showAlert('success', 'Data neraca berhasil diupdate');
                    this.loadNeracaTable();
                    this.updateDashboard();
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editNeracaModal'));
                    modal.hide();
                } else {
                    throw new Error(response.message || 'Gagal mengupdate data');
                }
            } else {
                // Update in localStorage (offline mode)
                const index = this.neracaData.findIndex(item => item.id == id);
                if (index !== -1) {
                    this.neracaData[index] = { ...this.neracaData[index], ...editData };
                    localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
                    
                    this.showAlert('success', 'Data neraca berhasil diupdate (offline)');
                    this.loadNeracaTable();
                    this.updateDashboard();
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editNeracaModal'));
                    modal.hide();
                } else {
                    throw new Error('Data neraca tidak ditemukan');
                }
            }
        } catch (error) {
            console.error('Error updating neraca:', error);
            this.showAlert('error', `Gagal mengupdate data neraca: ${error.message}`);
        }
    }

    // Data management functions
    async exportData() {
        // Show export options modal
        this.showExportOptionsModal();
    }

    showExportOptionsModal() {
        const modalHtml = `
            <div class="modal fade" id="exportModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-download"></i> Export Data
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Pilih format dan data yang ingin di-export:</p>
                            
                            <div class="mb-3">
                                <label class="form-label">Format Export:</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="exportFormat" id="formatJSON" value="json" checked>
                                    <label class="form-check-label" for="formatJSON">
                                        JSON (Backup lengkap)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="exportFormat" id="formatCSV" value="csv">
                                    <label class="form-check-label" for="formatCSV">
                                        CSV (Spreadsheet)
                                    </label>
                                </div>
                            </div>
                            
                            <div class="mb-3" id="csvOptions" style="display: none;">
                                <label class="form-label">Data yang akan di-export:</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportNeraca" value="neraca" checked>
                                    <label class="form-check-label" for="exportNeraca">
                                        Data Neraca Harian
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportKas" value="kas" checked>
                                    <label class="form-check-label" for="exportKas">
                                        Data Kas Koperasi
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exportAnggota" value="anggota" checked>
                                    <label class="form-check-label" for="exportAnggota">
                                        Data Anggota
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="app.processExport()">
                                <i class="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if present
        const existingModal = document.getElementById('exportModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('exportModal'));
        modal.show();

        // Toggle CSV options based on format selection
        document.querySelectorAll('input[name="exportFormat"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const csvOptions = document.getElementById('csvOptions');
                if (this.value === 'csv') {
                    csvOptions.style.display = 'block';
                } else {
                    csvOptions.style.display = 'none';
                }
            });
        });
    }

    async processExport() {
        try {
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            
            let data;
            
            if (this.isOnline) {
                try {
                    const response = await apiService.exportAllData();
                    if (response && (response.success || response.data)) {
                        data = response.data || response;
                    } else {
                        throw new Error('No data received from server');
                    }
                } catch (apiError) {
                    console.warn('API export failed, using local data:', apiError);
                    // Fallback to local data if API fails
                    data = {
                        neraca: this.neracaData || [],
                        kas: this.kasData || [],
                        anggota: this.anggotaData || [],
                        exportDate: new Date().toISOString(),
                        source: 'local_fallback'
                    };
                }
            } else {
                // Use local data when offline
                data = {
                    neraca: this.neracaData || [],
                    kas: this.kasData || [],
                    anggota: this.anggotaData || [],
                    exportDate: new Date().toISOString(),
                    source: 'offline'
                };
            }

            // Ensure data is valid
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }

            if (format === 'json') {
                await this.exportAsJSON(data);
            } else if (format === 'csv') {
                await this.exportAsCSV(data);
            }

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
            modal.hide();

        } catch (error) {
            console.error('Error exporting data:', error);
            this.showAlert('error', `Gagal export data: ${error.message}`);
        }
    }

    async exportAsJSON(data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `koperasi_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(link.href);
        
        this.showAlert('success', `Data berhasil di-export sebagai JSON (${data.source || 'server'})`);
    }

    async exportAsCSV(data) {
        const selectedData = [];
        const timestamp = new Date().toISOString().split('T')[0];

        // Check which data types to export
        if (document.getElementById('exportNeraca').checked && data.neraca) {
            selectedData.push({
                name: 'neraca',
                data: data.neraca,
                filename: `koperasi_neraca_${timestamp}.csv`
            });
        }

        if (document.getElementById('exportKas').checked && data.kas) {
            selectedData.push({
                name: 'kas',
                data: data.kas,
                filename: `koperasi_kas_${timestamp}.csv`
            });
        }

        if (document.getElementById('exportAnggota').checked && data.anggota) {
            selectedData.push({
                name: 'anggota',
                data: data.anggota,
                filename: `koperasi_anggota_${timestamp}.csv`
            });
        }

        if (selectedData.length === 0) {
            this.showAlert('warning', 'Pilih setidaknya satu data untuk di-export');
            return;
        }

        // Export each selected data type
        for (const item of selectedData) {
            const csv = this.convertToCSV(item.data, item.name);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = item.filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
        }

        this.showAlert('success', `Data berhasil di-export sebagai CSV (${selectedData.length} file)`);
    }

    convertToCSV(data, type) {
        if (!data || data.length === 0) {
            return '';
        }

        let headers = [];
        let rows = [];

        switch (type) {
            case 'neraca':
                headers = [
                    'Tanggal',
                    'Kas Masuk',
                    'Piutang Pokok',
                    'Piutang Jasa',
                    'Danais Pokok',
                    'Danais Jasa',
                    'Simpanan Pokok',
                    'Simpanan Wajib',
                    'Simpanan Sukarela',
                    'Keterangan Lain',
                    'Jumlah Lain',
                    'Total'
                ];
                
                rows = data.map(item => [
                    item.tanggal || '',
                    item.kasMasuk || item.kas_masuk || 0,
                    item.piutangPokok || item.piutang_pokok || 0,
                    item.piutangJasa || item.piutang_jasa || 0,
                    item.danaisPokok || item.danais_pokok || 0,
                    item.danaisJasa || item.danais_jasa || 0,
                    item.simpananPokok || item.simpanan_pokok || 0,
                    item.simpananWajib || item.simpanan_wajib || 0,
                    item.simpananSukarela || item.simpanan_sukarela || 0,
                    item.keteranganLain || item.keterangan_lain || '',
                    item.jumlahLain || item.keterangan_lain_jumlah || 0,
                    item.total || 0
                ]);
                break;

            case 'kas':
                headers = [
                    'Tanggal',
                    'Jenis',
                    'Keterangan',
                    'Jumlah'
                ];
                
                rows = data.map(item => [
                    item.tanggal || '',
                    item.jenis || '',
                    item.keterangan || '',
                    item.jumlah || 0
                ]);
                break;

            case 'anggota':
                headers = [
                    'No. Anggota',
                    'Nama',
                    'Telepon',
                    'Alamat',
                    'Tanggal Bergabung',
                    'Status'
                ];
                
                rows = data.map(item => [
                    item.noAnggota || item.no_anggota || '',
                    item.nama || '',
                    item.telepon || '',
                    item.alamat || '',
                    item.tanggalBergabung || item.tanggal_bergabung || '',
                    item.status || 'Aktif'
                ]);
                break;

            default:
                return '';
        }

        // Convert to CSV format
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(field => {
                // Handle fields that might contain commas or quotes
                if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
                    return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
            }).join(','))
        ].join('\n');

        // Add BOM for proper UTF-8 encoding in Excel
        return '\ufeff' + csvContent;
    }

    async importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (this.isOnline) {
                    const response = await apiService.importData(data);
                    if (response.success) {
                        await this.loadAllData();
                        this.showAlert('success', 'Data berhasil di-import dari server');
                    } else {
                        throw new Error('Failed to import data to server');
                    }
                } else {
                    // Fallback to localStorage
                    if (data.neraca) this.neracaData = data.neraca;
                    if (data.kas) this.kasData = data.kas;
                    if (data.anggota) this.anggotaData = data.anggota;

                    localStorage.setItem('neracaData', JSON.stringify(this.neracaData));
                    localStorage.setItem('kasData', JSON.stringify(this.kasData));
                    localStorage.setItem('anggotaData', JSON.stringify(this.anggotaData));
                    
                    this.showAlert('success', 'Data berhasil di-import (offline)');
                }

                this.init();
            } catch (error) {
                console.error('Error importing data:', error);
                this.showAlert('error', 'Format file tidak valid atau gagal import');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('PERINGATAN: Ini akan menghapus semua data. Yakin ingin melanjutkan?')) {
            localStorage.clear();
            this.neracaData = [];
            this.kasData = [];
            this.anggotaData = [];
            this.init();
            this.showAlert('success', 'Semua data berhasil dihapus');
        }
    }

    // Utility function untuk populate dropdown anggota
    async populateAnggotaDropdown(selectId) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) return;
        
        // Clear existing options except first one
        selectElement.innerHTML = '<option value="">Pilih Anggota (Opsional)</option>';
        
        // Fetch fresh data from backend if online
        if (this.isOnline) {
            try {
                const response = await apiService.getAllAnggota();
                if (response && response.data) {
                    this.anggotaData = response.data;
                }
            } catch (error) {
                console.warn('Failed to fetch anggota for dropdown:', error);
            }
        }
        
        // Add anggota options dengan normalisasi data
        (this.anggotaData || []).forEach(anggota => {
            if (anggota && anggota.nama) {
                const option = document.createElement('option');
                // Use id sebagai value (untuk anggota_id di backend)
                const anggotaId = anggota.id;
                const noAnggota = anggota.no_anggota || anggota.noAnggota || '';
                const nama = anggota.nama || '';
                
                option.value = anggotaId;
                option.textContent = `${noAnggota} - ${nama}`;
                selectElement.appendChild(option);
            }
        });
        
        console.log(`✅ Populated ${selectId} with ${this.anggotaData?.length || 0} anggota options`);
    }

    // Function untuk mendapatkan nama anggota berdasarkan ID
    getAnggotaNameById(anggotaId) {
        if (!anggotaId || anggotaId === '' || anggotaId === 'null') return '';
        
        // Coba cari berdasarkan id atau anggotaId
        const anggota = this.anggotaData.find(a => 
            a.id == anggotaId || 
            a.anggotaId == anggotaId ||
            a.id === anggotaId || 
            a.anggotaId === anggotaId
        );
        
        return anggota ? anggota.nama : '';
    }

    // Function untuk mendapatkan anggota berdasarkan ID
    getAnggotaById(anggotaId) {
        if (!anggotaId || anggotaId === '' || anggotaId === 'null') return null;
        
        return this.anggotaData.find(a => 
            a.id == anggotaId || 
            a.anggotaId == anggotaId ||
            a.id === anggotaId || 
            a.anggotaId === anggotaId
        ) || null;
    }

    // Function untuk menghitung total kontribusi anggota
    calculateAnggotaContribution(anggotaId) {
        if (!anggotaId || anggotaId === '' || anggotaId === 'null') return 0;
        
        // Cari data anggota dari backend response
        const anggota = this.anggotaData.find(a => 
            String(a.id) === String(anggotaId) || 
            String(a.anggota_id) === String(anggotaId)
        );
        
        if (!anggota) return 0;
        
        // Total kontribusi = simpanan pokok + simpanan wajib + kas masuk + neraca kas masuk
        let total = 0;
        
        // Ambil simpanan dari backend data
        total += this.parseNumber(anggota.simpanan_pokok);
        total += this.parseNumber(anggota.simpanan_wajib);
        
        // Hitung kontribusi dari transaksi kas (hanya yang masuk)
        if (this.kasData && Array.isArray(this.kasData)) {
            this.kasData.forEach(kas => {
                const kasAnggotaId = kas.anggota_id || kas.anggotaId;
                if (String(kasAnggotaId) === String(anggotaId) && 
                    (kas.jenis || '').toLowerCase() === 'masuk') {
                    total += this.parseNumber(kas.jumlah);
                }
            });
        }
        
        // Hitung kontribusi dari neraca harian (kas masuk saja)
        if (this.neracaData && Array.isArray(this.neracaData)) {
            this.neracaData.forEach(neraca => {
                const neracaAnggotaId = neraca.anggota_id || neraca.anggotaId;
                if (String(neracaAnggotaId) === String(anggotaId)) {
                    total += this.parseNumber(neraca.kas_masuk || neraca.kasMasuk);
                }
            });
        }
        
        return total;
    }

    // Safe sort function untuk menghindari error saat data null/undefined
    safeSort(array, compareFn) {
        if (!Array.isArray(array)) return [];
        return [...array].sort(compareFn);
    }

    // Utility function untuk validation
    validateAndNormalizeAnggota(anggota) {
        if (!anggota || typeof anggota !== 'object') return null;
        return {
            id: anggota.id,
            noAnggota: anggota.noAnggota || anggota.no_anggota || '',
            nama: anggota.nama || '',
            telepon: anggota.telepon || '',
            alamat: anggota.alamat || '',
            tanggalBergabung: anggota.tanggalBergabung || anggota.tanggal_bergabung || '',
            status: anggota.status || 'Aktif'
        };
    }

    // Parse number safely
    parseNumber(value) {
        if (value === null || value === undefined || value === '') return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }

    // Format currency
    formatCurrency(amount) {
        const num = this.parseNumber(amount);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }

    // Format date
    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return '-';
        }
    }

    // Show alert function
    showAlert(type, message) {
        // Create alert element if it doesn't exist
        let alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alertContainer';
            alertContainer.style.position = 'fixed';
            alertContainer.style.top = '20px';
            alertContainer.style.right = '20px';
            alertContainer.style.zIndex = '9999';
            document.body.appendChild(alertContainer);
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.style.minWidth = '300px';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        alertContainer.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Update current date
    updateCurrentDate() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('id-ID');
        
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            currentDateElement.textContent = `${dateStr}, ${timeStr}`;
        }
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new KoperasiApp();
});
