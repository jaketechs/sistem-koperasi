// Simple Backend Server for Koperasi System
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Data storage
let data = {
    anggota: [],
    kas: [],
    neraca: []
};

// Load demo data if available
try {
    const demoDataPath = path.join(__dirname, 'demo-data.js');
    if (fs.existsSync(demoDataPath)) {
        const demoDataContent = fs.readFileSync(demoDataPath, 'utf8');
        // Extract data from demo-data.js
        const dataMatch = demoDataContent.match(/const demoData = ({[\s\S]*?});/);
        if (dataMatch) {
            data = eval(`(${dataMatch[1]})`);
            console.log('✅ Demo data loaded successfully');
        }
    }
} catch (error) {
    console.log('⚠️ Could not load demo data, starting with empty data');
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Koperasi API Server is running',
        timestamp: new Date().toISOString(),
        dataCount: {
            anggota: data.anggota?.length || 0,
            kas: data.kas?.length || 0,
            neraca: data.neraca?.length || 0
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Koperasi API Server is running',
        timestamp: new Date().toISOString(),
        dataCount: {
            anggota: data.anggota?.length || 0,
            kas: data.kas?.length || 0,
            neraca: data.neraca?.length || 0
        }
    });
});

// Debug endpoint untuk melihat semua data
app.get('/api/debug', (req, res) => {
    res.json({
        success: true,
        message: 'Debug data',
        data: {
            anggota: data.anggota || [],
            kas: data.kas || [],
            neraca: data.neraca || []
        },
        counts: {
            anggota: data.anggota?.length || 0,
            kas: data.kas?.length || 0,
            neraca: data.neraca?.length || 0
        }
    });
});

// Anggota endpoints
app.get('/anggota', (req, res) => {
    res.json(data.anggota || []);
});

app.get('/api/anggota', (req, res) => {
    console.log('📊 GET /api/anggota - returning', data.anggota?.length || 0, 'anggota');
    res.json({
        success: true,
        message: 'Data anggota berhasil diambil',
        data: data.anggota || []
    });
});

app.post('/anggota', (req, res) => {
    const newAnggota = {
        id: Date.now().toString(),
        ...req.body
    };
    data.anggota.push(newAnggota);
    res.json(newAnggota);
});

app.post('/api/anggota', (req, res) => {
    try {
        const newAnggota = {
            id: Date.now().toString(),
            ...req.body,
            created_at: new Date().toISOString()
        };
        data.anggota.push(newAnggota);
        
        console.log('✅ New anggota saved:', newAnggota);
        
        res.json({
            success: true,
            message: 'Anggota berhasil ditambahkan',
            data: newAnggota
        });
    } catch (error) {
        console.error('❌ Error saving anggota:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan anggota',
            error: error.message
        });
    }
});

// Kas endpoints
app.get('/kas', (req, res) => {
    res.json(data.kas || []);
});

app.get('/api/kas', (req, res) => {
    res.json(data.kas || []);
});

app.get('/transaksi-kas', (req, res) => {
    res.json(data.kas || []);
});

app.get('/api/transaksi-kas', (req, res) => {
    console.log('📊 GET /api/transaksi-kas - returning', data.kas?.length || 0, 'kas transactions');
    res.json({
        success: true,
        message: 'Data transaksi kas berhasil diambil',
        data: data.kas || []
    });
});

app.post('/kas', (req, res) => {
    const newKas = {
        id: Date.now().toString(),
        ...req.body
    };
    data.kas.push(newKas);
    res.json(newKas);
});

app.post('/api/kas', (req, res) => {
    const newKas = {
        id: Date.now().toString(),
        ...req.body
    };
    data.kas.push(newKas);
    res.json(newKas);
});

app.post('/transaksi-kas', (req, res) => {
    const newKas = {
        id: Date.now().toString(),
        ...req.body
    };
    data.kas.push(newKas);
    res.json(newKas);
});

app.post('/api/transaksi-kas', (req, res) => {
    try {
        const newKas = {
            id: Date.now().toString(),
            ...req.body,
            created_at: new Date().toISOString()
        };
        data.kas.push(newKas);
        
        console.log('✅ New kas transaction saved:', newKas);
        
        res.json({
            success: true,
            message: 'Transaksi kas berhasil disimpan',
            data: newKas
        });
    } catch (error) {
        console.error('❌ Error saving kas transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan transaksi kas',
            error: error.message
        });
    }
});

// Neraca endpoints
app.get('/neraca', (req, res) => {
    res.json(data.neraca || []);
});

app.get('/api/neraca', (req, res) => {
    res.json(data.neraca || []);
});

app.get('/neraca-harian', (req, res) => {
    res.json(data.neraca || []);
});

app.get('/api/neraca-harian', (req, res) => {
    console.log('📊 GET /api/neraca-harian - returning', data.neraca?.length || 0, 'neraca entries');
    res.json({
        success: true,
        message: 'Data neraca harian berhasil diambil',
        data: data.neraca || []
    });
});

app.post('/neraca', (req, res) => {
    const newNeraca = {
        id: Date.now().toString(),
        ...req.body
    };
    data.neraca.push(newNeraca);
    res.json(newNeraca);
});

app.post('/api/neraca', (req, res) => {
    const newNeraca = {
        id: Date.now().toString(),
        ...req.body
    };
    data.neraca.push(newNeraca);
    res.json(newNeraca);
});

app.post('/neraca-harian', (req, res) => {
    const newNeraca = {
        id: Date.now().toString(),
        ...req.body
    };
    data.neraca.push(newNeraca);
    res.json(newNeraca);
});

app.post('/api/neraca-harian', (req, res) => {
    try {
        const newNeraca = {
            id: Date.now().toString(),
            ...req.body,
            created_at: new Date().toISOString()
        };
        data.neraca.push(newNeraca);
        
        console.log('✅ New neraca saved:', newNeraca);
        
        res.json({
            success: true,
            message: 'Data neraca berhasil disimpan',
            data: newNeraca
        });
    } catch (error) {
        console.error('❌ Error saving neraca:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan data neraca',
            error: error.message
        });
    }
});

// Catch all for debugging
app.use('*', (req, res) => {
    console.log(`❓ Unhandled request: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Endpoint not found',
        method: req.method,
        url: req.originalUrl,
        availableEndpoints: [
            'GET /health',
            'GET /api/health',
            'GET /anggota',
            'GET /api/anggota',
            'POST /anggota',
            'POST /api/anggota',
            'GET /kas',
            'GET /api/kas',
            'GET /transaksi-kas',
            'GET /api/transaksi-kas',
            'POST /kas',
            'POST /api/kas',
            'POST /transaksi-kas',
            'POST /api/transaksi-kas',
            'GET /neraca',
            'GET /api/neraca',
            'GET /neraca-harian',
            'GET /api/neraca-harian',
            'POST /neraca',
            'POST /api/neraca',
            'POST /neraca-harian',
            'POST /api/neraca-harian'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Koperasi API Server running on http://localhost:${PORT}`);
    console.log(`📊 Data loaded:`, {
        anggota: data.anggota?.length || 0,
        kas: data.kas?.length || 0,
        neraca: data.neraca?.length || 0
    });
});
