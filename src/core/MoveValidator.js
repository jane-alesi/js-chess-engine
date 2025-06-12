import { MoveGenerator } from './MoveGenerator.js';
import { Board } from './Board.js';
import { Piece } from './Piece.js';

export class MoveValidator {
    constructor(board, gameState) {
        this.board = board;
        this.gameState = gameState;
        this.moveGenerator = new MoveGenerator(board);
    }

    isValidMove(fromPosition, toPosition) {
        try {
            if (!this.isValidPosition(fromPosition) || !this.isValidPosition(toPosition)) {
                return false;
            }

            const piece = this.board.squares[fromPosition];
            if (!piece) {
                return false;
            }

            const currentPlayer = this.gameState ? this.gameState.getCurrentPlayer() : 'white';
            if (piece.getColor() !== currentPlayer) {
                return false;
            }

            if (!this.isMovesPseudoLegal(fromPosition, toPosition)) {
                return false;
            }

            if (this.wouldMoveResultInCheck(fromPosition, toPosition, piece.getColor())) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    isMovesPseudoLegal(fromPosition, toPosition) {
        try {
            const piece = this.board.squares[fromPosition];
            if (!piece) {
                return false;
            }

            const possibleMoves = this.moveGenerator.generateMoves(piece, fromPosition);
            return possibleMoves.some((move) => move.to === toPosition);
        } catch {
            return false;
        }
    }

    isInCheck(color) {
        try {
            const kingPosition = this.findKing(color);
            if (kingPosition === -1) {
                return false;
            }

            const opponentColor = color === 'white' ? 'black' : 'white';
            const opponentPieces = this.getAllPiecesOfColor(opponentColor);

            for (const { piece, position } of opponentPieces) {
                try {
                    const possibleMoves = this.moveGenerator.generateMoves(piece, position);
                    if (possibleMoves.some((move) => move.to === kingPosition)) {
                        return true;
                    }
                } catch {
                    continue;
                }
            }

            return false;
        } catch {
            return false;
        }
    }

    isCheckmate(color) {
        try {
            if (this.findKing(color) === -1) {
                return false;
            }

            if (!this.isInCheck(color)) {
                return false;
            }

            const legalMoves = this.getAllLegalMoves(color);
            return legalMoves.length === 0;
        } catch {
            return false;
        }
    }

    isStalemate(color) {
        try {
            const kingPosition = this.findKing(color);

            if (kingPosition === -1) {
                const pieces = this.getAllPiecesOfColor(color);
                return pieces.length === 0;
            }

            if (this.isInCheck(color)) {
                return false;
            }

            const legalMoves = this.getAllLegalMoves(color);
            return legalMoves.length === 0;
        } catch {
            return false;
        }
    }

    canCastle(_color, _side) {
        return false;
    }

    isValidPosition(position) {
        return position >= 0 && position < 64;
    }

    findKing(color) {
        for (let i = 0; i < 64; i++) {
            const piece = this.board.squares[i];
            if (piece && piece.getType() === 'king' && piece.getColor() === color) {
                return i;
            }
        }
        return -1;
    }

    getAllPiecesOfColor(color) {
        const pieces = [];
        for (let i = 0; i < 64; i++) {
            const piece = this.board.squares[i];
            if (piece && piece.getColor() === color) {
                pieces.push({ piece, position: i });
            }
        }
        return pieces;
    }

    getAllLegalMoves(color) {
        const legalMoves = [];
        const pieces = this.getAllPiecesOfColor(color);

        if (this.findKing(color) === -1) {
            return [];
        }

        for (const { piece, position } of pieces) {
            try {
                const pseudoLegalMoves = this.moveGenerator.generateMoves(piece, position);

                for (const move of pseudoLegalMoves) {
                    try {
                        if (!this.wouldMoveResultInCheck(move.from, move.to, color)) {
                            legalMoves.push(move);
                        }
                    } catch {
                        continue;
                    }
                }
            } catch {
                continue;
            }
        }

        return legalMoves;
    }

    wouldMoveResultInCheck(fromPosition, toPosition, color) {
        try {
            const boardCopy = this.createBoardCopy();

            const piece = boardCopy.squares[fromPosition];
            if (!piece) {
                return false;
            }

            boardCopy.squares[toPosition] = piece;
            boardCopy.squares[fromPosition] = null;

            const tempValidator = new MoveValidator(boardCopy, this.gameState);

            return tempValidator.isInCheck(color);
        } catch {
            return true;
        }
    }

    createBoardCopy() {
        const boardCopy = new Board();

        for (let i = 0; i < 64; i++) {
            const piece = this.board.squares[i];
            if (piece) {
                try {
                    const pieceCopy = new Piece(
                        piece.getType(),
                        piece.getColor(),
                        piece.getPoints(),
                        piece.getSymbol()
                    );

                    if (piece.getHasMoved()) {
                        pieceCopy.markAsMoved();
                    }

                    boardCopy.squares[i] = pieceCopy;
                } catch {
                    continue;
                }
            }
        }

        return boardCopy;
    }
}
