// tests/core/MoveValidator.test.js

import { MoveValidator } from '../../src/core/MoveValidator.js';
import { Board } from '../../src/core/Board.js';
import { GameState } from '../../src/core/GameState.js';
import { Piece } from '../../src/core/Piece.js';

describe('MoveValidator', () => {
    let board;
    let gameState;
    let moveValidator;

    beforeEach(() => {
        board = new Board();
        gameState = new GameState();
        moveValidator = new MoveValidator(board, gameState);
    });

    describe('Basic Move Validation', () => {
        test('should validate basic pawn move', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[52] = whitePawn;
            board.squares[60] = whiteKing;
            board.squares[4] = blackKing;

            const isValid = moveValidator.isValidMove(52, 44);
            expect(isValid).toBe(true);
        });

        test('should reject move when no piece at source', () => {
            const isValid = moveValidator.isValidMove(12, 20);
            expect(isValid).toBe(false);
        });

        test('should reject move when wrong player turn', () => {
            const blackPawn = new Piece('pawn', 'black', 1, '♟');
            board.squares[12] = blackPawn;

            const isValid = moveValidator.isValidMove(12, 20);
            expect(isValid).toBe(false);
        });

        test('should reject invalid positions', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            board.squares[12] = whitePawn;

            expect(moveValidator.isValidMove(-1, 20)).toBe(false);
            expect(moveValidator.isValidMove(12, 64)).toBe(false);
            expect(moveValidator.isValidMove(100, 20)).toBe(false);
        });

        test('should validate rook move', () => {
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[28] = whiteRook;
            board.squares[60] = whiteKing;
            board.squares[4] = blackKing;

            const isValid = moveValidator.isValidMove(28, 36);
            expect(isValid).toBe(true);
        });

        test('should reject pseudo-illegal moves', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            board.squares[52] = whitePawn;

            const isValid = moveValidator.isValidMove(52, 53);
            expect(isValid).toBe(false);
        });
    });

    describe('Check Detection', () => {
        test('should detect check from rook', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[60] = blackRook;

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should detect check from bishop', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackBishop = new Piece('bishop', 'black', 3, '♝');

            board.squares[4] = whiteKing;
            board.squares[32] = blackBishop;

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should detect check from knight', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKnight = new Piece('knight', 'black', 3, '♞');

            board.squares[28] = whiteKing;
            board.squares[43] = blackKnight;

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should detect check from pawn', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackPawn = new Piece('pawn', 'black', 1, '♟');

            board.squares[28] = whiteKing;
            board.squares[35] = blackPawn;

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should not detect check when king is safe', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[56] = blackRook;

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(false);
        });

        test('should return false for isInCheck when king not found', () => {
            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(false);
        });
    });

    describe('Self-Check Prevention', () => {
        test('should prevent move that exposes king to check', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[12] = whiteRook;
            board.squares[60] = blackRook;

            const isValid = moveValidator.isValidMove(12, 13);
            expect(isValid).toBe(false);
        });

        test('should allow move that does not expose king', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[4] = whiteKing;
            board.squares[56] = whiteRook;
            board.squares[60] = blackKing;

            const isValid = moveValidator.isValidMove(56, 48);
            expect(isValid).toBe(true);
        });

        test('should prevent king from moving into check', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[59] = blackRook;

            const isValid = moveValidator.isValidMove(4, 3);
            expect(isValid).toBe(false);
        });
    });

    describe('Checkmate Detection', () => {
        test('should detect back rank mate', () => {
            // Classic back-rank mate setup
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');
            const blackRook = new Piece('rook', 'black', 5, '♜');
            const whitePawn1 = new Piece('pawn', 'white', 1, '♙');
            const whitePawn2 = new Piece('pawn', 'white', 1, '♙');
            const whitePawn3 = new Piece('pawn', 'white', 1, '♙');

            board.squares[60] = whiteKing;  // e1
            board.squares[6] = blackKing;   // g8
            board.squares[61] = blackRook;  // f1
            board.squares[52] = whitePawn1; // e2
            board.squares[53] = whitePawn2; // f2
            board.squares[54] = whitePawn3; // g2

            gameState.setCurrentPlayer('black');
            moveValidator = new MoveValidator(board, gameState);
            board.movePiece(61, 60); // Black moves rook to capture, but we just set it up

            gameState.setCurrentPlayer('white');
            moveValidator = new MoveValidator(board, gameState);
            
            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(true);
        });

        test('should not detect checkmate when escape move exists', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[60] = blackRook;

            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(false);
        });

        test('should not detect checkmate when not in check', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            board.squares[4] = whiteKing;

            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(false);
        });

        test('should not detect checkmate when check can be blocked', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');
            const whiteRook = new Piece('rook', 'white', 5, '♖');

            board.squares[4] = whiteKing;
            board.squares[60] = blackRook;
            board.squares[56] = whiteRook;

            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(false);
        });
    });

    describe('Stalemate Detection', () => {
        test('should detect stalemate when no legal moves but not in check', () => {
            // Classic stalemate setup
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');
            const blackQueen = new Piece('queen', 'black', 9, '♛');

            board.squares[0] = whiteKing;   // a8
            board.squares[26] = blackKing;  // c6
            board.squares[18] = blackQueen; // c7

            const isStalemate = moveValidator.isStalemate('white');
            expect(isStalemate).toBe(true);
        });

        test('should not detect stalemate when in check', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[60] = blackRook;

            const isStalemate = moveValidator.isStalemate('white');
            expect(isStalemate).toBe(false);
        });

        test('should not detect stalemate when legal moves exist', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[28] = whiteKing;
            board.squares[60] = blackKing;

            const isStalemate = moveValidator.isStalemate('white');
            expect(isStalemate).toBe(false);
        });
    });

    describe('Helper Methods', () => {
        test('isValidPosition should validate square indices correctly', () => {
            expect(moveValidator.isValidPosition(0)).toBe(true);
            expect(moveValidator.isValidPosition(63)).toBe(true);
            expect(moveValidator.isValidPosition(32)).toBe(true);
            expect(moveValidator.isValidPosition(-1)).toBe(false);
            expect(moveValidator.isValidPosition(64)).toBe(false);
            expect(moveValidator.isValidPosition(100)).toBe(false);
        });

        test('findKing should locate king correctly', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[4] = whiteKing;
            board.squares[60] = blackKing;

            expect(moveValidator.findKing('white')).toBe(4);
            expect(moveValidator.findKing('black')).toBe(60);
            expect(moveValidator.findKing('nonexistent')).toBe(-1);
        });

        test('getAllPiecesOfColor should return all pieces of specified color', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackPawn = new Piece('pawn', 'black', 1, '♟');

            board.squares[12] = whitePawn;
            board.squares[0] = whiteRook;
            board.squares[52] = blackPawn;

            const whitePieces = moveValidator.getAllPiecesOfColor('white');
            const blackPieces = moveValidator.getAllPiecesOfColor('black');

            expect(whitePieces).toHaveLength(2);
            expect(blackPieces).toHaveLength(1);
            expect(whitePieces[0].position).toBe(0);
            expect(whitePieces[1].position).toBe(12);
            expect(blackPieces[0].position).toBe(52);
        });

        test('getAllLegalMoves should return only legal moves', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing;
            board.squares[12] = whiteRook;
            board.squares[60] = blackRook;

            const legalMoves = moveValidator.getAllLegalMoves('white');

            expect(legalMoves.length).toBeGreaterThan(0);

            const horizontalRookMoves = legalMoves.filter(
                (move) => move.from === 12 && Math.floor(move.to / 8) === Math.floor(12 / 8)
            );
            expect(horizontalRookMoves).toHaveLength(0);
        });

        test('createBoardCopy should preserve piece states', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            whitePawn.markAsMoved();
            board.squares[12] = whitePawn;

            const boardCopy = moveValidator.createBoardCopy();

            expect(boardCopy.squares[12]).not.toBe(whitePawn);
            expect(boardCopy.squares[12].getType()).toBe('pawn');
            expect(boardCopy.squares[12].getColor()).toBe('white');
            expect(boardCopy.squares[12].getHasMoved()).toBe(true);
        });
    });

    describe('Integration Tests', () => {
        test('should handle complex position with multiple pieces', () => {
            board.setupInitialBoard();

            board.movePiece(52, 36);
            board.movePiece(12, 28);

            gameState.switchPlayer();

            const isValid = moveValidator.isValidMove(62, 45);
            expect(isValid).toBe(true);
        });

        test('should correctly validate game state transitions', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');
            const whitePawn = new Piece('pawn', 'white', 1, '♙');

            board.squares[4] = whiteKing;
            board.squares[60] = blackKing;
            board.squares[52] = whitePawn;

            expect(moveValidator.isValidMove(52, 44)).toBe(true);

            gameState.switchPlayer();

            expect(moveValidator.isValidMove(52, 44)).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty board gracefully', () => {
            expect(moveValidator.isInCheck('white')).toBe(false);
            expect(moveValidator.getAllLegalMoves('white')).toEqual([]);
            expect(moveValidator.isCheckmate('white')).toBe(false);
            expect(moveValidator.isStalemate('white')).toBe(true);
        });

        test('should handle board with only kings', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[4] = whiteKing;
            board.squares[60] = blackKing;

            expect(moveValidator.isInCheck('white')).toBe(false);
            expect(moveValidator.isCheckmate('white')).toBe(false);
            expect(moveValidator.getAllLegalMoves('white').length).toBeGreaterThan(0);
        });

        test('should handle piece at board boundaries correctly', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[0] = whiteKing;
            board.squares[63] = blackKing;

            const legalMoves = moveValidator.getAllLegalMoves('white');
            expect(legalMoves.length).toBe(3);

            legalMoves.forEach((move) => {
                expect(move.to).toBeGreaterThanOrEqual(0);
                expect(move.to).toBeLessThan(64);
            });
        });
    });
});