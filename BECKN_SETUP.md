# 🌾 Beckn Integration Setup Guide

This guide will help you set up the complete Beckn-enabled soil testing platform with both BAP (Buyer App Platform) and BPP (Beckn Provider Platform) implementations.

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git for version control
- Basic understanding of Beckn Protocol

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/muzammil-13/beckn-soil-testing-assignment.git
cd beckn-soil-testing-assignment/part2-frontend
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 3. Start Development Servers

```bash
# Option 1: Start both BAP and BPP servers
npm run both

# Option 2: Start individually
# Terminal 1 - BAP Server
npm run dev

# Terminal 2 - BPP Server  
npm run bpp
```

### 4. Frontend Access

```bash
# Open frontend in browser
open ../index.html

# Or use live server
# Install: npm install -g live-server
live-server ../
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Beckn Configuration
BECKN_PRIVATE_KEY=your_private_key_here
BECKN_PUBLIC_KEY=your_public_key_here
BECKN_GATEWAY_URL=https://uki-gateway.becknprotocol.io
BAP_ID=farmer-app.openagri.network
BAP_URI=https://farmer-app.openagri.network/beckn

# Server Configuration
PORT=3001
NODE_ENV=development

# External APIs (Optional)
KRISHITANTRA_API_KEY=your_api_key
GEOCODING_API_KEY=your_geocoding_key
```

## 🧪 Testing the Integration

### 1. Run Integration Tests

```bash
# Run comprehensive tests
npm test

# Watch mode for development
npm run test:watch
```

### 2. Manual Testing Flow

1. **Homepage**: Visit `http://localhost:8080` (or open index.html)
2. **Registration**: Click "Join as Farmer" 
3. **Beckn Search**: Fill form and submit
4. **Provider Discovery**: Wait for Beckn network response
5. **Service Selection**: Choose from available providers
6. **Confirmation**: Complete the booking flow

### 3. API Testing with curl

```bash
# Test BAP health
curl http://localhost:3001/health

# Test BPP health  
curl http://localhost:3002/health

# Test search functionality
curl -X POST http://localhost:3001/api/beckn/search \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "district": "Bangalore",
      "state": "Karnataka",
      "gps": "12.9716,77.5946"
    },
    "testType": "Basic Soil Testing"
  }'
```

## 🐳 Docker Deployment

### 1. Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Individual Docker Commands

```bash
# Build BAP image
docker build -t beckn-bap ./backend

# Run BAP container
docker run -p 3001:3001 -e NODE_ENV=production beckn-bap

# Build and run BPP
docker build -t beckn-bpp ./backend
docker run -p 3002:3002 beckn-bpp node mock-bpp.js
```

## 📊 Monitoring and Debugging

### 1. Server Logs

```bash
# BAP Server logs
tail -f backend/logs/bap.log

# BPP Server logs  
tail -f backend/logs/bpp.log
```

### 2. Browser Console

- Open Developer Tools (F12)
- Check Console tab for Beckn transaction logs
- Monitor Network tab for API calls
- Look for real-time status updates

### 3. Health Checks

```bash
# Check all services
curl http://localhost:3001/health && \
curl http://localhost:3002/health && \
echo "All services healthy ✅"
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on ports 3001, 3002
   lsof -ti:3001 | xargs kill -9
   lsof -ti:3002 | xargs kill -9
   ```

2. **CORS Issues**
   - Ensure both servers are running
   - Check CORS configuration in backend
   - Use same origin for frontend and API

3. **Beckn Network Timeout**
   - Check internet connectivity
   - Verify Beckn gateway URL
   - Ensure proper authentication

4. **No Providers Found**
   - Verify BPP server is running
   - Check BPP registration with gateway
   - Confirm service area coverage

### Debug Mode

```bash
# Enable debug logging
DEBUG=beckn:* npm run dev

# Verbose logging
NODE_ENV=development DEBUG=* npm run dev
```

## 📈 Production Deployment

### 1. Environment Setup

```bash
# Production environment
NODE_ENV=production
PORT=3001
BECKN_GATEWAY_URL=https://prod-gateway.becknprotocol.io

# Security
BECKN_PRIVATE_KEY=<secure_private_key>
BECKN_PUBLIC_KEY=<corresponding_public_key>
```

### 2. SSL/HTTPS Configuration

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Process Management

```bash
# Using PM2
npm install -g pm2

# Start BAP
pm2 start backend/beckn-bap.js --name "beckn-bap"

# Start BPP
pm2 start backend/mock-bpp.js --name "beckn-bpp"

# Monitor
pm2 monit

# Auto-restart on system reboot
pm2 startup
pm2 save
```

## 🔐 Security Considerations

1. **API Keys**: Store securely in environment variables
2. **HTTPS**: Use SSL certificates in production
3. **Rate Limiting**: Implement API rate limiting
4. **Input Validation**: Validate all user inputs
5. **Authentication**: Implement proper user authentication

## 📚 Additional Resources

- [Beckn Protocol Documentation](https://developers.becknprotocol.io/)
- [UKI Implementation Guide](https://uki.gov.in/developers)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Test individual components separately
4. Verify network connectivity and ports
5. Contact the development team

---

**Happy Coding! 🌾**

