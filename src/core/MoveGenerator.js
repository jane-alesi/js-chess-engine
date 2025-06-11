// src/core/MoveGenerator.js

/**
 * MoveGenerator class to generate all possible moves for pieces
 * Handles piece-specific movement patterns and board constraints
 */
export class MoveGenerator {
    constructor(board) {
        this.board = board;
    }

    // TODO: Implement move generation for all piece types
    generateMoves(piece, position) {
        const moves = [];

        switch (piece.getType()) {
            case 'pawn':
                return this.generatePawnMoves(piece, position);
            case 'rook':
                return this.generateRookMoves(piece, position);
            case 'knight':
                return this.generateKnightMoves(piece, position);
            case 'bishop':
                return this.generateBishopMoves(piece, position);
            case 'queen':
                return this.generateQueenMoves(piece, position);
            case 'king':
                return this.generateKingMoves(piece, position);
            default:
                return moves;
        }
    }

    /**
     * Generate pseudo-legal moves for pawns.
     * Handles forward movement, double moves from starting rank, and diagonal captures.
     *
     * @param {Piece} piece - The pawn piece
     * @param {number} position - Current position index (0-63)
     * @returns {Array} Array of move objects
     */
    generatePawnMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        // Validate position
        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        // Determine direction and starting ranks based on color
        const direction = color === 'white' ? 8 : -8; // White moves up (+8), black moves down (-8)
        const startingRank = color === 'white' ? 1 : 6; // White starts on rank 2 (indices 8-15), black on rank 7 (indices 48-55)
        const currentRank = Math.floor(position / 8);

        // Single square forward move
        const oneSquareForward = position + direction;
        if (this.isValidSquare(oneSquareForward) && !this.board.squares[oneSquareForward]) {
            moves.push({
                from: position,
                to: oneSquareForward,
                type: 'normal',
                piece: piece.getType(),
                color: color,
            });

            // Double square forward move (only if single move is possible and pawn is on starting rank)
            if (currentRank === startingRank) {
                const twoSquaresForward = position + direction * 2;
                if (
                    this.isValidSquare(twoSquaresForward) &&
                    !this.board.squares[twoSquaresForward]
                ) {
                    moves.push({
                        from: position,
                        to: twoSquaresForward,
                        type: 'double',
                        piece: piece.getType(),
                        color: color,
                    });
                }
            }
        }

        // Diagonal capture moves
        const captureOffsets = color === 'white' ? [7, 9] : [-7, -9]; // Diagonal offsets for captures

        for (const offset of captureOffsets) {
            const captureSquare = position + offset;

            // Check if capture square is valid and not wrapping around the board
            if (
                this.isValidSquare(captureSquare) &&
                this.isValidPawnCapture(position, captureSquare)
            ) {
                const targetPiece = this.board.squares[captureSquare];

                // Can capture if there's an opponent piece
                if (targetPiece && targetPiece.getColor() !== color) {
                    moves.push({
                        from: position,
                        to: captureSquare,
                        type: 'capture',
                        piece: piece.getType(),
                        color: color,
                        captured: targetPiece.getType(),
                    });
                }
            }
        }

        return moves;
    }

    /**
     * Check if a square index is valid (0-63)
     * @param {number} square - Square index to validate
     * @returns {boolean} True if valid, false otherwise
     */
    isValidSquare(square) {
        return square >= 0 && square < 64;
    }

    /**
     * Check if a pawn capture move is valid (doesn't wrap around board edges)
     * @param {number} fromSquare - Starting square
     * @param {number} toSquare - Target square
     * @returns {boolean} True if valid capture, false otherwise
     */
    isValidPawnCapture(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const toFile = toSquare % 8;

        // Capture must be to adjacent file (difference of 1)
        return Math.abs(fromFile - toFile) === 1;
    }

    generateRookMoves(_piece, _position) {
        // TODO: Implement rook move generation
        return [];
    }

    generateKnightMoves(_piece, _position) {
        // TODO: Implement knight move generation
        return [];
    }

    generateBishopMoves(_piece, _position) {
        // TODO: Implement bishop move generation
        return [];
    }

    generateQueenMoves(_piece, _position) {
        // TODO: Implement queen move generation
        return [];
    }

    generateKingMoves(_piece, _position) {
        // TODO: Implement king move generation
        return [];
    }
}
