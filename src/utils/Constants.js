// src/utils/Constants.js

/**
 * Chess engine constants for piece values, symbols, and board configuration.
 * Provides standardized values for AI evaluation and UI rendering.
 *
 * @author Jane Alesi Chess Engine
 * @version 1.0.0
 */

/**
 * Standard chess piece values for AI evaluation.
 * Based on traditional chess piece values with king set to effectively infinite.
 *
 * @constant {Object} PIECE_VALUES
 */
export const PIECE_VALUES = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 1000, // King value is effectively infinite for evaluation
};

/**
 * Unicode symbols for chess pieces by type and color.
 * Uses standard Unicode chess symbols for consistent display.
 *
 * @constant {Object} PIECE_SYMBOLS
 */
export const PIECE_SYMBOLS = {
    pawn: {
        white: '♙',
        black: '♟',
    },
    knight: {
        white: '♘',
        black: '♞',
    },
    bishop: {
        white: '♗',
        black: '♝',
    },
    rook: {
        white: '♖',
        black: '♜',
    },
    queen: {
        white: '♕',
        black: '♛',
    },
    king: {
        white: '♔',
        black: '♚',
    },
};

/**
 * Alternative Unicode symbols for chess pieces (filled/outlined style).
 * Can be used for different UI themes or accessibility needs.
 *
 * @constant {Object} PIECE_SYMBOLS_ALT
 */
export const PIECE_SYMBOLS_ALT = {
    pawn: {
        white: '♟︎',
        black: '♟',
    },
    knight: {
        white: '♞︎',
        black: '♞',
    },
    bishop: {
        white: '♝︎',
        black: '♝',
    },
    rook: {
        white: '♜︎',
        black: '♜',
    },
    queen: {
        white: '♛︎',
        black: '♛',
    },
    king: {
        white: '♚︎',
        black: '♚',
    },
};

/**
 * Board configuration constants.
 *
 * @constant {number} BOARD_SIZE - Number of squares per side (8x8 board)
 * @constant {number} TOTAL_SQUARES - Total number of squares on the board
 */
export const BOARD_SIZE = 8;
export const TOTAL_SQUARES = 64;

/**
 * Chess piece types as constants for type safety.
 *
 * @constant {Object} PIECE_TYPES
 */
export const PIECE_TYPES = {
    PAWN: 'pawn',
    ROOK: 'rook',
    KNIGHT: 'knight',
    BISHOP: 'bishop',
    QUEEN: 'queen',
    KING: 'king',
};

/**
 * Chess piece colors as constants for type safety.
 *
 * @constant {Object} PIECE_COLORS
 */
export const PIECE_COLORS = {
    WHITE: 'white',
    BLACK: 'black',
};

/**
 * Starting positions for chess pieces on the board.
 * Uses 0-63 indexing where 0 is a8 and 63 is h1.
 * 
 * 🔧 CRITICAL FIX: Corrected to match Board.js implementation
 * - White pieces on bottom of board (indices 8-15 for pawns, 56-63 for back rank)
 * - Black pieces on top of board (indices 48-55 for pawns, 0-7 for back rank)
 *
 * @constant {Object} STARTING_POSITIONS
 */
export const STARTING_POSITIONS = {
    // White pieces (bottom of board, indices 8-15 for pawns, 56-63 for back rank)
    white: {
        rooks: [56, 63],
        knights: [57, 62],
        bishops: [58, 61],
        queen: [59],
        king: [60],
        pawns: [8, 9, 10, 11, 12, 13, 14, 15], // ✅ FIXED: Corrected to match Board.js
    },
    // Black pieces (top of board, indices 48-55 for pawns, 0-7 for back rank)
    black: {
        rooks: [0, 7],
        knights: [1, 6],
        bishops: [2, 5],
        queen: [3],
        king: [4],
        pawns: [48, 49, 50, 51, 52, 53, 54, 55], // ✅ FIXED: Corrected to match Board.js
    },
};

/**
 * Helper function to get piece symbol by type and color.
 *
 * @param {string} type - The piece type
 * @param {string} color - The piece color
 * @param {boolean} useAlt - Whether to use alternative symbols
 * @returns {string} The Unicode symbol for the piece
 * @throws {Error} If invalid type or color provided
 */
export function getPieceSymbol(type, color, useAlt = false) {
    const symbolSet = useAlt ? PIECE_SYMBOLS_ALT : PIECE_SYMBOLS;

    if (!symbolSet[type]) {
        throw new Error(`Invalid piece type: ${type}`);
    }

    if (!symbolSet[type][color]) {
        throw new Error(`Invalid piece color: ${color}`);
    }

    return symbolSet[type][color];
}

/**
 * Helper function to get piece value by type.
 *
 * @param {string} type - The piece type
 * @returns {number} The point value of the piece
 * @throws {Error} If invalid type provided
 */
export function getPieceValue(type) {
    if (!PIECE_VALUES[type]) {
        throw new Error(`Invalid piece type: ${type}`);
    }

    return PIECE_VALUES[type];
}

/**
 * Helper function to validate piece type.
 *
 * @param {string} type - The piece type to validate
 * @returns {boolean} True if valid piece type
 */
export function isValidPieceType(type) {
    return Object.values(PIECE_TYPES).includes(type);
}

/**
 * Helper function to validate piece color.
 *
 * @param {string} color - The piece color to validate
 * @returns {boolean} True if valid piece color
 */
export function isValidPieceColor(color) {
    return Object.values(PIECE_COLORS).includes(color);
}

/**
 * Helper function to get all piece types.
 *
 * @returns {string[]} Array of all valid piece types
 */
export function getAllPieceTypes() {
    return Object.values(PIECE_TYPES);
}

/**
 * Helper function to get all piece colors.
 *
 * @returns {string[]} Array of all valid piece colors
 */
export function getAllPieceColors() {
    return Object.values(PIECE_COLORS);
}