// src/core/GameState.js

/**
 * GameState class to manage the current state of the chess game
 * Tracks turn, castling rights, en passant, move history, etc.
 */
export class GameState {
    constructor() {
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.enPassantTarget = null;
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
    }

    // TODO: Implement game state management methods
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    addMove(move) {
        this.moveHistory.push(move);
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }
}