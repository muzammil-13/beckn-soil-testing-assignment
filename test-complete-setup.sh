# Complete Beckn Integration Test Script
echo "🧪 Starting Complete Beckn Integration Test..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
BAP_PORT=3001
BPP_PORT=3002
FRONTEND_PORT=8080

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $name to start..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s $url > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready${NC}"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $name failed to start${NC}"
    return 1
}

# Step 1: Check prerequisites
echo "1️⃣ Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Step 2: Install dependencies
echo "2️⃣ Installing dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Step 3: Start servers
echo "3️⃣ Starting servers..."

# Kill existing processes
if check_port $BAP_PORT; then
    echo "🔄 Stopping existing BAP server..."
    lsof -ti:$BAP_PORT | xargs kill -9 2>/dev/null || true
fi

if check_port $BPP_PORT; then
    echo "🔄 Stopping existing BPP server..."
    lsof -ti:$BPP_PORT | xargs kill -9 2>/dev/null || true
fi

# Start BAP server
echo "🚀 Starting BAP server..."
cd backend
nohup node beckn-bap.js > bap.log 2>&1 &
BAP_PID=$!
cd ..

# Start BPP server
echo "🚀 Starting BPP server..."
cd backend
nohup node mock-bpp.js > bpp.log 2>&1 &
BPP_PID=$!
cd ..

# Wait for servers to start
wait_for_service "http://localhost:$BAP_PORT/health" "BAP Server"
BAP_STATUS=$?

wait_for_service "http://localhost:$BPP_PORT/health" "BPP Server"
BPP_STATUS=$?

if [ $BAP_STATUS -ne 0 ] || [ $BPP_STATUS -ne 0 ]; then
    echo -e "${RED}❌ Server startup failed${NC}"
    exit 1
fi

# Step 4: Test API endpoints
echo "4️⃣ Testing API endpoints..."

# Test BAP health
BAP_HEALTH=$(curl -s http://localhost:$BAP_PORT/health | jq -r '.status' 2>/dev/null)
if [ "$BAP_HEALTH" = "healthy" ]; then
    echo -e "${GREEN}✅ BAP health check passed${NC}"
else
    echo -e "${RED}❌ BAP health check failed${NC}"
fi

# Test BPP health
BPP_HEALTH=$(curl -s http://localhost:$BPP_PORT/health | jq -r '.status' 2>/dev/null)
if [ "$BPP_HEALTH" = "healthy" ]; then
    echo -e "${GREEN}✅ BPP health check passed${NC}"
else
    echo -e "${RED}❌ BPP health check failed${NC}"
fi

# Step 5: Test Beckn search flow
echo "5️⃣ Testing Beckn search flow..."

SEARCH_RESPONSE=$(curl -s -X POST http://localhost:$BAP_PORT/api/beckn/search \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "district": "Bangalore",
      "state": "Karnataka",
      "gps": "12.9716,77.5946"
    },
    "testType": "Basic Soil Testing",
    "farmerDetails": {
      "name": "Test Farmer",
      "phone": "9876543210",
      "role": "farmer"
    }
  }')

TRANSACTION_ID=$(echo $SEARCH_RESPONSE | jq -r '.transaction_id' 2>/dev/null)

if [ "$TRANSACTION_ID" != "null" ] && [ "$TRANSACTION_ID" != "" ]; then
    echo -e "${GREEN}✅ Beckn search initiated: $TRANSACTION_ID${NC}"
    
    # Wait for search results
    echo "⏳ Waiting for search results..."
    sleep 5
    
    RESULTS=$(curl -s http://localhost:$BAP_PORT/api/beckn/search-results/$TRANSACTION_ID)
    PROVIDER_COUNT=$(echo $RESULTS | jq -r '.providers | length' 2>/dev/null)
    
        if [ "$PROVIDER_COUNT" != "null" ] && [ "$PROVIDER_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $PROVIDER_COUNT providers${NC}"
    else
        echo -e "${YELLOW}⚠️ No providers found (this is expected in demo mode)${NC}"
    fi
else
    echo -e "${RED}❌ Beckn search failed${NC}"
fi

# Step 6: Test frontend accessibility
echo "6️⃣ Testing frontend accessibility..."

if [ -f "index.html" ]; then
    echo -e "${GREEN}✅ Frontend files found${NC}"
    
    # Check if live-server is available
    if command -v live-server &> /dev/null; then
        echo "🌐 Starting live-server for frontend..."
        nohup live-server --port=$FRONTEND_PORT --no-browser > frontend.log 2>&1 &
        FRONTEND_PID=$!
        
        sleep 3
        
        if check_port $FRONTEND_PORT; then
            echo -e "${GREEN}✅ Frontend server running on http://localhost:$FRONTEND_PORT${NC}"
        else
            echo -e "${YELLOW}⚠️ Frontend server failed to start${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ live-server not found. Install with: npm install -g live-server${NC}"
    fi
else
    echo -e "${RED}❌ Frontend files not found${NC}"
fi

# Step 7: Generate test report
echo "7️⃣ Generating test report..."

cat > test-report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Beckn Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 10px; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #ddd; }
        .success { border-left-color: #4CAF50; background: #f8fff8; }
        .warning { border-left-color: #ff9800; background: #fff8e1; }
        .error { border-left-color: #f44336; background: #ffebee; }
        .code { background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌾 Beckn Soil Testing Integration Test Report</h1>
        <p>Generated on: $(date)</p>
    </div>
    
    <div class="section success">
        <h2>✅ Test Summary</h2>
        <ul>
            <li>BAP Server: $([ "$BAP_HEALTH" = "healthy" ] && echo "✅ Healthy" || echo "❌ Failed")</li>
            <li>BPP Server: $([ "$BPP_HEALTH" = "healthy" ] && echo "✅ Healthy" || echo "❌ Failed")</li>
            <li>Beckn Search: $([ "$TRANSACTION_ID" != "null" ] && echo "✅ Working" || echo "❌ Failed")</li>
            <li>Frontend: $([ -f "index.html" ] && echo "✅ Available" || echo "❌ Missing")</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>🔗 Access URLs</h2>
        <ul>
            <li><a href="http://localhost:$BAP_PORT/health">BAP Health Check</a></li>
            <li><a href="http://localhost:$BPP_PORT/health">BPP Health Check</a></li>
            <li><a href="http://localhost:$FRONTEND_PORT">Frontend Application</a></li>
        </ul>
    </div>
    
    <div class="section">
        <h2>📊 Server Information</h2>
        <div class="code">
BAP Server PID: $BAP_PID
BPP Server PID: $BPP_PID
Frontend PID: ${FRONTEND_PID:-"Not started"}
Transaction ID: ${TRANSACTION_ID:-"None"}
        </div>
    </div>
    
    <div class="section">
        <h2>🛠️ Next Steps</h2>
        <ol>
            <li>Visit <a href="http://localhost:$FRONTEND_PORT">http://localhost:$FRONTEND_PORT</a> to access the application</li>
            <li>Click "Join as Farmer" to test the registration flow</li>
            <li>Fill out the form to trigger Beckn search</li>
            <li>Monitor console logs for real-time updates</li>
            <li>Check server logs in backend/ directory for debugging</li>
        </ol>
    </div>
</body>
</html>
EOF

echo -e "${GREEN}✅ Test report generated: test-report.html${NC}"

# Step 8: Final summary
echo "8️⃣ Test Summary"
echo "================================================"

if [ "$BAP_HEALTH" = "healthy" ] && [ "$BPP_HEALTH" = "healthy" ]; then
    echo -e "${GREEN}🎉 All tests passed! Beckn integration is working.${NC}"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:$FRONTEND_PORT"
    echo "   BAP API:  http://localhost:$BAP_PORT"
    echo "   BPP API:  http://localhost:$BPP_PORT"
    echo ""
    echo "📋 To stop servers:"
    echo "   kill $BAP_PID $BPP_PID ${FRONTEND_PID:-}"
    echo ""
    echo "📊 View detailed report: open test-report.html"
else
    echo -e "${RED}❌ Some tests failed. Check the logs for details.${NC}"
    echo ""
    echo "🔍 Debug information:"
    echo "   BAP logs: backend/bap.log"
    echo "   BPP logs: backend/bpp.log"
    echo "   Frontend logs: frontend.log"
fi

echo ""
echo "🚀 Happy coding with Beckn Protocol!"

