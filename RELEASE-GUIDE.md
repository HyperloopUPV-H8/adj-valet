# ADJ Valet - User Guide

## Download and Installation

### Step 1: Download
1. Go to the [Releases page](https://github.com/HyperloopUPV-H8/adj-valet/releases)
2. Download the appropriate version for your operating system:
   - **Windows (Intel/AMD)**: `adj-valet-x86_64-pc-windows-msvc.zip`
   - **Windows (ARM)**: `adj-valet-aarch64-pc-windows-msvc.zip`
   - **macOS (Intel)**: `adj-valet-x86_64-apple-darwin.tar.gz`
   - **macOS (Apple Silicon)**: `adj-valet-aarch64-apple-darwin.tar.gz`
   - **Linux**: `adj-valet-x86_64-unknown-linux-gnu.tar.gz`

### Step 2: Extract
- **Windows**: Right-click the ZIP file and select "Extract All"
- **macOS/Linux**: Double-click the archive or use `tar -xzf filename.tar.gz`

### Step 3: Run
- **Windows**: Double-click `start.bat` or run `adj-valet-backend.exe`
- **macOS/Linux**: Double-click `start.sh` or run `./adj-valet-backend`

## Quick Start

1. **Start the application**
   - Run the startup script for your platform
   - The backend will start on port 8000
   - Your web browser should automatically open

2. **Set your ADJ directory**
   - Enter the path to your ADJ configuration directory
   - Click "Load Configuration"

3. **Edit your configuration**
   - Use the sidebar to navigate between sections
   - Edit boards, packets, and measurements as needed
   - Changes are saved automatically

## Features

### General Information
- Configure system-wide settings like ports, addresses, and units
- Manage message IDs and global parameters

### Board Management
- Add, edit, and remove board configurations
- Set board IDs, IP addresses, and associated components
- Manage board-specific measurements and packets

### Packet Configuration
- Define network packet structures
- Configure packet types (data, orders)
- Assign variables to packets

### Measurement Setup
- Configure measurement parameters
- Set data types, units, and safety thresholds
- Define enumeration values for discrete measurements

## File Structure

ADJ Valet works with the following directory structure:

```
your-adj-directory/
├── general_info.json         # System-wide configuration
├── boards.json              # Board list and mappings
└── boards/                  # Board-specific configurations
    ├── BoardName/
    │   ├── BoardName.json           # Main board config
    │   ├── BoardName_measurements.json  # Measurements
    │   ├── packets.json             # Data packets
    │   └── orders.json              # Order packets
    └── ...
```

## Troubleshooting

### Common Issues

**"Cannot connect to backend"**
- Ensure no other application is using port 8000
- Try closing and restarting the application
- Check your firewall settings

**"Directory not found"**
- Verify the ADJ directory path exists
- Ensure you have read/write permissions
- Check that the directory contains valid JSON files

**"Configuration failed to load"**
- Verify JSON files are properly formatted
- Check that all referenced files exist
- Look for syntax errors in configuration files

### Getting Help

- Check the [GitHub Issues](https://github.com/HyperloopUPV-H8/adj-valet/issues) page
- Review the ADJ specification document (ADJ-SPEC.md)
- Contact the Hyperloop UPV team

## System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Memory**: 512 MB RAM minimum
- **Storage**: 100 MB free space
- **Network**: Port 8000 available for backend service

## Security Notes

- ADJ Valet runs locally on your machine
- No data is transmitted over the internet
- Configuration files are stored locally in your specified directory
- Always backup your ADJ configurations before making major changes