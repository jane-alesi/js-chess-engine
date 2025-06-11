/**
 * JS Chess Engine - Main Entry Point
 *
 * This is the main entry point for the chess game application.
 * It initializes the game components and starts the chess engine.
 *
 * @author Jane Alesi <ja@satware.ai>
 * @version 0.1.0
 */

import { ChessGame } from './core/ChessGame.js';
import { UIController } from './ui/UIController.js';
import { AIPlayer } from './ai/AIPlayer.js';

/**
 * Initialize and start the chess game
 */
function initializeGame() {
    try {
        // Create game components
        const game = new ChessGame();
        const ui = new UIController(game);
        const ai = new AIPlayer(game);

        // Set up event listeners
        setupEventListeners(game, ui, ai);

        // Initialize the UI
        ui.initialize();

        console.log('🏁♟️ JS Chess Engine initialized successfully!');
        console.log('Inspired by Atari Video Chess (1979)');
    } catch (error) {
        console.error('Failed to initialize chess game:', error);
        showError('Failed to load the chess game. Please refresh the page.');
    }
}

/**
 * Set up event listeners for game controls
 * @param {ChessGame} game - The chess game instance
 * @param {UIController} ui - The UI controller
 * @param {AIPlayer} ai - The AI player
 */
function setupEventListeners(game, ui, ai) {
    // New game button
    document.getElementById('new-game')?.addEventListener('click', () => {
        game.reset();
        ui.render();
    });

    // Undo move button
    document.getElementById('undo-move')?.addEventListener('click', () => {
        if (game.canUndo()) {
            game.undoMove();
            ui.render();
        }
    });

    // Difficulty selector
    document.getElementById('difficulty')?.addEventListener('change', (event) => {
        ai.setDifficulty(event.target.value);
    });

    // Listen for game events
    game.on('move', (move) => {
        ui.updateMoveHistory(move);
        ui.updateGameStatus();

        // Trigger AI move if it's the AI's turn
        if (game.getCurrentPlayer() === 'black' && !game.isGameOver()) {
            setTimeout(() => {
                ai.makeMove();
            }, 500); // Small delay for better UX
        }
    });

    game.on('gameOver', (result) => {
        ui.showGameOverDialog(result);
    });
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize the game when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

// Export for testing
export { initializeGame };
