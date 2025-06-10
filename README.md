# JS Chess Engine 🏁♟️

> A pure JavaScript chess engine inspired by the legendary Atari Video Chess program

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Issues](https://img.shields.io/github/issues/jane-alesi/js-chess-engine)](https://github.com/jane-alesi/js-chess-engine/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🎯 Project Overview

This project implements a complete chess game in pure JavaScript, drawing inspiration from the remarkable Atari Video Chess program that fit a full chess engine into just 4KB of ROM. Our modern implementation combines the efficiency principles of the original with contemporary web development practices.

### ✨ Features

- 🎮 **Complete Chess Implementation**: All standard chess rules including castling, en passant, and pawn promotion
- 🤖 **AI Opponent**: Minimax algorithm with alpha-beta pruning inspired by Video Chess
- 🎨 **Modern Web UI**: Responsive design with multiple themes
- 📱 **Cross-Platform**: Works on desktop and mobile browsers
- 🧪 **Thoroughly Tested**: Comprehensive test suite for all components
- 📚 **Educational**: Well-documented code for learning chess programming

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (for development tools)
- Modern web browser with ES6+ support

### Installation

```bash
# Clone the repository
git clone https://github.com/jane-alesi/js-chess-engine.git
cd js-chess-engine

# Install dependencies
npm install

# Start development server
npm start
```

The game will open in your browser at `http://localhost:3000`

### Playing the Game

1. **Select a Piece**: Click on any of your pieces to see available moves
2. **Make a Move**: Click on a highlighted square to move your piece
3. **AI Opponent**: The computer will automatically respond with its move
4. **Game Controls**: Use the buttons to start a new game or change settings

## 🏗️ Architecture

The project follows a modular, divide-and-conquer architecture:

```
src/
├── core/           # Core game logic
│   ├── Board.js    # Board representation
│   ├── Piece.js    # Piece definitions
│   └── Rules.js    # Chess rules
├── ui/             # User interface
│   ├── Renderer.js # Board rendering
│   └── Input.js    # User input
├── ai/             # AI opponent
│   ├── Search.js   # Minimax algorithm
│   └── Eval.js     # Position evaluation
└── utils/          # Utilities
    ├── Notation.js # Algebraic notation
    └── FEN.js      # FEN support
```

## 🤝 Contributing

We use **Issue-driven Development** to organize work. Each feature and bug fix starts with a GitHub issue.

### For AI Agents and Developers

1. **Read the [llms.txt](llms.txt)** - Complete guide for AI agents working on this project
2. **Check [Issues](https://github.com/jane-alesi/js-chess-engine/issues)** - Find tasks to work on
3. **Follow the Workflow**:
   - Create a feature branch
   - Implement the solution
   - Add/update tests
   - Submit a pull request

### Development Commands

```bash
npm test           # Run test suite
npm run test:watch # Run tests in watch mode
npm run lint       # Check code style
npm run format     # Format code
npm run build      # Build production version
```

## 🧪 Testing

The project includes comprehensive tests:

- **Unit Tests**: Core game logic and AI components
- **Integration Tests**: Complete game scenarios
- **Performance Tests**: AI search algorithm benchmarks

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm test -- --coverage     # Generate coverage report
```

## 🎨 Customization

### Themes

The game supports multiple visual themes. Add new themes in `src/ui/Themes.js`:

```javascript
export const themes = {
  classic: {
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    // ... more colors
  },
  modern: {
    // Your custom theme
  }
};
```

### AI Difficulty

Adjust AI strength by modifying search depth in `src/ai/AIPlayer.js`:

```javascript
const difficulty = {
  easy: { depth: 2 },
  medium: { depth: 4 },
  hard: { depth: 6 }
};
```

## 📖 Learning Resources

### Chess Programming

- [Chess Programming Wiki](https://www.chessprogramming.org/) - Comprehensive chess programming resource
- [Video Chess Analysis](https://nanochess.org/video_chess.html) - Analysis of the original Atari program
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax) - Core AI search algorithm

### JavaScript Game Development

- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - For advanced graphics
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) - For background AI computation
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) - Modern JavaScript modules

## 🏆 Inspiration: Atari Video Chess

This project pays homage to the 1979 Atari Video Chess program, which achieved the remarkable feat of implementing a complete chess game with AI in just 4KB of ROM. Key innovations we've adapted:

- **Efficient Board Representation**: Compact data structures
- **Smart Search Algorithm**: Alpha-beta pruning with quiescence search
- **Evaluation Function**: Material and positional considerations
- **Memory Optimization**: Careful resource management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Oscar Toledo G.** - For his detailed analysis of the original Video Chess program
- **Atari Inc.** - For creating the original Video Chess that inspired this project
- **Chess Programming Community** - For decades of shared knowledge and algorithms

## 📞 Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/jane-alesi/js-chess-engine/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Create an issue](https://github.com/jane-alesi/js-chess-engine/issues/new?template=feature_request.md)
- 💬 **Questions**: [Discussions](https://github.com/jane-alesi/js-chess-engine/discussions)

---

**Built with ❤️ by the satware® AI Team**

*"In chess, as in software development, every move matters."*