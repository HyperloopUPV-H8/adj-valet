#!/usr/bin/env bash

# ADJ Valet Application Runner
# This script manages the ADJ Valet application lifecycle

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="./backend"
FRONTEND_DIR="./adj-valet-front"
BACKEND_PORT=8000
FRONTEND_PORT=5173

# Process IDs
BACKEND_PID=""
FRONTEND_PID=""

# Print colored message
print_msg() {
    local color=$1
    local msg=$2
    echo -e "${color}${msg}${NC}"
}

# Check dependencies
check_dependencies() {
    print_msg $BLUE "🔍 Checking dependencies..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_msg $RED "❌ Python 3 is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_msg $RED "❌ Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_msg $RED "❌ npm is not installed"
        exit 1
    fi
    
    print_msg $GREEN "✅ All dependencies found"
}

# Install backend dependencies
install_backend_deps() {
    print_msg $BLUE "📦 Installing backend dependencies..."
    cd "$BACKEND_DIR"
    
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt --quiet
        print_msg $GREEN "✅ Backend dependencies installed"
    else
        print_msg $YELLOW "⚠️  No requirements.txt found in backend directory"
    fi
    
    cd - > /dev/null
}

# Install frontend dependencies
install_frontend_deps() {
    print_msg $BLUE "📦 Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_msg $GREEN "✅ Frontend dependencies installed"
    else
        print_msg $GREEN "✅ Frontend dependencies already installed"
    fi
    
    cd - > /dev/null
}

# Start backend service
start_backend() {
    print_msg $BLUE "🔧 Starting backend service..."
    cd "$BACKEND_DIR"
    
    # Check if uvicorn is installed
    if ! python3 -c "import uvicorn" 2>/dev/null; then
        print_msg $YELLOW "⚠️  Installing uvicorn..."
        pip install uvicorn fastapi
    fi
    
    # Start backend
    uvicorn api:app --reload --port $BACKEND_PORT --host 0.0.0.0 &
    BACKEND_PID=$!
    
    cd - > /dev/null
    
    # Wait for backend to start
    sleep 2
    
    # Check if backend is running
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_msg $GREEN "✅ Backend running on http://localhost:$BACKEND_PORT"
    else
        print_msg $RED "❌ Failed to start backend"
        exit 1
    fi
}

# Start frontend service
start_frontend() {
    print_msg $BLUE "🎨 Starting frontend service..."
    cd "$FRONTEND_DIR"
    
    npm run dev &
    FRONTEND_PID=$!
    
    cd - > /dev/null
    
    # Wait for frontend to start
    sleep 3
    
    # Check if frontend is running
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_msg $GREEN "✅ Frontend running on http://localhost:$FRONTEND_PORT"
    else
        print_msg $RED "❌ Failed to start frontend"
        cleanup
        exit 1
    fi
}

# Cleanup function
cleanup() {
    print_msg $YELLOW "\n🛑 Stopping services..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_msg $GREEN "✅ Backend stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_msg $GREEN "✅ Frontend stopped"
    fi
    
    exit 0
}

# Show usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start both frontend and backend (default)"
    echo "  backend   Start backend only"
    echo "  frontend  Start frontend only"
    echo "  install   Install all dependencies"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Start the full application"
    echo "  $0 backend      # Start only the backend"
    echo "  $0 install      # Install all dependencies"
}

# Main execution
main() {
    # Set up signal handlers
    trap cleanup INT TERM
    
    # Parse command
    COMMAND=${1:-start}
    
    case $COMMAND in
        start)
            print_msg $BLUE "🚀 Starting ADJ Valet Application"
            print_msg $BLUE "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            
            check_dependencies
            install_backend_deps
            install_frontend_deps
            start_backend
            start_frontend
            
            print_msg $GREEN "\n✨ ADJ Valet is running!"
            print_msg $BLUE "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            print_msg $YELLOW "Backend:  http://localhost:$BACKEND_PORT"
            print_msg $YELLOW "Frontend: http://localhost:$FRONTEND_PORT"
            print_msg $BLUE "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            print_msg $YELLOW "\nPress Ctrl+C to stop all services"
            
            # Wait for processes
            wait $BACKEND_PID $FRONTEND_PID
            ;;
            
        backend)
            print_msg $BLUE "🔧 Starting Backend Only"
            check_dependencies
            install_backend_deps
            start_backend
            print_msg $YELLOW "\nPress Ctrl+C to stop"
            wait $BACKEND_PID
            ;;
            
        frontend)
            print_msg $BLUE "🎨 Starting Frontend Only"
            check_dependencies
            install_frontend_deps
            start_frontend
            print_msg $YELLOW "\nPress Ctrl+C to stop"
            wait $FRONTEND_PID
            ;;
            
        install)
            print_msg $BLUE "📦 Installing Dependencies"
            check_dependencies
            install_backend_deps
            install_frontend_deps
            print_msg $GREEN "✅ All dependencies installed"
            ;;
            
        help|--help|-h)
            usage
            ;;
            
        *)
            print_msg $RED "❌ Unknown command: $COMMAND"
            echo ""
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"