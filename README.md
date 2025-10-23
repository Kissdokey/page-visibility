# 简易Node.js服务器

一个使用Node.js原生HTTP模块创建的简易服务器，具备请求日志记录和基本API响应功能。

## 功能特性

- ✅ HTTP服务器基础功能
- ✅ 详细的请求日志记录
- ✅ JSON格式响应
- ✅ CORS跨域支持
- ✅ 多个API端点
- ✅ 优雅关闭处理
- ✅ 错误处理

## 快速开始

### 安装依赖
```bash
# 本项目使用Node.js原生模块，无需额外依赖
npm install
```

### 启动服务器
```bash
# 方式1：使用npm脚本
npm start

# 方式2：直接运行
node server.js
```

### 访问服务器
服务器默认运行在 `http://localhost:3000`

## API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/` | GET | 主页，返回欢迎信息 |
| `/api/health` | GET | 健康检查，返回服务器状态 |
| `/api/info` | GET | 服务器信息，返回版本等详情 |

## 示例请求

### 主页
```bash
curl http://localhost:3000/
```

响应：
```json
{
  "message": "欢迎访问简易Node.js服务器！",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "method": "GET",
  "path": "/"
}
```

### 健康检查
```bash
curl http://localhost:3000/api/health
```

响应：
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 服务器信息
```bash
curl http://localhost:3000/api/info
```

响应：
```json
{
  "server": "Simple Node.js Server",
  "version": "1.0.0",
  "node_version": "v18.17.0",
  "platform": "win32",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 日志输出

服务器会在控制台输出详细的请求日志：

```
[2024-01-01T12:00:00.000Z] GET /api/health
  - 路径: /api/health
  - 查询参数: {}
  - User-Agent: curl/7.68.0
  - IP: ::1
---
```

## 环境变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `PORT` | 3000 | 服务器端口 |
| `HOST` | localhost | 服务器主机地址 |

## 停止服务器

按 `Ctrl+C` 优雅关闭服务器。

## 项目结构

```
page-visibility/
├── server.js          # 主服务器文件
├── package.json       # 项目配置
├── README.md          # 项目说明
└── LICENSE           # 许可证
```

## 许可证

本项目基于 ISC 许可证开源。
