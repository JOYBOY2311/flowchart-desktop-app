# Software Development Lifecycle Flowchart - Desktop Application

A professional Electron-based desktop application for managing and visualizing software development lifecycle workflows.

## Features

- **Interactive Flowchart**: Visual representation of software development phases
- **Sub-flows**: Create detailed sub-processes for each main phase
- **External Links**: Attach URLs or local files to flowchart elements
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Local Storage**: All data stored locally using Electron Store
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Professional UI**: Native desktop application feel with custom menus
- **Auto-Updates**: Built-in update mechanism (when configured)

## Installation

### Option 1: Download Pre-built Executable (Recommended)
1. Download the latest release from the releases page
2. Run the installer (Windows) or drag to Applications (macOS)
3. Launch the application

### Option 2: Build from Source

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

#### Clone and Install
```bash
git clone <repository-url>
cd flowchart-desktop-app
npm install
```

#### Development
```bash
# Run in development mode
npm run dev

# Run normally
npm start
```

#### Building Executables

##### Windows
```bash
# Build Windows executable and installer
npm run build-win
```

##### macOS
```bash
# Build macOS application
npm run build-mac
```

##### Linux
```bash
# Build Linux AppImage
npm run build-linux
```

##### All Platforms
```bash
# Build for all platforms (requires platform-specific tools)
npm run build
```

## Project Structure

```
flowchart-desktop-app/
├── src/
│   ├── main.js          # Main Electron process
│   ├── preload.js       # Security bridge
│   ├── renderer.html    # Main UI
│   └── renderer.js      # UI logic
├── assets/
│   ├── icons/           # Application icons
│   └── entitlements.mac.plist
├── package.json         # Dependencies and build config
├── README.md           # This file
└── dist/               # Built applications (after build)
```

## Usage

### Basic Operation
1. **Creating Flowcharts**: The application starts with a default software development lifecycle flowchart
2. **Editing**: Click on any text to edit it inline
3. **Adding Links**: Click on a flowchart box and choose "Add/Edit Link" to attach URLs or local files
4. **Sub-flows**: Click on a box and choose "Create/View Sub-flow" to create detailed process steps
5. **Themes**: Use the theme toggle button to switch between light and dark modes

### Menu Options
- **File Menu**:
  - New Project: Reset to default flowchart
  - Export Data: Save flowchart data to JSON file
  - Import Data: Load flowchart data from JSON file
  - Quit: Exit application

- **Edit Menu**: Standard edit operations (undo, redo, copy, paste)
- **View Menu**: Zoom controls, toggle fullscreen, developer tools
- **Help Menu**: About dialog, check for updates

### Data Storage
All flowchart data is automatically saved locally using Electron Store:
- **Windows**: `%APPDATA%\software-lifecycle-flowchart\config.json`
- **macOS**: `~/Library/Preferences/software-lifecycle-flowchart/config.json`
- **Linux**: `~/.config/software-lifecycle-flowchart/config.json`

## Development

### Architecture
- **Main Process** (`main.js`): Handles window management, menus, and system integration
- **Renderer Process** (`renderer.html`, `renderer.js`): UI and application logic
- **Preload Script** (`preload.js`): Secure communication bridge between processes

### Key Technologies
- **Electron**: Desktop application framework
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Electron Store**: Simple data persistence
- **Electron Builder**: Application packaging and distribution

### Security
The application follows Electron security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC communication via preload script
- External links opened in system browser

## Building and Distribution

### Automatic Building
```bash
# Install dependencies
npm install

# Build for current platform
npm run build

# Build for specific platform
npm run build-win    # Windows
npm run build-mac    # macOS  
npm run build-linux  # Linux
```

### Manual Building
```bash
# Create distributable packages
npm run dist

# Create portable version (no installer)
npm run pack
```

### Build Outputs
- **Windows**: `.exe` installer and portable `.exe`
- **macOS**: `.dmg` installer and `.app` bundle
- **Linux**: `.AppImage` portable application

## Customization

### Icons
Replace the placeholder icon files in `assets/icons/` with your own:
- `icon.png` - 256x256 PNG for Linux
- `icon.ico` - Multi-size ICO for Windows
- `icon.icns` - Multi-size ICNS for macOS

### Application Details
Edit `package.json` to customize:
- Application name and description
- Author and homepage
- Version number
- Build settings

### Themes and Styling
Modify `renderer.html` CSS variables to customize themes:
- Colors
- Fonts
- Spacing
- Animations

## Troubleshooting

### Common Issues

1. **Build fails on Windows**: Ensure you have Windows Build Tools installed
2. **Application won't start**: Check console for errors, ensure all dependencies are installed
3. **Icons not showing**: Verify icon files are in correct format and location
4. **Auto-updater not working**: Configure update server in `main.js`

### Development Mode
```bash
# Run with developer tools open
npm run dev
```

### Debugging
- Use Electron DevTools (Ctrl+Shift+I / Cmd+Option+I)
- Check main process logs in terminal
- Enable verbose logging in development mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Note**: This application requires proper icon files to build successfully. Replace the placeholder icon files in `assets/icons/` with actual icon files in the appropriate formats before building for distribution.
