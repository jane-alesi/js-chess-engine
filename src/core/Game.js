// src/core/Game.js

import { Board } from './Board.js';
import { BoardRenderer } from '../ui/BoardRenderer.js';
import { GameState } from './GameState.js';

/**
 * Main Game class that orchestrates the chess engine components
 * Manages the overall game flow, user interactions, and game state
 */
export class Game {
    constructor(boardContainerId) {
        // Initialize core components
        this.board = new Board();
        this.gameState = new GameState();
        this.boardRenderer = new BoardRenderer(boardContainerId);
        
        // Game state management
        this.selectedSquare = null;
        this.currentPlayer = 'white';
        this.gameStatus = 'active'; // 'active', 'check', 'checkmate', 'stalemate', 'draw'
        
        // Input handling will be initialized in startGame()
        this.inputHandler = null;
        
        // Bind methods to maintain context
        this.handleSquareClick = this.handleSquareClick.bind(this);
    }

    /**
     * Initialize and start a new chess game
     */
    startGame() {
        // Setup initial board position
        this.board.setupInitialBoard();
        
        // Render the board
        this.boardRenderer.render(this.board.squares);
        
        // Initialize input handling
        this.setupInputHandling();
        
        // Update game state display
        this.updateGameStateDisplay();
        
        console.log('Chess game started! White to move.');
    }

    /**
     * Setup input handling for board interactions
     */
    setupInputHandling() {
        // Get the board container element
        const boardContainer = this.boardRenderer.getBoardContainer();
        
        if (boardContainer) {
            // Add click event listener to the board container
            boardContainer.addEventListener('click', this.handleSquareClick);
        } else {
            console.error('Board container not found. Cannot setup input handling.');
        }
    }

    /**
     * Handle square click events
     * @param {Event} event - The click event
     */
    handleSquareClick(event) {
        // Find the clicked square
        const square = event.target.closest('.square');
        if (!square) return;
        
        // Get square index from data attribute
        const squareIndex = parseInt(square.dataset.index);
        if (isNaN(squareIndex)) return;
        
        this.processSquareSelection(squareIndex);
    }

    /**
     * Process square selection logic
     * @param {number} squareIndex - Index of the clicked square (0-63)
     */
    processSquareSelection(squareIndex) {
        const piece = this.board.squares[squareIndex];
        
        if (this.selectedSquare === null) {
            // First click - select piece
            this.handlePieceSelection(squareIndex, piece);
        } else {
            // Second click - attempt move
            this.handleMoveAttempt(squareIndex);
        }
    }

    /**
     * Handle piece selection
     * @param {number} squareIndex - Index of the square
     * @param {Piece|null} piece - The piece on the square
     */
    handlePieceSelection(squareIndex, piece) {
        // Only allow selection of current player's pieces
        if (piece && piece.color === this.currentPlayer) {
            this.selectedSquare = squareIndex;
            this.highlightSelectedSquare(squareIndex);
            console.log(`Selected ${piece.color} ${piece.type} at square ${squareIndex}`);
        } else if (piece) {
            console.log(`Cannot select ${piece.color} piece. It's ${this.currentPlayer}'s turn.`);
        } else {
            console.log('No piece on selected square.');
        }
    }

    /**
     * Handle move attempt
     * @param {number} toSquareIndex - Target square index
     */
    handleMoveAttempt(toSquareIndex) {
        const fromSquareIndex = this.selectedSquare;
        
        // Attempt to make the move
        const moveResult = this.attemptMove(fromSquareIndex, toSquareIndex);
        
        if (moveResult.success) {
            // Move was successful
            this.processMoveSuccess(moveResult);
        } else {
            // Move failed
            console.log(`Invalid move: ${moveResult.reason}`);
        }
        
        // Clear selection regardless of move success
        this.clearSelection();
    }

    /**
     * Attempt to make a move
     * @param {number} fromIndex - Source square index
     * @param {number} toIndex - Target square index
     * @returns {Object} Move result with success status and details
     */
    attemptMove(fromIndex, toIndex) {
        // Basic validation
        if (fromIndex === toIndex) {
            return { success: false, reason: 'Cannot move to the same square' };
        }

        const piece = this.board.squares[fromIndex];
        if (!piece) {
            return { success: false, reason: 'No piece at source square' };
        }

        if (piece.color !== this.currentPlayer) {
            return { success: false, reason: 'Not your piece' };
        }

        // For now, allow any move (basic implementation)
        // TODO: Add proper move validation, check detection, etc.
        
        const capturedPiece = this.board.squares[toIndex];
        
        // Make the move
        const moveSuccess = this.board.movePiece(fromIndex, toIndex);
        
        if (moveSuccess) {
            // Mark piece as moved (important for castling and pawn double moves)
            piece.hasMoved = true;
            
            return {
                success: true,
                from: fromIndex,
                to: toIndex,
                piece: piece,
                captured: capturedPiece,
                notation: this.generateMoveNotation(fromIndex, toIndex, piece, capturedPiece)
            };
        } else {
            return { success: false, reason: 'Move execution failed' };
        }
    }

    /**
     * Process successful move
     * @param {Object} moveResult - The successful move result
     */
    processMoveSuccess(moveResult) {
        // Update display
        this.boardRenderer.render(this.board.squares);
        
        // Switch players
        this.switchPlayer();
        
        // Update game state
        this.updateGameState(moveResult);
        
        // Log the move
        console.log(`Move: ${moveResult.notation}`);
        console.log(`${this.currentPlayer} to move.`);
    }

    /**
     * Switch the current player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    /**
     * Update game state after a move
     * @param {Object} moveResult - The move result
     */
    updateGameState(moveResult) {
        // Update move counters
        if (this.currentPlayer === 'white') {
            this.gameState.fullmoveNumber++;
        }
        
        // Reset halfmove clock on pawn move or capture
        if (moveResult.piece.type === 'pawn' || moveResult.captured) {
            this.gameState.halfmoveClock = 0;
        } else {
            this.gameState.halfmoveClock++;
        }
        
        // TODO: Check for check, checkmate, stalemate
        // TODO: Update castling rights
        // TODO: Update en passant target
        
        this.updateGameStateDisplay();
    }

    /**
     * Generate basic move notation
     * @param {number} from - Source square
     * @param {number} to - Target square
     * @param {Piece} piece - Moving piece
     * @param {Piece|null} captured - Captured piece
     * @returns {string} Move notation
     */
    generateMoveNotation(from, to, piece, captured) {
        const fromSquare = this.indexToSquare(from);
        const toSquare = this.indexToSquare(to);
        const captureSymbol = captured ? 'x' : '';
        
        return `${piece.type}${fromSquare}${captureSymbol}${toSquare}`;
    }

    /**
     * Convert square index to algebraic notation
     * @param {number} index - Square index (0-63)
     * @returns {string} Algebraic notation (e.g., 'e4')
     */
    indexToSquare(index) {
        const file = String.fromCharCode(97 + (index % 8)); // a-h
        const rank = Math.floor(index / 8) + 1; // 1-8
        return file + rank;
    }

    /**
     * Highlight the selected square
     * @param {number} squareIndex - Index of square to highlight
     */
    highlightSelectedSquare(squareIndex) {
        // Clear previous highlights
        this.clearHighlights();
        
        // Add highlight to selected square
        const squares = document.querySelectorAll('.square');
        if (squares[squareIndex]) {
            squares[squareIndex].classList.add('selected');
        }
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected', 'valid-move', 'last-move');
        });
    }

    /**
     * Clear current selection
     */
    clearSelection() {
        this.selectedSquare = null;
        this.clearHighlights();
    }

    /**
     * Update game state display
     */
    updateGameStateDisplay() {
        // Update current player display
        const statusElement = document.getElementById('game-status');
        if (statusElement) {
            statusElement.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} to move`;
        }
        
        // Update move counter
        const moveElement = document.getElementById('move-counter');
        if (moveElement) {
            moveElement.textContent = `Move: ${this.gameState.fullmoveNumber}`;
        }
    }

    /**
     * Get current game state
     * @returns {Object} Current game state
     */
    getGameState() {
        return {
            currentPlayer: this.currentPlayer,
            gameStatus: this.gameStatus,
            selectedSquare: this.selectedSquare,
            board: this.board.squares,
            moveNumber: this.gameState.fullmoveNumber
        };
    }

    /**
     * Reset the game to initial state
     */
    resetGame() {
        // Reset board
        this.board = new Board();
        this.board.setupInitialBoard();
        
        // Reset game state
        this.gameState = new GameState();
        this.currentPlayer = 'white';
        this.gameStatus = 'active';
        this.selectedSquare = null;
        
        // Re-render board
        this.boardRenderer.render(this.board.squares);
        this.updateGameStateDisplay();
        
        console.log('Game reset. White to move.');
    }
}