#!/bin/bash

echo "Starting backend with detailed logging..."
cd backend
RUST_LOG=backend=debug,tower_http=debug cargo run -- --adj-path ../adj --port 8001 2>&1 | tee test_backend.log