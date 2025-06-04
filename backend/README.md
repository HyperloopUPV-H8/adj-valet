# ADJ Valet Backend - Rust Edition

A reliable, fast backend for ADJ Valet written in Rust. This replaces the Python backend with a more robust architecture designed for safety-critical systems.

## Features

- **Atomic Operations**: All board operations (rename, update) are atomic
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Memory Safety**: Rust's ownership system prevents runtime crashes
- **Performance**: Fast JSON processing and file I/O
- **Reliability**: Designed for Hyperloop control systems

## API Endpoints

### Health Check
```
GET /health
```
Returns "OK" if the server is running.

### Set ADJ Directory
```
POST /path
Content-Type: application/json

{
  "path": "/path/to/adj/directory"
}
```
Sets the ADJ directory path and loads the configuration.

### Get Configuration
```
GET /config
```
Returns the current ADJ configuration as JSON.

### Update Configuration
```
PUT /config
Content-Type: application/json

{
  "general_info": { ... },
  "boards": [ ... ],
  "board_list": { ... }
}
```
Updates the entire configuration atomically.

### Rename Board
```
POST /boards/{board_name}/rename
Content-Type: application/json

{
  "new_name": "NewBoardName"
}
```
Renames a board atomically, including directory and file renaming.

## Running

### Development
```bash
cd adj-valet-backend-rust
cargo run
```

### Production
```bash
cargo build --release
./target/release/adj-valet-backend --port 8000
```

### With ADJ Path
```bash
cargo run -- --adj-path /path/to/adj/directory
```

## Configuration Format

The backend maintains compatibility with the existing ADJ directory structure:

```
adj/
├── general_info.json           # General configuration
├── boards.json                 # Board ID to name mapping
└── boards/                     # Board-specific configurations
    ├── BoardName/
    │   ├── BoardName.json      # Main board config
    │   ├── BoardName_measurements.json
    │   ├── packets.json        # Data packets
    │   └── orders.json         # Order packets
    └── ...
```

## Key Improvements

1. **Single Source of Truth**: Configuration loaded once, kept in memory
2. **Atomic Updates**: All changes are transactional
3. **Robust Error Handling**: Graceful handling of missing/corrupt files
4. **Memory Efficiency**: Rust's zero-cost abstractions
5. **Type Safety**: Compile-time guarantees prevent runtime errors

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTTP Client   │◄──►│   Axum Router   │◄──►│  ADJ Directory  │
│  (React App)    │    │                 │    │   Structure     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  In-Memory      │
                       │  Configuration  │
                       │     (Cached)    │
                       └─────────────────┘
```

## Error Handling

All operations return proper HTTP status codes:

- `200 OK` - Successful operation
- `400 Bad Request` - Invalid request or no ADJ path set
- `404 Not Found` - Board or file not found
- `409 Conflict` - Board name already exists (on rename)
- `500 Internal Server Error` - File system or JSON errors

## Frontend Migration

To use this backend with the existing React frontend, update the API base URL and ensure the endpoints match. The response format is compatible with the existing frontend expectations.