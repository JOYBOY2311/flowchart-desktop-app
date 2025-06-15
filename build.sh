#!/bin/bash

echo "Building Software Development Lifecycle Flowchart..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if package.json exists
if [ ! -f package.json ]; then
    echo "Error: package.json not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

# Determine platform and build
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Building for macOS..."
    npm run build-mac
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Building for Linux..."
    npm run build-linux
else
    echo "Building for current platform..."
    npm run build
fi

if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

echo
echo "Build completed successfully!"
echo "Check the 'dist' folder for the executable."
