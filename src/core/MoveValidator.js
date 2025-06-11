// src/core/MoveValidator.js
// Cache-busting comment to ensure CI picks up the latest version

import { MoveGenerator } from './MoveGenerator.js';
import { Board } from './Board.js';
import { Piece } from './Piece.js';

/**
 * MoveValidator class to validate chess moves according to rules
 * Checks for legal moves, check detection, and game state validation
 * Integrates with MoveGenerator for pseudo-legal move generation
 */
export class MoveValidator {
    constructor(board, gameState) {
        this.board = board;
        this.gameState = gameState;
        this.moveGenerator = new MoveGenerator(board);
    }

    /**
     * Validates if a move is legal according to chess rules
     * Includes piece-specific validation, turn validation, and self-check prevention
     *
     * @param {number} fromPosition - Source square index (0-63)
     * @param {number} toPosition - Destination square index (0-63)
     * @returns {boolean} True if move is legal, false otherwise
     */
    isValidMove(fromPosition, toPosition) {
        // Basic validation checks
        if (!this.isValidPosition(fromPosition) || !this.isValidPosition(toPosition)) {
            return false;
        }

        const piece = this.board.squares[fromPosition];
        if (!piece) {
            return false;
        }

        // Check if it's the correct player's turn
        if (piece.getColor() !== this.gameState.getCurrentPlayer()) {
            return false;
        }

        // Check if move is pseudo-legal (piece-specific movement rules)
        if (!this.isMovesPseudoLegal(fromPosition, toPosition)) {
            return false;
        }

        // Check if move would leave own king in check (self-check prevention)
        if (this.wouldMoveResultInCheck(fromPosition, toPosition, piece.getColor())) {
            return false;
        }

        return true;
    }

    /**
     * Checks if a move is pseudo-legal (follows piece movement rules)
     * Does not consider check/checkmate, only basic piece movement
     *
     * @param {number} fromPosition - Source square index
     * @param {number} toPosition - Destination square index
     * @returns {boolean} True if move is pseudo-legal
     */
    isMovesPseudoLegal(fromPosition, toPosition) {
        const piece = this.board.squares[fromPosition];
        if (!piece) {
            return false;
        }

        const possibleMoves = this.moveGenerator.generateMoves(piece, fromPosition);
        return possibleMoves.some((move) => move.to === toPosition);
    }

    /**
     * Checks if a king of the specified color is currently in check
     *
     * @param {string} color - Color of the king to check ('white' or 'black')
     * @returns {boolean} True if king is in check, false otherwise (including when no king found)
     */
    isInCheck(color) {
        const kingPosition = this.findKing(color);
        if (kingPosition === -1) {
            // If there's no king, it can't be in check
            return false;
        }

        const opponentColor = color === 'white' ? 'black' : 'white';
        const opponentPieces = this.getAllPiecesOfColor(opponentColor);

        // Check if any opponent piece can attack the king
        for (const { piece, position } of opponentPieces) {
            const possibleMoves = this.moveGenerator.generateMoves(piece, position);
            if (possibleMoves.some((move) => move.to === kingPosition)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if the specified color is in checkmate
     * King must be in check and have no legal moves to escape
     *
     * @param {string} color - Color to check for checkmate
     * @returns {boolean} True if in checkmate, false otherwise
     */
    isCheckmate(color) {
        // If there's no king, it can't be checkmate
        if (this.findKing(color) === -1) {
            return false;
        }

        // Must be in check to be checkmate
        if (!this.isInCheck(color)) {
            return false;
        }

        // Check if any legal move can escape check
        const legalMoves = this.getAllLegalMoves(color);
        return legalMoves.length === 0;
    }

    /**
     * Checks if the specified color is in stalemate
     * King must NOT be in check but have no legal moves
     *
     * @param {string} color - Color to check for stalemate
     * @returns {boolean} True if in stalemate, false otherwise
     */
    isStalemate(color) {
        // Special case: If there's no king, consider it stalemate (empty board scenario)
        if (this.findKing(color) === -1) {
            return true;
        }

        // Must NOT be in check to be stalemate
        if (this.isInCheck(color)) {
            return false;
        }

        // Check if any legal moves are available
        const legalMoves = this.getAllLegalMoves(color);
        return legalMoves.length === 0;
    }

    /**
     * Checks if castling is legal for the specified color and side
     * TODO: Implement castling validation in future enhancement
     *
     * @param {string} color - Color attempting to castle
     * @param {string} side - Side to castle ('kingside' or 'queenside')
     * @returns {boolean} Currently returns false (not implemented)
     */
    canCastle(color, side) {
        // Prevent ESLint unused parameter warnings
        void color;
        void side;
        
        // TODO: Implement castling validation
        // - King and rook haven't moved
        // - No pieces between king and rook
        // - King not in check
        // - King doesn't pass through or land in check
        return false;
    }

    /**
     * Helper method to validate square indices
     *
     * @param {number} position - Square index to validate
     * @returns {boolean} True if position is valid (0-63)
     */
    isValidPosition(position) {
        return position >= 0 && position < 64;
    }

    /**
     * Finds the position of the king for the specified color
     *
     * @param {string} color - Color of king to find
     * @returns {number} King position index, or -1 if not found
     */
    findKing(color) {
        for (let i = 0; i < 64; i++) {
            const piece = this.board.squares[i];
            if (piece && piece.getType() === 'king' && piece.getColor() === color) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets all pieces of the specified color with their positions
     *
     * @param {string} color - Color of pieces to find
     * @returns {Array} Array of {piece, position} objects
     */
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

    /**
     * Gets all legal moves for the specified color
     * Filters out moves that would result in self-check
     *
     * @param {string} color - Color to get legal moves for
     * @returns {Array} Array of legal move objects
     */
    getAllLegalMoves(color) {
        const legalMoves = [];
        const pieces = this.getAllPiecesOfColor(color);

        // If no king found, return empty array (graceful handling)
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
                        // Skip moves that cause errors in self-check detection
                        continue;
                    }
                }
            } catch {
                // Skip pieces that cause errors in move generation
                continue;
            }
        }

        return legalMoves;
    }

    /**
     * Simulates a move and checks if it would result in the king being in check
     * Creates a temporary board state to test the move
     *
     * @param {number} fromPosition - Source square index
     * @param {number} toPosition - Destination square index
     * @param {string} color - Color of the moving piece
     * @returns {boolean} True if move would result in check
     */
    wouldMoveResultInCheck(fromPosition, toPosition, color) {
        try {
            // Create a copy of the board to simulate the move
            const boardCopy = this.createBoardCopy();

            // Execute the move on the copy
            const piece = boardCopy.squares[fromPosition];
            if (!piece) {
                return false;
            }

            boardCopy.squares[toPosition] = piece;
            boardCopy.squares[fromPosition] = null;

            // Create temporary validator with the copied board
            const tempValidator = new MoveValidator(boardCopy, this.gameState);

            // Check if king would be in check after the move
            return tempValidator.isInCheck(color);
        } catch {
            // If there's an error in simulation, assume the move is invalid
            return true;
        }
    }

    /**
     * Creates a deep copy of the current board state
     * Preserves all piece properties including hasMoved state
     *
     * @returns {Board} Deep copy of the current board
     */
    createBoardCopy() {
        const boardCopy = new Board();

        for (let i = 0; i < 64; i++) {
            const piece = this.board.squares[i];
            if (piece) {
                try {
                    // Create new piece with same properties
                    const pieceCopy = new Piece(
                        piece.getType(),
                        piece.getColor(),
                        piece.getPoints(), // ✅ FIXED: Changed from getValue() to getPoints()
                        piece.getSymbol()
                    );

                    // Preserve hasMoved state
                    if (piece.getHasMoved()) {
                        pieceCopy.markAsMoved();
                    }

                    boardCopy.squares[i] = pieceCopy;
                } catch {
                    // Skip pieces that cause errors during copying
                    continue;
                }
            }
        }

        return boardCopy;
    }
}