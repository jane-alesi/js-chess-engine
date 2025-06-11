/**
 * ChessGame - Main game controller
 *
 * This class manages the overall chess game state and coordinates
 * between different components (board, rules, UI, AI).
 *
 * @author Jane Alesi <ja@satware.ai>
 */

import { Board } from './Board.js';
import { GameState } from './GameState.js';
import { MoveValidator } from './MoveValidator.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class ChessGame extends EventEmitter {
    constructor() {
        super();
        this.board = new Board();
        this.gameState = new GameState();
        this.moveValidator = new MoveValidator(this.board, this.gameState);
        this.moveHistory = [];

        this.initialize();
    }

    /**
     * Initialize the game to starting position
     */
    initialize() {
        this.board.setupInitialPosition();
        this.gameState.reset();
        this.moveHistory = [];
        this.emit('initialized');
    }

    /**
     * Reset the game to initial state
     */
    reset() {
        this.initialize();
        this.emit('reset');
    }

    /**
     * Make a move on the board
     * @param {Object} move - Move object {from, to, promotion}
     * @returns {boolean} True if move was successful
     */
    makeMove(move) {
        if (!this.moveValidator.isValidMove(move)) {
            return false;
        }

        // Store move for history
        const moveRecord = this.board.makeMove(move);
        this.moveHistory.push(moveRecord);

        // Update game state
        this.gameState.updateAfterMove(moveRecord);

        // Emit move event
        this.emit('move', moveRecord);

        // Check for game over conditions
        if (this.gameState.isGameOver()) {
            this.emit('gameOver', this.gameState.getGameResult());
        }

        return true;
    }

    /**
     * Undo the last move
     * @returns {boolean} True if undo was successful
     */
    undoMove() {
        if (this.moveHistory.length === 0) {
            return false;
        }

        const lastMove = this.moveHistory.pop();
        this.board.undoMove(lastMove);
        this.gameState.undoMove();

        this.emit('undoMove', lastMove);
        return true;
    }

    /**
     * Get all legal moves for the current player
     * @returns {Array} Array of legal move objects
     */
    getLegalMoves() {
        return this.moveValidator.getAllLegalMoves(this.gameState.currentPlayer);
    }

    /**
     * Get legal moves for a specific square
     * @param {number} square - Square index (0-63)
     * @returns {Array} Array of legal moves from this square
     */
    getLegalMovesFromSquare(square) {
        return this.moveValidator.getLegalMovesFromSquare(square);
    }

    /**
     * Get the current player
     * @returns {string} 'white' or 'black'
     */
    getCurrentPlayer() {
        return this.gameState.currentPlayer;
    }

    /**
     * Check if the game is over
     * @returns {boolean} True if game is over
     */
    isGameOver() {
        return this.gameState.isGameOver();
    }

    /**
     * Get the current board state
     * @returns {Array} 64-element array representing the board
     */
    getBoard() {
        return this.board.getBoard();
    }

    /**
     * Get the current game state
     * @returns {Object} Game state object
     */
    getGameState() {
        return this.gameState.getState();
    }

    /**
     * Check if undo is possible
     * @returns {boolean} True if there are moves to undo
     */
    canUndo() {
        return this.moveHistory.length > 0;
    }

    /**
     * Get move history
     * @returns {Array} Array of move records
     */
    getMoveHistory() {
        return [...this.moveHistory];
    }

    /**
     * Get the game result
     * @returns {Object|null} Game result or null if game is ongoing
     */
    getGameResult() {
        return this.gameState.getGameResult();
    }

    /**
     * Export game state as FEN string
     * @returns {string} FEN notation of current position
     */
    toFEN() {
        // TODO: Implement FEN export
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    /**
     * Load game state from FEN string
     * @param {string} _fen - FEN notation string
     * @returns {boolean} True if FEN was loaded successfully
     */
    fromFEN(_fen) {
        // TODO: Implement FEN import
        console.warn('FEN import not yet implemented');
        return false;
    }
}
