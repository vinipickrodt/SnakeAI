# 🐍 Snake AI Game

A modern implementation of the classic Snake game built with vanilla JavaScript, featuring bilingual support, progressive difficulty, and smooth gameplay mechanics.

**🎮 Play Now:** [https://vinipickrodt.github.io/SnakeAI/](https://vinipickrodt.github.io/SnakeAI/)

## 🛠️ Built With

- **VS Code + GitHub Copilot** - Development environment and AI assistance
- **Vanilla JavaScript** - Game logic and mechanics
- **HTML5 Canvas** - Game rendering
- **CSS3** - Modern UI styling with custom fonts
- **GitHub Pages** - Hosting platform

## 🎯 How to Play

### Basic Controls
- **Arrow Keys** (`↑` `↓` `←` `→`) or **WASD** - Move the snake
- **P** - Pause/Resume the game
- **Click Restart** - Start a new game after game over

### Game Rules
1. **Objective**: Eat as many red food items as possible to win.
2. **Avoid**: Hitting the walls or your own body
3. **Progression**: Each 10 points advances you to the next level with increased speed
4. **Scoring**: Each food item gives you 1 point

### Getting Started
1. Open the game in your browser
2. Press any directional key to start
3. Navigate your snake to eat the red food
4. Try to achieve the highest score possible!

## ✨ Features

### 🌍 **Bilingual Support**
- **Portuguese (pt-BR)** and **English (en-US)** interface
- Language preference saved locally
- Easy language switching with flag buttons

### 🎮 **Progressive Difficulty**
- **10 Levels** with increasing speed
- Visual level-up animations with "Level X - Go!" display
- Dynamic speed adjustment (starts at 100ms, decreases by 8ms per level)

### 🎨 **Modern UI/UX**
- **Orbitron** and **Rajdhani** Google Fonts for a futuristic look
- Smooth animations and transitions
- Responsive design elements
- Clean, minimalist interface

### 🕹️ **Enhanced Gameplay**
- **Smooth controls** with direction queuing system
- **Anti-spam protection** for key inputs
- **Pause/Resume** functionality
- **Immediate restart** option after game over
- **Start screen** with instructions

### 🔧 **Technical Features**
- **Local Storage** for language preferences
- **Error handling** and fallback mechanisms
- **Performance optimized** game loop
- **Collision detection** for walls and self-collision
- **Responsive canvas** rendering

## 🚀 Version Management

This project includes an automated version control system:

### Current Version: v1.2.0

- **Automatic versioning** on git push
- **Visual version display** in the game
- **Semantic versioning** (Major.Minor.Patch)
- **Automated file updates** for `package.json` and `index.html`

### Version History & Bug Fixes

#### v1.2.0 - Current
- ✅ **Language System**: Complete bilingual support (PT/EN)
- ✅ **Level Progression**: 10 levels with visual feedback
- ✅ **Enhanced Controls**: WASD + Arrow keys support
- ✅ **Pause System**: P key to pause/resume
- ✅ **Local Storage**: Language preference persistence
- ✅ **UI Improvements**: Modern fonts and responsive design
- ✅ **Bug Fix**: Resolved level element detection issues
- ✅ **Bug Fix**: Fixed direction queue spam protection
- ✅ **Bug Fix**: Improved game state management

#### Previous Versions
- **v1.1.x**: Basic game mechanics and canvas rendering
- **v1.0.x**: Initial Snake game implementation

### Known Issues & Planned Features
- 🔄 **AI Mode**: Planned auto-play feature (hence "Snake AI" name)
- 🔄 **High Score System**: Persistent leaderboard
- 🔄 **Sound Effects**: Audio feedback for actions
- 🔄 **Mobile Controls**: Touch/swipe support for mobile devices

## 🏗️ Project Structure

```
SnakeAI/
├── index.html              # Main game page
├── script.js               # Game logic and mechanics
├── style.css               # Game styling
├── package.json            # Project configuration
├── VERSION-README.md       # Version system documentation
├── scripts/
│   └── increment-version.js # Automated versioning script
├── version-manager.bat     # Windows version management
├── install-hooks.bat       # Git hooks installer
└── demo-version.bat        # Version demo script
```

## 🚀 Quick Start

### Playing the Game
1. Visit [https://vinipickrodt.github.io/SnakeAI/](https://vinipickrodt.github.io/SnakeAI/)
2. Choose your language (BR/US flags)
3. Press any arrow key or WASD to start
4. Enjoy the game!

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/vinipickrodt/SnakeAI.git
   cd SnakeAI
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have live-server)
   npx live-server
   ```

3. Start developing! The version system will automatically handle versioning on git push.

## 🎯 Game Stats

- **Grid Size**: 20x20 tiles
- **Canvas Size**: 400x400 pixels
- **Starting Speed**: 100ms per frame
- **Max Levels**: 10
- **Speed Increase**: 8ms faster per level
- **Languages Supported**: 2 (Portuguese, English)

## 🤝 Contributing

This project was developed with the assistance of **GitHub Copilot** for AI-powered code completion and suggestions. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub Copilot** for AI-assisted development
- **VS Code** for the excellent development environment
- **Google Fonts** for the typography (Orbitron & Rajdhani)
- **Lipis Flag Icons** for the country flags
- Classic Snake game for the inspiration

---

**Made with ❤️ using VS Code + GitHub Copilot**

*Enjoy the game and try to beat your high score! 🏆*
