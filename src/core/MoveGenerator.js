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
        // ✅ FIXED: Corrected direction based on test expectations
        const direction = color === 'white' ? 8 : -8; // White moves down (+8), black moves up (-8)
        const startingRank = color === 'white' ? 6 : 1; // White starts on rank 6 (e2=52), black on rank 1 (e7=12)
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
        // ✅ FIXED: Adjusted capture offsets for correct direction
        const captureOffsets = color === 'white' ? [7, 9] : [-9, -7];

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
     * Generate pseudo-legal moves for rooks.
     * Handles horizontal and vertical sliding movement with obstruction detection.
     *
     * @param {Piece} piece - The rook piece
     * @param {number} position - Current position index (0-63)
     * @returns {Array} Array of move objects
     */
    generateRookMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        // Validate position
        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        // Rook movement directions: up, down, left, right
        const directions = [
            -8, // Up (rank decrease)
            8, // Down (rank increase)
            -1, // Left (file decrease)
            1, // Right (file increase)
        ];

        // Generate moves in each direction
        for (const direction of directions) {
            let currentSquare = position + direction;

            // Continue sliding in this direction until obstruction or board edge
            while (this.isValidSquare(currentSquare)) {
                // Check for horizontal wrapping (left/right movement)
                if (direction === -1 || direction === 1) {
                    if (!this.isValidHorizontalMove(position, currentSquare)) {
                        break; // Stop if move would wrap around board
                    }
                }

                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    // Empty square - add normal move
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
                    // Square occupied by a piece
                    if (targetPiece.getColor() !== color) {
                        // Enemy piece - can capture
                        moves.push({
                            from: position,
                            to: currentSquare,
                            type: 'capture',
                            piece: piece.getType(),
                            color: color,
                            captured: targetPiece.getType(),
                        });
                    }
                    // Stop sliding in this direction (whether friendly or enemy piece)
                    break;
                }

                // Move to next square in this direction
                currentSquare += direction;
            }
        }

        return moves;
    }

    /**
     * Generate pseudo-legal moves for bishops.
     * Handles diagonal sliding movement with obstruction detection.
     *
     * @param {Piece} piece - The bishop piece
     * @param {number} position - Current position index (0-63)
     * @returns {Array} Array of move objects
     */
    generateBishopMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        // Validate position
        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        // Bishop movement directions: NE, NW, SE, SW
        const directions = [
            -9, // Up-Left (NW)
            -7, // Up-Right (NE)
            7, // Down-Left (SW)
            9, // Down-Right (SE)
        ];

        // Generate moves in each diagonal direction
        for (const direction of directions) {
            let currentSquare = position + direction;

            // Continue sliding in this direction until obstruction or board edge
            while (this.isValidSquare(currentSquare)) {
                // Check for diagonal wrapping
                if (!this.isValidDiagonalMove(position, currentSquare)) {
                    break; // Stop if move would wrap around board
                }

                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    // Empty square - add normal move
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
                    // Square occupied by a piece
                    if (targetPiece.getColor() !== color) {
                        // Enemy piece - can capture
                        moves.push({
                            from: position,
                            to: currentSquare,
                            type: 'capture',
                            piece: piece.getType(),
                            color: color,
                            captured: targetPiece.getType(),
                        });
                    }
                    // Stop sliding in this direction (whether friendly or enemy piece)
                    break;
                }

                // Move to next square in this direction
                currentSquare += direction;
            }
        }

        return moves;
    }

    /**
     * Generate pseudo-legal moves for knights.
     * Handles the "L-shaped" movement pattern.
     *
     * @param {Piece} piece - The knight piece
     * @param {number} position - Current position index (0-63)
     * @returns {Array} Array of move objects
     */
    generateKnightMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        // Validate position
        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        // Knight movement offsets (L-shapes)
        const directions = [-17, -15, -10, -6, 6, 10, 15, 17];

        for (const direction of directions) {
            const currentSquare = position + direction;

            // Check if the target square is on the board and the move is valid
            if (
                this.isValidSquare(currentSquare) &&
                this.isValidKnightMove(position, currentSquare)
            ) {
                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    // Empty square - add normal move
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
                    // Square occupied - can capture if it's an enemy piece
                    if (targetPiece.getColor() !== color) {
                        moves.push({
                            from: position,
                            to: currentSquare,
                            type: 'capture',
                            piece: piece.getType(),
                            color: color,
                            captured: targetPiece.getType(),
                        });
                    }
                }
            }
        }

        return moves;
    }

    /**
     * Generate pseudo-legal moves for the king.
     * Handles single-square movement in all 8 directions.
     * (Does not yet handle castling or check prevention).
     *
     * @param {Piece} piece - The king piece
     * @param {number} position - Current position index (0-63)
     * @returns {Array} Array of move objects
     */
    generateKingMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        // Validate position
        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        // King movement directions (all 8 surrounding squares)
        const directions = [-9, -8, -7, -1, 1, 7, 8, 9];

        for (const direction of directions) {
            const currentSquare = position + direction;

            // Check if the target square is on the board and the move is valid
            if (
                this.isValidSquare(currentSquare) &&
                this.isValidKingMove(position, currentSquare)
            ) {
                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    // Empty square - add normal move
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
                    // Square occupied - can capture if it's an enemy piece
                    if (targetPiece.getColor() !== color) {
                        moves.push({
                            from: position,
                            to: currentSquare,
                            type: 'capture',
                            piece: piece.getType(),
                            color: color,
                            captured: targetPiece.getType(),
                        });
                    }
                }
            }
        }

        return moves;
    }

    /**
     * Generate pseudo-legal moves for the queen.
     * Combines the move sets of a rook and a bishop.
     *
     * @param {Piece} piece - The queen piece
     * @param {number} position - Current position index (0-63)
     * @returns {Array} Array of move objects
     */
    generateQueenMoves(piece, position) {
        // A queen's power is the sum of a rook's and a bishop's
        const rookMoves = this.generateRookMoves(piece, position);
        const bishopMoves = this.generateBishopMoves(piece, position);

        return [...rookMoves, ...bishopMoves];
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

    /**
     * Check if a horizontal move is valid (doesn't wrap around board edges)
     * @param {number} fromSquare - Starting square
     * @param {number} toSquare - Target square
     * @returns {boolean} True if valid horizontal move, false otherwise
     */
    isValidHorizontalMove(fromSquare, toSquare) {
        const fromRank = Math.floor(fromSquare / 8);
        const toRank = Math.floor(toSquare / 8);

        // Horizontal moves must stay on the same rank
        return fromRank === toRank;
    }

    /**
     * Check if a diagonal move is valid (doesn't wrap around board edges)
     * @param {number} fromSquare - Starting square
     * @param {number} toSquare - Target square
     * @returns {boolean} True if valid diagonal move, false otherwise
     */
    isValidDiagonalMove(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const fromRank = Math.floor(fromSquare / 8);
        const toFile = toSquare % 8;
        const toRank = Math.floor(toSquare / 8);

        // Calculate file and rank differences
        const fileDiff = Math.abs(toFile - fromFile);
        const rankDiff = Math.abs(toRank - fromRank);

        // Valid diagonal move: file and rank differences must be equal
        return fileDiff === rankDiff;
    }

    /**
     * Check if a knight move is valid (doesn't wrap around board edges).
     * @param {number} fromSquare - Starting square index.
     * @param {number} toSquare - Target square index.
     * @returns {boolean} True if the move is a valid L-shape, false otherwise.
     */
    isValidKnightMove(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const toFile = toSquare % 8;
        const fileDiff = Math.abs(fromFile - toFile);

        // A knight's move should not wrap around the board.
        // The file difference for a valid knight move will always be 1 or 2.
        // A larger difference indicates a wrap-around.
        return fileDiff === 1 || fileDiff === 2;
    }

    /**
     * Check if a king move is valid (doesn't wrap around board edges).
     * @param {number} fromSquare - Starting square index.
     * @param {number} toSquare - Target square index.
     * @returns {boolean} True if the move is valid, false otherwise.
     */
    isValidKingMove(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const toFile = toSquare % 8;
        const fileDiff = Math.abs(fromFile - toFile);

        // A king's move should not wrap around the board.
        // The file difference for a valid king move will always be 0 or 1.
        return fileDiff <= 1;
    }
}