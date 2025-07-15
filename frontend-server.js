// Frontend Server for Koperasi System - Port 3001
// Backend API runs on Port 3000
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001; // Frontend server port
const BACKEND_PORT = 3000; // Backend API port

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend) - this will serve main.html, assets, etc.
app.use(express.static(__dirname, {
    etag: false,
    lastModified: false,
    maxAge: 0
}));

// Add frontend headers to prevent 426 errors
app.use((req, res, next) => {
    res.setHeader('Connection', 'close');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Frontend Routes (serve the main application)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Health check for frontend server
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Koperasi Frontend Server is running',
        timestamp: new Date().toISOString(),
        frontend_port: PORT,
        backend_port: BACKEND_PORT,
        backend_url: `http://localhost:${BACKEND_PORT}`
    });
});

// Catch all other routes and redirect to main.html
app.get('*', (req, res) => {
    // If it's an API request, inform that backend is on different port
    if (req.path.startsWith('/api/')) {
        res.status(404).json({
            error: 'API endpoint not found on frontend server',
            message: `Backend API is running on port ${BACKEND_PORT}`,
            frontend_port: PORT,
            backend_url: `http://localhost:${BACKEND_PORT}${req.path}`,
            note: 'This is the frontend server. API requests should go to the backend server.'
        });
    } else {
        // For non-API routes, serve the main HTML file (SPA behavior)
        res.sendFile(path.join(__dirname, 'main.html'));
    }
});

// Start the frontend server
const server = app.listen(PORT, () => {
    console.log('🚀 Koperasi Frontend Server started successfully!');
    console.log(`📱 Frontend URL: http://localhost:${PORT}`);
    console.log(`🌐 Main App: http://localhost:${PORT}/main.html`);
    console.log(`🔗 Backend API: http://localhost:${BACKEND_PORT}`);
    console.log(`💾 Health Check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('� Configuration:');
    console.log(`   Frontend Server: Port ${PORT}`);
    console.log(`   Backend API: Port ${BACKEND_PORT}`);
    console.log('   Frontend serves: HTML, CSS, JS files');
    console.log('   Backend handles: API endpoints (/api/*)');
    console.log('');
    console.log('✅ Frontend server is ready!');
    console.log('💡 Make sure backend server is running on port 3000');
});

// Prevent keep-alive
server.keepAliveTimeout = 0;
server.headersTimeout = 1000;

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down frontend server gracefully...');
    server.close(() => {
        console.log('✅ Frontend server closed successfully');
        process.exit(0);
    });
});
