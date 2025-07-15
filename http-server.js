const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8082;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    // Default to main.html
    if (filePath === './') {
        filePath = './main.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';
    
    // Add headers to prevent 426 errors
    res.setHeader('Connection', 'close');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html', 'Connection': 'close' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                // Server error
                res.writeHead(500, { 'Connection': 'close' });
                res.end('Server Error: ' + error.code);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': mimeType, 'Connection': 'close' });
            res.end(content, 'utf-8');
        }
    });
});

// Prevent keep-alive
server.keepAliveTimeout = 0;
server.maxHeadersCount = 1000;

server.listen(PORT, () => {
    console.log(`🚀 Frontend server running at http://localhost:${PORT}/`);
    console.log(`📱 Main app: http://localhost:${PORT}/main.html`);
    console.log(`🔧 API Tester: http://localhost:${PORT}/api-tester.html`);
    console.log(`🔧 Debug page: http://localhost:${PORT}/debug-connection.html`);
});
