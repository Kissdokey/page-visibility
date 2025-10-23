const http = require('http');
const url = require('url');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 获取当前时间戳
    const timestamp = new Date().toISOString();
    
    // 解析请求URL
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const query = parsedUrl.query;
    
    // 打印请求日志
    console.log(`[${timestamp}] ${method} ${req.url}`);
    console.log(`  - 路径: ${path}`);
    console.log(`  - 查询参数:`, query);
    console.log(`  - User-Agent: ${req.headers['user-agent'] || 'Unknown'}`);
    console.log(`  - IP: ${req.connection.remoteAddress || req.socket.remoteAddress}`);
    console.log('---');
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理OPTIONS预检请求
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // 根据不同路径返回不同响应
    let responseData;
    let statusCode = 200;
    
    switch (path) {
        case '/':
            responseData = {
                message: '欢迎访问简易Node.js服务器！',
                timestamp: timestamp,
                method: method,
                path: path
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
                message: `路径 ${path} 不存在`,
                timestamp: timestamp,
                available_endpoints: [
                    '/',
                    '/api/health',
                    '/api/info'
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
