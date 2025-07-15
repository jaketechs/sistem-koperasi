const express = require('express');
const path = require('path');
const app = express();

const PORT = 3001; // Ubah ke port 3001 untuk konsistensi

// Disable keep-alive to prevent 426 errors
app.disable('etag');
app.use((req, res, next) => {
    res.setHeader('Connection', 'close');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Serve static files
app.use(express.static(__dirname, {
    etag: false,
    lastModified: false,
    maxAge: 0
}));

// Route untuk main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Health check
app.get('/status', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Frontend server running at http://localhost:${PORT}`);
    console.log(`📱 Main app: http://localhost:${PORT}/main.html`);
    console.log(`🔧 API Tester: http://localhost:${PORT}/api-tester.html`);
    console.log(`🔧 Debug page: http://localhost:${PORT}/debug-connection.html`);
});

// Prevent keep-alive
server.keepAliveTimeout = 0;
server.headersTimeout = 1000;
