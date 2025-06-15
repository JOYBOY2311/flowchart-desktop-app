# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Prerequisites
- Install Node.js (v16+) from https://nodejs.org/
- Download and extract this project

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Application
```bash
# Development mode (with developer tools)
npm run dev

# Normal mode
npm start
```

### 4. Build Executable
```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

### 5. Use the Application
- Edit text by clicking on it
- Click boxes to add links or create sub-flows
- Toggle theme with the sun/moon button
- Use File menu to export/import data

## Alternative: Use Build Scripts
- **Windows**: Double-click `build-windows.bat`
- **macOS/Linux**: Run `./build.sh` in terminal

## Troubleshooting
- If npm install fails, try `npm install --legacy-peer-deps`
- If build fails, ensure all dependencies are installed
- Replace placeholder icons in `assets/icons/` with real icons for production builds

## What's Included
- Complete Electron application
- Cross-platform build configuration
- Professional UI with themes
- Local data storage
- Menu integration
- Auto-updater preparation
- Build scripts for easy deployment

Ready to customize? Edit the files in `src/` and rebuild!
