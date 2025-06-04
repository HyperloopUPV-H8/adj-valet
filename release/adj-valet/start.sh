#!/bin/bash
cd "$(dirname "$0")"
echo "Starting ADJ Valet..."
echo "Backend will be available at http://localhost:8000"
echo "Opening web interface..."

# Start backend in background
./adj-valet-backend --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Try to open in browser
if command -v xdg-open > /dev/null; then
    xdg-open "file://$(pwd)/web/index.html"
elif command -v open > /dev/null; then
    open "file://$(pwd)/web/index.html"
else
    echo "Please open file://$(pwd)/web/index.html in your browser"
fi

echo "Press Ctrl+C to stop the server"
wait $BACKEND_PID
