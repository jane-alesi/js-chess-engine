// src/core/Rules.js

/**
 * Rules class containing chess game rules and constants
 * Defines standard chess rules, special moves, and game conditions
 */
export class Rules {
    static PIECE_TYPES = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
    static COLORS = ['white', 'black'];
    
    static INITIAL_POSITIONS = {
        white: {
            rook: [0, 7],
            knight: [1, 6],
            bishop: [2, 5],
            queen: [3],
            king: [4],
            pawn: [8, 9, 10, 11, 12, 13, 14, 15]
        },
        black: {
            rook: [56, 63],
            knight: [57, 62],
            bishop: [58, 61],
            queen: [59],
            king: [60],
            pawn: [48, 49, 50, 51, 52, 53, 54, 55]
        }
    };

    // TODO: Implement rule checking methods
    static isValidPieceType(type) {
        return this.PIECE_TYPES.includes(type);
    }

    static isValidColor(color) {
        return this.COLORS.includes(color);
    }

    static getOpponentColor(color) {
        return color === 'white' ? 'black' : 'white';
    }

    static isPromotionSquare(position, color) {
        if (color === 'white') {
            return position >= 56 && position <= 63; // 8th rank
        } else {
            return position >= 0 && position <= 7; // 1st rank
        }
    }

    static getSquareColor(position) {
        const row = Math.floor(position / 8);
        const col = position % 8;
        return (row + col) % 2 === 0 ? 'dark' : 'light';
    }

    static positionToAlgebraic(position) {
        const file = String.fromCharCode(97 + (position % 8)); // a-h
        const rank = Math.floor(position / 8) + 1; // 1-8
        return file + rank;
    }

    static algebraicToPosition(algebraic) {
        const file = algebraic.charCodeAt(0) - 97; // a=0, b=1, etc.
        const rank = parseInt(algebraic[1]) - 1; // 1=0, 2=1, etc.
        return rank * 8 + file;
    }
}