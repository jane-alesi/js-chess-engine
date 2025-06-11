# ♛ JS Chess Engine

> **A pure JavaScript chess engine inspired by the legendary Atari Video Chess, designed to outplay the original through superior AI and modern web technologies.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chess Engine](https://img.shields.io/badge/Chess-Engine-green.svg)](https://www.chessprogramming.org/)

---

## 🎯 Project Description

### The Vision

In 1979, Atari released Video Chess for the Atari 2600 - a groundbreaking achievement that brought chess to home consoles in just 4KB of ROM. This project pays homage to that pioneering spirit while leveraging modern JavaScript capabilities to create a chess engine that can outthink and outplay its legendary predecessor.

### What Problem Does This Solve?

**For Chess Enthusiasts:**

- Provides a pure JavaScript chess implementation that runs entirely in the browser
- Offers an AI opponent with adjustable difficulty levels
- Enables chess learning through position analysis and move suggestions

**For Developers:**

- Demonstrates advanced JavaScript patterns including ES2022 private fields
- Showcases modular architecture with clean separation of concerns
- Provides a comprehensive testing framework for complex game logic

**For AI Researchers:**

- Implements classic game AI algorithms (Minimax with Alpha-Beta pruning)
- Offers a platform for experimenting with chess evaluation functions
- Enables comparison with historical chess engines

### The Technology

Built with modern JavaScript (ES2022), this engine features:

- **Pure JavaScript Implementation** - No external chess libraries, everything built from scratch
- **Modular Architecture** - Clean separation between core logic, UI, and AI components
- **Advanced AI Engine** - Minimax search with Alpha-Beta pruning for intelligent gameplay
- **Comprehensive Testing** - Full test coverage ensuring reliable chess rule implementation
- **Browser-Native** - Runs entirely in modern web browsers without server dependencies

### The Challenge

Can a modern JavaScript implementation, with access to decades of chess programming knowledge and unlimited memory, create an engine that surpasses the original Atari Video Chess? This project aims to prove that with careful design and modern algorithms, we can honor the past while pushing the boundaries of what's possible in browser-based chess.

---

## 🚀 Current Status

This project is actively under development with a focus on:

✅ **Core Foundation Complete**

- Board representation and piece management
- Move generation for pawns (with comprehensive testing)
- Game state tracking and validation
- Modern ES2022 implementation with private fields

🔄 **In Progress**

- Move generation for all remaining pieces (Rook, Bishop, Knight, King, Queen)
- Advanced game rules (castling, en passant, promotion)
- Check and checkmate detection

🎯 **Coming Next**

- AI opponent with multiple difficulty levels
- Position evaluation and strategic play
- Interactive web interface
- Performance optimizations

---

## 🏗️ Architecture

The engine follows a modular design inspired by classic chess programming principles:

```
src/
├── core/          # Chess logic foundation
├── ui/            # User interface components
├── ai/            # Artificial intelligence engine
└── utils/         # Shared utilities and constants
```

Each module is designed for independence, testability, and future enhancement.

---

## 🎮 The Atari Video Chess Legacy

This project draws inspiration from one of the most impressive programming achievements in gaming history. The original Atari Video Chess, programmed by Larry Wagner and Bob Whitehead, managed to implement a playable chess game in just 4KB of ROM - a constraint that forced elegant solutions and creative optimizations.

Our JavaScript implementation honors this legacy while embracing modern capabilities:

- **Then**: 4KB ROM, 128 bytes RAM → **Now**: Unlimited memory and processing power
- **Then**: 6502 assembly language → **Now**: Modern JavaScript with advanced language features
- **Then**: Simple evaluation function → **Now**: Sophisticated AI with deep search algorithms
- **Then**: Fixed difficulty → **Now**: Adaptive AI with multiple skill levels

---

## 🤝 Contributing

This project uses an **Issue-Driven Development** approach where all work is tracked through GitHub Issues. Whether you're an AI agent or human developer, contributions are welcome!

For detailed development guidelines, see [`llms.txt`](llms.txt) in the repository root.

### Quick Start for Contributors

1. Browse [open issues](https://github.com/jane-alesi/js-chess-engine/issues) to find tasks
2. Fork the repository and create a feature branch
3. Follow the coding standards outlined in the project documentation
4. Submit a pull request with clear description and issue reference

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 🌟 Acknowledgments

- **Atari Video Chess** - The legendary inspiration for this project
- **Chess Programming Community** - For decades of shared knowledge and algorithms
- **satware® AI** - Advanced AI development and the Alesi AGI ecosystem

---

**Project Link:** [https://github.com/jane-alesi/js-chess-engine](https://github.com/jane-alesi/js-chess-engine)

_Built with ♛ by the chess programming community_
