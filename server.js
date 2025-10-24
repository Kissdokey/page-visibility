const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 获取当前时间戳
    const timestamp = new Date().toISOString();
    
    // 解析请求URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const query = parsedUrl.query;
    
    // 打印请求日志
    console.log(`[${timestamp}] ${method} ${req.url}`);
    console.log(`  - 路径: ${pathname}`);
    console.log(`  - 查询参数:`, query);
    console.log(`  - User-Agent: ${req.headers['user-agent'] || 'Unknown'}`);
    console.log(`  - IP: ${req.connection.remoteAddress || req.socket.remoteAddress}`);
    console.log('---');
    
    // 设置CORS响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理OPTIONS预检请求
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // 处理静态文件
    if (pathname.endsWith('.html') || pathname.endsWith('.js') || pathname.endsWith('.css')) {
        const filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            let contentType = 'text/html';
            if (pathname.endsWith('.js')) contentType = 'application/javascript';
            if (pathname.endsWith('.css')) contentType = 'text/css';
            
            res.setHeader('Content-Type', contentType + '; charset=utf-8');
            res.writeHead(200);
            res.end(data);
        });
        return;
    }
    
    // 处理beacon数据上报
    if (pathname === '/api/beacon' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('📡 收到Beacon数据:');
                console.log(`  - 事件类型: ${data.eventType}`);
                console.log(`  - 页面URL: ${data.pageUrl}`);
                console.log(`  - 可见性状态: ${data.visibilityState}`);
                console.log(`  - 时间戳: ${data.timestamp}`);
                console.log(`  - 用户代理: ${data.userAgent}`);
                if (data.reason) console.log(`  - 原因: ${data.reason}`);
                console.log('---');
                
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.writeHead(200);
                res.end(JSON.stringify({ success: true, received: data }));
            } catch (e) {
                console.error('❌ Beacon数据解析错误:', e.message);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // 设置JSON响应头
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // 根据不同路径返回不同响应
    let responseData;
    let statusCode = 200;
    
    switch (pathname) {
        case '/':
            responseData = {
                message: '欢迎访问简易Node.js服务器！',
                timestamp: timestamp,
                method: method,
                path: pathname
            };
            break;
            
        case '/api/health':
            responseData = {
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: timestamp
            };
            break;
            
        case '/api/info':
            responseData = {
                server: 'Simple Node.js Server',
                version: '1.0.0',
                node_version: process.version,
                platform: process.platform,
                timestamp: timestamp
            };
            break;
            
        default:
            statusCode = 404;
            responseData = {
                error: '页面未找到',
                message: `路径 ${pathname} 不存在`,
                timestamp: timestamp,
                available_endpoints: [
                    '/',
                    '/api/health',
                    '/api/info',
                    '/api/beacon'
                ]
            };
    }
    
    // 发送响应
    res.writeHead(statusCode);
    res.end(JSON.stringify(responseData, null, 2));
});

// 设置服务器端口
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// 启动服务器
server.listen(PORT, HOST, () => {
    console.log('🚀 简易Node.js服务器已启动！');
    console.log(`📍 服务器地址: http://${HOST}:${PORT}`);
    console.log('📋 可用端点:');
    console.log('   - GET /              - 主页');
    console.log('   - GET /api/health    - 健康检查');
    console.log('   - GET /api/info      - 服务器信息');
    console.log('   - POST /api/beacon   - 接收beacon数据');
    console.log('   - GET /*.html        - 静态HTML文件');
    console.log('💡 按 Ctrl+C 停止服务器');
    console.log('---');
});

// 优雅关闭处理
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});

// 错误处理
server.on('error', (err) => {
    console.error('❌ 服务器错误:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.error(`端口 ${PORT} 已被占用，请尝试其他端口`);
    }
});
