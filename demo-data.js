// Demo Data untuk Testing Aplikasi Koperasi
// Jalankan kode ini di browser console untuk mengisi data demo

const demoData = {
  neraca: [
    {
      id: 1719504000000,
      tanggal: "2025-07-01",
      kasMasuk: 5000000,
      piutangPokok: 2000000,
      piutangJasa: 200000,
      danaisPokok: 1500000,
      danaisJasa: 150000,
      simpananPokok: 500000,
      simpananWajib: 300000,
      simpananSukarela: 800000,
      keteranganLain: "Pendapatan jasa administrasi",
      jumlahLain: 100000,
      total: 10550000,
      anggotaId: 1719504300000,
      namaAnggota: "Budi Santoso"
    },
    {
      id: 1719590400000,
      tanggal: "2025-07-02", 
      kasMasuk: 3500000,
      piutangPokok: 1800000,
      piutangJasa: 180000,
      danaisPokok: 1200000,
      danaisJasa: 120000,
      simpananPokok: 400000,
      simpananWajib: 250000,
      simpananSukarela: 600000,
      keteranganLain: "Denda keterlambatan",
      jumlahLain: 50000,
      total: 8100000,
      anggotaId: 1719504400000,
      namaAnggota: "Siti Aminah"
    },
    {
      id: 1719676800000,
      tanggal: "2025-07-03",
      kasMasuk: 4200000,
      piutangPokok: 2200000,
      piutangJasa: 220000,
      danaisPokok: 1600000,
      danaisJasa: 160000,
      simpananPokok: 600000,
      simpananWajib: 350000,
      simpananSukarela: 900000,
      keteranganLain: "",
      jumlahLain: 0,
      total: 10230000,
      anggotaId: 1719504500000,
      namaAnggota: "Ahmad Hidayat"
    }
  ],
  
  kas: [
    {
      id: 1719504100000,
      tanggal: "2025-07-01",
      jenis: "masuk",
      jumlah: 5000000,
      keterangan: "Setoran kas awal bulan",
      anggotaId: 1719504300000,
      namaAnggota: "Budi Santoso"
    },
    {
      id: 1719504200000,
      tanggal: "2025-07-01", 
      jenis: "keluar",
      jumlah: 500000,
      keterangan: "Biaya operasional kantor",
      anggotaId: null,
      namaAnggota: ""
    },
    {
      id: 1719590500000,
      tanggal: "2025-07-02",
      jenis: "masuk",
      jumlah: 3500000,
      keterangan: "Penerimaan angsuran anggota",
      anggotaId: 1719504400000,
      namaAnggota: "Siti Aminah"
    },
    {
      id: 1719590600000,
      tanggal: "2025-07-02",
      jenis: "keluar", 
      jumlah: 200000,
      keterangan: "Biaya listrik dan air",
      anggotaId: null,
      namaAnggota: ""
    },
    {
      id: 1719676900000,
      tanggal: "2025-07-03",
      jenis: "masuk",
      jumlah: 4200000,
      keterangan: "Setoran simpanan anggota",
      anggotaId: 1719504500000,
      namaAnggota: "Ahmad Hidayat"
    },
    {
      id: 1719677000000,
      tanggal: "2025-07-03",
      jenis: "keluar",
      jumlah: 300000,
      keterangan: "Gaji karyawan harian",
      anggotaId: null,
      namaAnggota: ""
    }
  ],
  
  anggota: [
    {
      id: 1719504300000,
      anggotaId: 1719504300000, // Konsistensi dengan field lain
      noAnggota: "KPP2025001",
      nama: "Budi Santoso",
      telepon: "08123456789",
      tanggalBergabung: "2025-01-15",
      alamat: "Jl. Pasar Raya No. 12, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0 // Will be calculated
    },
    {
      id: 1719504400000,
      anggotaId: 1719504400000,
      noAnggota: "KPP2025002", 
      nama: "Siti Aminah",
      telepon: "08234567890",
      tanggalBergabung: "2025-02-01",
      alamat: "Jl. Mawar No. 5, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    },
    {
      id: 1719504500000,
      anggotaId: 1719504500000,
      noAnggota: "KPP2025003",
      nama: "Ahmad Hidayat", 
      telepon: "08345678901",
      tanggalBergabung: "2025-02-15",
      alamat: "Jl. Melati No. 8, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    },
    {
      id: 1719504600000,
      anggotaId: 1719504600000,
      noAnggota: "KPP2025004",
      nama: "Rina Marlina",
      telepon: "08456789012",
      tanggalBergabung: "2025-03-01", 
      alamat: "Jl. Dahlia No. 3, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    },
    {
      id: 1719504700000,
      anggotaId: 1719504700000,
      noAnggota: "KPP2025005",
      nama: "Joko Widodo",
      telepon: "08567890123",
      tanggalBergabung: "2025-03-15",
      alamat: "Jl. Anggrek No. 15, Padang Pangan", 
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    },
    {
      id: 1719504800000,
      anggotaId: 1719504800000,
      noAnggota: "KPP2025006",
      nama: "Sri Mulyani",
      telepon: "08678901234",
      tanggalBergabung: "2025-04-01",
      alamat: "Jl. Kenanga No. 7, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    },
    {
      id: 1719504900000,
      anggotaId: 1719504900000,
      noAnggota: "KPP2025007",
      nama: "Bambang Sutrisno",
      telepon: "08789012345", 
      tanggalBergabung: "2025-04-15",
      alamat: "Jl. Cempaka No. 9, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    },
    {
      id: 1719505000000,
      anggotaId: 1719505000000,
      noAnggota: "KPP2025008",
      nama: "Dewi Sartika",
      telepon: "08890123456",
      tanggalBergabung: "2025-05-01",
      alamat: "Jl. Seroja No. 11, Padang Pangan",
      status: "Aktif",
      simpananPokok: 100000,
      simpananWajib: 50000,
      totalKontribusi: 0
    }
  ]
};

// Function untuk load demo data
function loadDemoData() {
  // Konfirmasi sebelum load
  if (confirm('Apakah Anda ingin memuat data demo? Ini akan menimpa data yang sudah ada.')) {
    localStorage.setItem('neracaData', JSON.stringify(demoData.neraca));
    localStorage.setItem('kasData', JSON.stringify(demoData.kas));
    localStorage.setItem('anggotaData', JSON.stringify(demoData.anggota));
    
    // Reload aplikasi jika sudah ada instance
    if (typeof app !== 'undefined') {
      app.neracaData = demoData.neraca;
      app.kasData = demoData.kas;
      app.anggotaData = demoData.anggota;
      app.init();
    }
    
    alert('Data demo berhasil dimuat! Silakan refresh halaman jika diperlukan.');
    
    // Auto refresh
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Function untuk clear demo data
function clearDemoData() {
  if (confirm('Apakah Anda ingin menghapus semua data demo?')) {
    localStorage.removeItem('neracaData');
    localStorage.removeItem('kasData'); 
    localStorage.removeItem('anggotaData');
    
    if (typeof app !== 'undefined') {
      app.neracaData = [];
      app.kasData = [];
      app.anggotaData = [];
      app.init();
    }
    
    alert('Data demo berhasil dihapus!');
    
    // Auto refresh
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Instructions
console.log('=== DEMO DATA KOPERASI ===');
console.log('Untuk memuat data demo, jalankan: loadDemoData()');
console.log('Untuk menghapus data demo, jalankan: clearDemoData()');
console.log('Data demo meliputi:');
console.log('- 3 data neraca harian');
console.log('- 6 transaksi kas'); 
console.log('- 8 data anggota');
console.log('========================');
