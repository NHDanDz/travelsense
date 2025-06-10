// proxy-server.js
const http = require('http');
const httpProxy = require('http-proxy');

// Tạo proxy server
const proxy = httpProxy.createProxyServer({});

// Tạo server chính
const server = http.createServer((req, res) => {
  // Add CORS headers cho tất cả requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Log all requests
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Route theo URL path
  if (req.url.startsWith('/api/')) {
    // Proxy API requests tới backend (port 8089)
    console.log(`🔌 Proxying to Backend: ${req.url}`);
    proxy.web(req, res, {
      target: 'http://localhost:8089',
      changeOrigin: true
    });
  } else {
    // Proxy tất cả requests khác tới frontend (port 3000)
    console.log(`📱 Proxying to Frontend: ${req.url}`);
    proxy.web(req, res, {
      target: 'http://localhost:3000',
      changeOrigin: true
    });
  }
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('❌ Proxy error:', err.message);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error: ' + err.message);
  }
});

// Handle WebSocket proxy for Next.js hot reload
server.on('upgrade', (req, socket, head) => {
  console.log('🔄 WebSocket upgrade:', req.url);
  proxy.ws(req, socket, head, {
    target: 'http://localhost:3000',
    changeOrigin: true
  });
});

// Start proxy server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`
🚀 Proxy Server Started Successfully!
📍 Listening on: http://localhost:${PORT}
📱 Frontend: http://localhost:${PORT}
🔌 API: http://localhost:${PORT}/api/...

🌐 To expose publicly:
   ngrok http ${PORT}
  `);
});