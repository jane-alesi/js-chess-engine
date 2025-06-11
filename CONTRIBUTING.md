# Contributing to JS Chess Engine

Thank you for your interest in contributing to the JS Chess Engine! This project welcomes contributions from both human developers and AI agents. We follow an **Issue-Driven Development** approach where all work is tracked through GitHub Issues.

## 🎯 Development Philosophy

### Core Principles

- **Issue-Driven Development** - All work must be tracked through GitHub Issues
- **Modular Architecture** - Maintain clean separation between core, UI, AI, and utility components
- **AI-First Design** - Code should be optimized for both human and AI agent collaboration
- **Quality First** - Comprehensive testing and code quality standards are non-negotiable

### Project Goals

- Create a pure JavaScript chess engine that surpasses the original Atari Video Chess
- Implement advanced AI algorithms (Minimax with Alpha-Beta pruning)
- Maintain modern JavaScript standards (ES2022) with comprehensive testing
- Enable seamless collaboration between human developers and AI agents

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** (comes with Node.js)
- **Git** for version control
- **Modern web browser** for testing

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/js-chess-engine.git
    cd js-chess-engine
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Verify setup**:
    ```bash
    npm run quality:check
    npm test
    ```

## 📋 Issue-Driven Workflow

### Finding Work

1. **Browse [Open Issues](https://github.com/jane-alesi/js-chess-engine/issues)** to find tasks
2. **Look for labels**:
    - `good first issue` - Perfect for new contributors
    - `documentation` - Documentation improvements
    - `enhancement` - New features
    - `bug` - Bug fixes
    - `core` - Chess logic implementation
    - `ai` - AI engine development

### Issue Assignment

- **Comment on the issue** to express interest
- **Wait for assignment** from maintainers (especially for larger features)
- **Self-assign** for `good first issue` labeled tasks

### Development Process

1. **Create a feature branch**:

    ```bash
    git checkout -b feature/issue-XX-description
    ```

2. **Follow the acceptance criteria** outlined in the issue

3. **Implement following coding standards** (see below)

4. **Test your changes**:

    ```bash
    npm test
    npm run quality:check
    ```

5. **Commit with descriptive messages**:

    ```bash
    git commit -m "✨ Implement feature X (Issue #XX)

    - Add specific functionality
    - Include comprehensive tests
    - Update documentation"
    ```

## 🛠️ Technical Standards

### JavaScript/ES2022 Requirements

- **ES2022 Features**: Use modern JavaScript including private class fields (`#field`)
- **ES Modules**: Use `import`/`export` with `.js` extensions
- **Type Safety**: Comprehensive input validation with descriptive error messages
- **Error Handling**: Use exceptions, not console output for errors

#### Code Example

```javascript
class ChessEngine {
    // Private fields for encapsulation
    #gameState;
    #currentPlayer = 'white';

    constructor() {
        this.#gameState = new GameState();
    }

    // Public getter methods for private fields
    getCurrentPlayer() {
        return this.#currentPlayer;
    }

    // Comprehensive input validation
    makeMove(fromIndex, toIndex) {
        if (typeof fromIndex !== 'number' || fromIndex < 0 || fromIndex >= 64) {
            throw new Error(`Invalid move: fromIndex ${fromIndex} must be 0-63`);
        }
        // Implementation...
    }
}
```

### Testing Requirements

- **Jest Framework** with ES module support
- **100% Test Coverage** for new features
- **Test Compatibility** - Use getter methods for private fields in tests
- **Error Path Testing** - Test all error conditions

#### Test Example

```javascript
// ✅ CORRECT: Use getter methods
expect(piece.getType()).toBe('pawn');

// ❌ INCORRECT: Direct property access
expect(piece.type).toBe('pawn');
```

### Code Quality Standards

#### Automated Quality Checks

The project includes automated code quality workflows:

```bash
# Check code quality
npm run quality:check      # Check formatting and linting
npm run lint:check         # ESLint with zero warnings
npm run format:check       # Prettier formatting check

# Fix code quality issues
npm run quality:fix        # Auto-fix formatting and linting
npm run lint:fix           # Fix ESLint issues
npm run format             # Apply Prettier formatting
```

#### Quality Gates

All contributions must pass:

1. **ESLint** - No errors or warnings
2. **Prettier** - Consistent code formatting
3. **Jest Tests** - 100% test success rate
4. **Security Audit** - No known vulnerabilities

### Architecture Guidelines

#### Module Structure

```
src/
├── core/          # Chess logic (Board, Piece, GameState, MoveGenerator)
├── ui/            # User interface (BoardRenderer, InputHandler, styles)
├── ai/            # AI engine (Evaluation, Search, OpeningBook)
└── utils/         # Utilities (Constants, FEN, PGN, Notation)
```

#### Design Principles

- **Single Responsibility** - Each class/module has one clear purpose
- **Dependency Injection** - Avoid tight coupling between modules
- **Immutable State** - Game states should be immutable for AI search
- **Performance** - Optimize for move generation and AI search speed

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure issue exists** - All PRs must reference a GitHub issue
2. **Follow acceptance criteria** - Address all requirements in the issue
3. **Update tests** - Add/modify tests for your changes
4. **Run quality checks**:
    ```bash
    npm test
    npm run quality:check
    npm run security-check
    ```

### PR Requirements

#### Title Format

```
✨ Brief description (Issue #XX)
```

#### Description Template

```markdown
## Issue Reference

Fixes #XX

## Changes Made

- Specific change 1
- Specific change 2
- Specific change 3

## Testing

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Quality Checks

- [ ] `npm run quality:check` passes
- [ ] `npm test` passes
- [ ] `npm run security-check` passes

## Documentation

- [ ] Code comments added where necessary
- [ ] README updated if needed
- [ ] Breaking changes documented
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs quality checks
2. **Code Review** - Maintainer review for code quality and architecture
3. **Testing** - Verify functionality and test coverage
4. **Approval** - Maintainer approval required for merge

## 🤖 AI Agent Guidelines

### For AI Agents (LLMs)

This project is designed for AI agent collaboration. See [`llms.txt`](llms.txt) for comprehensive AI development guidelines.

#### Key Points for AI Agents

- **Follow Issue-Driven Development** - Always work from GitHub issues
- **Use Modern JavaScript** - ES2022 features and best practices
- **Comprehensive Testing** - Include tests with all implementations
- **Quality Automation** - Let automated workflows handle minor formatting issues
- **Verification-First** - Validate all information and implementations

#### AI-Specific Workflow

1. **Read issue carefully** - Understand requirements and acceptance criteria
2. **Check dependencies** - Ensure prerequisite issues are complete
3. **Reference existing files** - Follow established patterns and conventions
4. **Implement with tests** - Include comprehensive test coverage
5. **Document changes** - Clear commit messages and code comments

## 🔒 Security Guidelines

### Security Best Practices

- **Dependency Management** - Keep dependencies updated and secure
- **Input Validation** - Validate all user inputs and API parameters
- **Error Handling** - Don't expose sensitive information in error messages
- **Code Review** - All code must be reviewed before merging

### Security Checks

```bash
npm run security-check      # Check for vulnerabilities
npm run security-fix        # Fix known vulnerabilities
```

## 📚 Resources

### Documentation

- **[llms.txt](llms.txt)** - Comprehensive AI agent development guide
- **[Chess Programming Wiki](https://www.chessprogramming.org/)** - Chess algorithm reference
- **[MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - JavaScript documentation

### Project References

- **Issue Templates** - Use GitHub issue templates for consistency
- **Code Examples** - Reference existing implementations for patterns
- **Test Examples** - Follow existing test patterns for new tests

## 🎯 Contribution Areas

### High Priority

1. **Core Chess Logic** - Move generation for remaining pieces (Rook, Bishop, Knight, King, Queen)
2. **Game Rules** - Advanced rules (castling, en passant, promotion)
3. **AI Implementation** - Minimax search with Alpha-Beta pruning
4. **Testing** - Comprehensive test coverage for all components

### Medium Priority

1. **UI Enhancements** - Interactive board, move highlighting, animations
2. **Performance** - Optimization for move generation and AI search
3. **Documentation** - Code documentation and user guides
4. **Accessibility** - Keyboard navigation and screen reader support

### Future Enhancements

1. **Advanced AI** - Opening books, endgame tables, neural networks
2. **Multiplayer** - Network play and tournament modes
3. **Analysis Tools** - Position analysis and game review
4. **Mobile Support** - Touch interface and responsive design

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - Primary communication for development
- **GitHub Discussions** - General questions and ideas
- **Code Comments** - Inline documentation and clarification

### Common Questions

**Q: How do I test private fields in classes?**
A: Use public getter methods in tests: `expect(piece.getType()).toBe('pawn')`

**Q: What if my PR fails automated checks?**
A: The auto-fix workflow will handle minor formatting issues. For other failures, check the CI logs and fix the issues.

**Q: Can I work on multiple issues simultaneously?**
A: Focus on one issue at a time to maintain quality and avoid conflicts.

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Thank you for contributing to the JS Chess Engine!** Together, we're building a chess engine that honors the past while pushing the boundaries of modern web-based chess.

_For AI agents: This project embraces AI collaboration - your contributions are valued and essential to achieving our ambitious goals._
