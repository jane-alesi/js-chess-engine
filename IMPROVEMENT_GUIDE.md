# Project Documentation and Workflow Improvement Guide

This guide provides step-by-step instructions to implement the documentation and project management improvements tracked in issues #35 through #40.

## Phase 1: README.md Enhancement

### **Issue #35: Create Professional README.md with Header and Description**

1.  **Create the `README.md` file** in the root of the `js-chess-engine` repository.
2.  **Add the following content** to create the header and description:

    ```markdown
    # ♟️ JS Chess Engine

    > A pure JavaScript chess engine inspired by Atari Video Chess, designed for modern browsers and AI integration.

    ## Description

    This project is a complete, modern JavaScript chess engine built from the ground up. It honors the efficient, minimalist design of the original Atari Video Chess for the Atari 2600 while leveraging modern JavaScript features like ES2022. The primary goal is to create a robust, performant engine that can be used for browser-based chess games and serve as a platform for developing and testing chess AI.
    ```

### **Issue #36: Add Installation and Usage Sections**

1.  **Append the following sections** to your `README.md` file:

    ````markdown
    ## 🚀 Getting Started

    ### Prerequisites

    Ensure you have Node.js installed on your system.

    - **Node.js** (v18.x or higher recommended)

    ### Installation

    1.  Clone the repository to your local machine:
        ```bash
        git clone https://github.com/jane-alesi/js-chess-engine.git
        ```
    2.  Navigate to the project directory:
        ```bash
        cd js-chess-engine
        ```
    3.  Install the required dependencies:
        ```bash
        npm install
        ```

    ## Usage

    To run the project and see the chess engine in action, you can open the `index.html` file in the `src/ui/` directory in your web browser.

    To run the automated tests:

    ```bash
    npm test
    ```
    ````

    ```

    ```

### **Issue #37: Add Architecture Diagram and Contribution Guidelines**

1.  **Create a new file named `CONTRIBUTING.md`** in the repository root with the following content:

    ```markdown
    # Contributing to JS Chess Engine

    We welcome contributions from the community! Whether you're a developer, a chess enthusiast, or an AI researcher, your input is valuable.

    ## Development Workflow

    1.  **Fork the repository** and clone it to your local machine.
    2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
    3.  **Make your changes**, adhering to the project's coding standards.
    4.  **Run tests** to ensure your changes don't break existing functionality: `npm test`.
    5.  **Commit your changes** with a descriptive commit message.
    6.  **Push your branch** to your fork and **submit a pull request** to the `main` branch of the original repository.

    ## Code Standards

    - We use ESLint and Prettier for code consistency. Please run `npm run quality:check` before committing.
    - Follow the existing code patterns and conventions.
    - All new features should have corresponding tests.
    ```

2.  **Append the following sections** to your `README.md` file:

    ````markdown
    ## 🏗️ Architecture

    The project follows a modular architecture, separating concerns into distinct components:

    ```mermaid
    graph TD
        A[UI Layer] --> B[Core Engine]
        C[AI Player] --> B
        B --> D[Utilities]

        subgraph "src/ui"
            A(BoardRenderer.js, InputHandler.js)
        end

        subgraph "src/core"
            B(Board.js, GameState.js, MoveGenerator.js)
        end

        subgraph "src/ai"
            C(AIPlayer.js, Evaluation.js)
        end

        subgraph "src/utils"
            D(Constants.js, Notation.js)
        end
    ```
    ````

    ## 🤝 Contributing

    Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

    ## 📜 License

    This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

    ```

    ```

### **Issue #38: Add Status Badges and Roadmap**

1.  **Insert the following badges** at the top of your `README.md`, right below the title:

    ```markdown
    [![CI](https://github.com/jane-alesi/js-chess-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/jane-alesi/js-chess-engine/actions/workflows/ci.yml)
    [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
    ```

2.  **Append the following "Roadmap" section** to your `README.md` file:

    ```markdown
    ## 🗺️ Roadmap

    - [ ] **Phase 1: Core Move Generation**
        - [ ] Rook Move Generation (#2)
        - [ ] Bishop Move Generation (#1)
        - [ ] Knight Move Generation (#9)
        - [ ] King Move Generation (#7)
        - [ ] Queen Move Generation (#6)
    - [ ] **Phase 2: Core Game Logic**
        - [ ] Self-Check Prevention
        - [ ] Check/Checkmate Detection
    - [ ] **Phase 3: AI Implementation**
        - [ ] Minimax Algorithm with Alpha-Beta Pruning
    - [ ] **Phase 4: Advanced Features**
        - [ ] Castling, En Passant, and Promotion
        - [ ] UI Enhancements

    See the [open issues](https://github.com/jane-alesi/js-chess-engine/issues) for a full list of proposed features and known issues.
    ```

## Phase 2: Issue Management Improvement

### **Issue #39: Create Standardized GitHub Issue Templates**

1.  **Create the directory `.github/ISSUE_TEMPLATE`** in the root of your repository.
2.  Inside this directory, create a file named `bug_report.md` with the following content:

    ```markdown
    ---
    name: Bug Report
    about: Create a report to help us improve
    title: 'Bug: '
    labels: 'type:bug'
    ---

    **Describe the bug**
    A clear and concise description of what the bug is.

    **To Reproduce**
    Steps to reproduce the behavior:

    1. Go to '...'
    2. Click on '....'
    3. Scroll down to '....'
    4. See error

    **Expected behavior**
    A clear and concise description of what you expected to happen.

    **Screenshots**
    If applicable, add screenshots to help explain your problem.

    **Environment (please complete the following information):**

    - OS: [e.g. iOS]
    - Browser [e.g. chrome, safari]
    - Version [e.g. 22]
    ```

3.  Create another file named `feature_request.md` with the following content:

    ```markdown
    ---
    name: Feature Request
    about: Suggest an idea for this project
    title: 'Feature: '
    labels: 'type:feature'
    ---

    **Is your feature request related to a problem? Please describe.**
    A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

    **Describe the solution you'd like**
    A clear and concise description of what you want to happen.

    **Describe alternatives you've considered**
    A clear and concise description of any alternative solutions or features you've considered.

    **Acceptance Criteria**

    - [ ] Criteria 1
    - [ ] Criteria 2

    **Additional context**
    Add any other context or screenshots about the feature request here.
    ```

### **Issue #40: Implement Intelligent Issue Labeling and Automation**

1.  **Create the required labels** in your repository's `Labels` settings (`https://github.com/jane-alesi/js-chess-engine/labels`):

    - `priority:critical` (Color: `#b60205`)
    - `priority:high` (Color: `#d93f0b`)
    - `priority:medium` (Color: `#fbca04`)
    - `priority:low` (Color: `#0e8a16`)
    - `type:bug` 🐛 (Color: `#d73a4a`)
    - `type:feature` ✨ (Color: `#a2eeef`)
    - `type:security` 🔒 (Color: `#ee0701`)
    - `type:docs` 📚 (Color: `#0075ca`)
    - `stale` 🏷️ (Color: `#ededed`)

2.  **Create the directory `.github/workflows`** if it doesn't exist.
3.  Inside this directory, create a file named `auto-triage.yml` with the following content:

    ```yaml
    name: Issue Triage
    on:
        issues:
            types: [opened]
    jobs:
        label:
            runs-on: ubuntu-latest
            steps:
                - uses: actions/github-script@v6
                  with:
                      script: |
                          const issueBody = context.payload.issue.body;
                          const labels = [];
                          if (issueBody.includes('crash') || issueBody.includes('error')) {
                            labels.push('type:bug');
                          }
                          if (issueBody.includes('feature request')) {
                            labels.push('type:feature');
                          }
                          if (labels.length > 0) {
                            await github.rest.issues.addLabels({
                              issue_number: context.issue.number,
                              owner: context.repo.owner,
                              repo: context.repo.repo,
                              labels: labels
                            });
                          }
    ```

4.  Create another file named `stale.yml` with the following content:

    ```yaml
    name: Stale Issues
    on:
        schedule:
            - cron: '0 0 * * *'
    jobs:
        stale:
            uses: actions/stale@v8
            with:
                days-before-stale: 60
                days-before-close: 14
                stale-issue-label: 'stale'
                stale-issue-message: 'This issue is stale because it has been open for 60 days with no activity. Remove stale label or comment or this will be closed in 14 days.'
    ```

5.  **Update `CONTRIBUTING.md`** to include a section on the new labeling strategy.
