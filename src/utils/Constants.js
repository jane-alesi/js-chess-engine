// src/utils/Constants.js

export const PIECE_VALUES = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 1000 // King value is effectively infinite
};

export const PIECE_SYMBOLS = {
    pawn:   { white: '♙', black: '♟︎' },
    knight: { white: '♘', black: '♞' },
    bishop: { white: '♗', black: '♝' },
    rook:   { white: '♖', black: '♜' },
    queen:  { white: '♕', black: '♛' },
    king:   { white: '♔', black: '♚' }
};

export const BOARD_SIZE = 8;
export const TOTAL_SQUARES = 64;