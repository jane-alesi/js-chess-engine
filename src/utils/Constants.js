export const PIECE_VALUES = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 1000,
};

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

export const BOARD_SIZE = 8;
export const TOTAL_SQUARES = 64;

export const PIECE_TYPES = {
    PAWN: 'pawn',
    ROOK: 'rook',
    KNIGHT: 'knight',
    BISHOP: 'bishop',
    QUEEN: 'queen',
    KING: 'king',
};

export const PIECE_COLORS = {
    WHITE: 'white',
    BLACK: 'black',
};

export const STARTING_POSITIONS = {
    white: {
        rooks: [56, 63],
        knights: [57, 62],
        bishops: [58, 61],
        queen: [59],
        king: [60],
        pawns: [48, 49, 50, 51, 52, 53, 54, 55],
    },
    black: {
        rooks: [0, 7],
        knights: [1, 6],
        bishops: [2, 5],
        queen: [3],
        king: [4],
        pawns: [8, 9, 10, 11, 12, 13, 14, 15],
    },
};

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

export function getPieceValue(type) {
    if (!PIECE_VALUES[type]) {
        throw new Error(`Invalid piece type: ${type}`);
    }

    return PIECE_VALUES[type];
}

export function isValidPieceType(type) {
    return Object.values(PIECE_TYPES).includes(type);
}

export function isValidPieceColor(color) {
    return Object.values(PIECE_COLORS).includes(color);
}

export function getAllPieceTypes() {
    return Object.values(PIECE_TYPES);
}

export function getAllPieceColors() {
    return Object.values(PIECE_COLORS);
}
