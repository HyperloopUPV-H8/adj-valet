{ pkgs ? import <nixpkgs> {} }:

let
  # Python environment with required packages
  pythonEnv = pkgs.python3.withPackages (ps: with ps; [
    fastapi
    uvicorn
    # Add any additional Python packages from requirements.txt here
  ]);

  # Node.js environment
  nodeEnv = pkgs.nodejs_20; # Use specific Node.js version for consistency

  # Shell scripts for running the application
  runBackend = pkgs.writeShellScriptBin "adj-backend" ''
    echo "🚀 Starting ADJ Valet Rust Backend..."
    cd ${toString ./.}/backend
    cargo run -- --port 8000
  '';

  runFrontend = pkgs.writeShellScriptBin "adj-frontend" ''
    echo "🚀 Starting ADJ Valet Frontend..."
    cd ${toString ./.}/adj-valet-front
    
    # Check if node_modules exists, install if not
    if [ ! -d "node_modules" ]; then
      echo "📦 Installing frontend dependencies..."
      npm install
    fi
    
    npm run dev
  '';

  runAll = pkgs.writeShellScriptBin "adj-valet" ''
    echo "🚀 Starting ADJ Valet Application..."
    echo "Press Ctrl+C to stop all services"
    
    # Function to cleanup on exit
    cleanup() {
      echo -e "\n🛑 Stopping all services..."
      kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
      exit 0
    }
    
    # Set up trap for cleanup
    trap cleanup INT TERM
    
    # Start backend
    echo "🔧 Starting backend service..."
    adj-backend &
    BACKEND_PID=$!
    
    # Wait a bit for backend to start
    sleep 2
    
    # Start frontend
    echo "🎨 Starting frontend service..."
    adj-frontend &
    FRONTEND_PID=$!
    
    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
  '';

  # Development utilities
  formatPython = pkgs.writeShellScriptBin "format-python" ''
    echo "🔧 Formatting Python code..."
    ${pkgs.black}/bin/black ${toString ./.}/backend
  '';

  lintPython = pkgs.writeShellScriptBin "lint-python" ''
    echo "🔍 Linting Python code..."
    ${pkgs.python3Packages.pylint}/bin/pylint ${toString ./.}/backend
  '';

in
pkgs.mkShell {
  name = "adj-valet-dev";
  
  buildInputs = with pkgs; [
    # Core development tools
    pythonEnv
    nodeEnv
    
    # Shell scripts
    runBackend
    runFrontend
    runAll
    formatPython
    lintPython
    
    # Additional development tools
    git
    curl
    jq
    ripgrep
    
    # Python development tools
    python3Packages.black
    python3Packages.pylint
    python3Packages.mypy
    
    # Node.js tools
    nodePackages.npm
    nodePackages.typescript
    nodePackages.eslint
  ];

  # Environment variables
  PYTHONPATH = "${toString ./.}/backend";
  
  # Shell hook for initialization
  shellHook = ''
    echo "╭─────────────────────────────────────────╮"
    echo "│      🚀 ADJ Valet Development Shell     │"
    echo "╰─────────────────────────────────────────╯"
    echo ""
    echo "Available commands:"
    echo "  • adj-valet      - Run both frontend and backend"
    echo "  • adj-backend    - Run backend only"
    echo "  • adj-frontend   - Run frontend only"
    echo "  • format-python  - Format Python code with Black"
    echo "  • lint-python    - Lint Python code with Pylint"
    echo ""
    echo "Backend: http://localhost:8000"
    echo "Frontend: http://localhost:5173"
    echo ""
    
    # Create .env file if it doesn't exist
    if [ ! -f "${toString ./.}/.env" ]; then
      echo "Creating .env file with default values..."
      cat > "${toString ./.}/.env" << EOF
# ADJ Valet Environment Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_PORT=5173
EOF
    fi
  '';
}