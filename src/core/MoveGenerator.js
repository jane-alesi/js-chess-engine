export class MoveGenerator {
    constructor(board) {
        this.board = board;
    }

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

    generatePawnMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        const direction = color === 'white' ? 8 : -8;
        const currentRank = Math.floor(position / 8);

        // Fix starting rank detection based on actual test positions
        // Tests use position 12 for white (rank 1) and position 52 for black (rank 6)
        const isOnStartingRank =
            (color === 'white' && currentRank === 1) || (color === 'black' && currentRank === 6);

        const oneSquareForward = position + direction;
        if (this.isValidSquare(oneSquareForward) && !this.board.squares[oneSquareForward]) {
            moves.push({
                from: position,
                to: oneSquareForward,
                type: 'normal',
                piece: piece.getType(),
                color: color,
            });

            if (isOnStartingRank) {
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

        const captureOffsets = color === 'white' ? [7, 9] : [-9, -7];

        for (const offset of captureOffsets) {
            const captureSquare = position + offset;

            if (
                this.isValidSquare(captureSquare) &&
                this.isValidPawnCapture(position, captureSquare)
            ) {
                const targetPiece = this.board.squares[captureSquare];

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

    generateRookMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        const directions = [-8, 8, -1, 1];

        for (const direction of directions) {
            let currentSquare = position + direction;

            while (this.isValidSquare(currentSquare)) {
                if (direction === -1 || direction === 1) {
                    if (!this.isValidHorizontalMove(position, currentSquare)) {
                        break;
                    }
                }

                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
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
                    break;
                }

                currentSquare += direction;
            }
        }

        return moves;
    }

    generateBishopMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        const directions = [-9, -7, 7, 9];

        for (const direction of directions) {
            let currentSquare = position + direction;

            while (this.isValidSquare(currentSquare)) {
                if (!this.isValidDiagonalMove(position, currentSquare)) {
                    break;
                }

                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
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
                    break;
                }

                currentSquare += direction;
            }
        }

        return moves;
    }

    generateKnightMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        const directions = [-17, -15, -10, -6, 6, 10, 15, 17];

        for (const direction of directions) {
            const currentSquare = position + direction;

            if (
                this.isValidSquare(currentSquare) &&
                this.isValidKnightMove(position, currentSquare)
            ) {
                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
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

    generateKingMoves(piece, position) {
        const moves = [];
        const color = piece.getColor();

        if (position < 0 || position >= 64) {
            throw new Error(`Invalid position: ${position} must be between 0 and 63`);
        }

        const directions = [-9, -8, -7, -1, 1, 7, 8, 9];

        for (const direction of directions) {
            const currentSquare = position + direction;

            if (
                this.isValidSquare(currentSquare) &&
                this.isValidKingMove(position, currentSquare)
            ) {
                const targetPiece = this.board.squares[currentSquare];

                if (!targetPiece) {
                    moves.push({
                        from: position,
                        to: currentSquare,
                        type: 'normal',
                        piece: piece.getType(),
                        color: color,
                    });
                } else {
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

    generateQueenMoves(piece, position) {
        const rookMoves = this.generateRookMoves(piece, position);
        const bishopMoves = this.generateBishopMoves(piece, position);

        return [...rookMoves, ...bishopMoves];
    }

    isValidSquare(square) {
        return square >= 0 && square < 64;
    }

    isValidPawnCapture(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const toFile = toSquare % 8;

        return Math.abs(fromFile - toFile) === 1;
    }

    isValidHorizontalMove(fromSquare, toSquare) {
        const fromRank = Math.floor(fromSquare / 8);
        const toRank = Math.floor(toSquare / 8);

        return fromRank === toRank;
    }

    isValidDiagonalMove(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const fromRank = Math.floor(fromSquare / 8);
        const toFile = toSquare % 8;
        const toRank = Math.floor(toSquare / 8);

        const fileDiff = Math.abs(toFile - fromFile);
        const rankDiff = Math.abs(toRank - fromRank);

        return fileDiff === rankDiff;
    }

    isValidKnightMove(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const toFile = toSquare % 8;
        const fileDiff = Math.abs(fromFile - toFile);

        return fileDiff === 1 || fileDiff === 2;
    }

    isValidKingMove(fromSquare, toSquare) {
        const fromFile = fromSquare % 8;
        const toFile = toSquare % 8;
        const fileDiff = Math.abs(fromFile - toFile);

        return fileDiff <= 1;
    }
}
