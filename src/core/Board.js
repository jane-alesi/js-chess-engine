import { Piece } from './Piece.js';
import { PIECE_SYMBOLS, PIECE_VALUES } from '../utils/Constants.js';

export class Board {
    constructor() {
        this.squares = new Array(64).fill(null);
    }

    setupInitialBoard() {
        this.squares[0] = new Piece('rook', 'black', PIECE_VALUES.rook, PIECE_SYMBOLS.rook.black);
        this.squares[1] = new Piece(
            'knight',
            'black',
            PIECE_VALUES.knight,
            PIECE_SYMBOLS.knight.black
        );
        this.squares[2] = new Piece(
            'bishop',
            'black',
            PIECE_VALUES.bishop,
            PIECE_SYMBOLS.bishop.black
        );
        this.squares[3] = new Piece(
            'queen',
            'black',
            PIECE_VALUES.queen,
            PIECE_SYMBOLS.queen.black
        );
        this.squares[4] = new Piece('king', 'black', PIECE_VALUES.king, PIECE_SYMBOLS.king.black);
        this.squares[5] = new Piece(
            'bishop',
            'black',
            PIECE_VALUES.bishop,
            PIECE_SYMBOLS.bishop.black
        );
        this.squares[6] = new Piece(
            'knight',
            'black',
            PIECE_VALUES.knight,
            PIECE_SYMBOLS.knight.black
        );
        this.squares[7] = new Piece('rook', 'black', PIECE_VALUES.rook, PIECE_SYMBOLS.rook.black);

        for (let i = 8; i < 16; i++) {
            this.squares[i] = new Piece(
                'pawn',
                'black',
                PIECE_VALUES.pawn,
                PIECE_SYMBOLS.pawn.black
            );
        }

        for (let i = 48; i < 56; i++) {
            this.squares[i] = new Piece(
                'pawn',
                'white',
                PIECE_VALUES.pawn,
                PIECE_SYMBOLS.pawn.white
            );
        }

        this.squares[56] = new Piece('rook', 'white', PIECE_VALUES.rook, PIECE_SYMBOLS.rook.white);
        this.squares[57] = new Piece(
            'knight',
            'white',
            PIECE_VALUES.knight,
            PIECE_SYMBOLS.knight.white
        );
        this.squares[58] = new Piece(
            'bishop',
            'white',
            PIECE_VALUES.bishop,
            PIECE_SYMBOLS.bishop.white
        );
        this.squares[59] = new Piece(
            'queen',
            'white',
            PIECE_VALUES.queen,
            PIECE_SYMBOLS.queen.white
        );
        this.squares[60] = new Piece('king', 'white', PIECE_VALUES.king, PIECE_SYMBOLS.king.white);
        this.squares[61] = new Piece(
            'bishop',
            'white',
            PIECE_VALUES.bishop,
            PIECE_SYMBOLS.bishop.white
        );
        this.squares[62] = new Piece(
            'knight',
            'white',
            PIECE_VALUES.knight,
            PIECE_SYMBOLS.knight.white
        );
        this.squares[63] = new Piece('rook', 'white', PIECE_VALUES.rook, PIECE_SYMBOLS.rook.white);
    }

    movePiece(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= 64 || toIndex < 0 || toIndex >= 64) {
            throw new Error(
                `Invalid move: square indices out of bounds (from: ${fromIndex}, to: ${toIndex})`
            );
        }

        if (!this.squares[fromIndex]) {
            throw new Error(`Invalid move: no piece found at square ${fromIndex}`);
        }

        const movingPiece = this.squares[fromIndex];
        const capturedPiece = this.squares[toIndex];

        if (!movingPiece.getHasMoved()) {
            movingPiece.markAsMoved();
        }

        this.squares[toIndex] = movingPiece;
        this.squares[fromIndex] = null;

        return {
            from: fromIndex,
            to: toIndex,
            pieceMoved: movingPiece.getType(),
            pieceCaptured: capturedPiece ? capturedPiece.getType() : null,
            success: true,
        };
    }
}
