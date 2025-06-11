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
            // Place white pawn on e2 (index 12) and add kings for proper validation
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[12] = whitePawn; // e2
            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackKing; // e8

            const isValid = moveValidator.isValidMove(12, 20); // e2 to e3
            expect(isValid).toBe(true);
        });

        test('should reject move when no piece at source', () => {
            const isValid = moveValidator.isValidMove(12, 20);
            expect(isValid).toBe(false);
        });

        test('should reject move when wrong player turn', () => {
            // Place black pawn but white's turn
            const blackPawn = new Piece('pawn', 'black', 1, '♟');
            board.squares[52] = blackPawn;

            const isValid = moveValidator.isValidMove(52, 44); // e7 to e6
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
            // Add kings to prevent self-check validation errors
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[28] = whiteRook; // e4
            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackKing; // e8

            const isValid = moveValidator.isValidMove(28, 36); // e4 to e5
            expect(isValid).toBe(true);
        });

        test('should reject pseudo-illegal moves', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            board.squares[12] = whitePawn; // e2

            // Pawn can't move sideways
            const isValid = moveValidator.isValidMove(12, 13); // e2 to f2
            expect(isValid).toBe(false);
        });
    });

    describe('Check Detection', () => {
        test('should detect check from rook', () => {
            // Place white king on e1 and black rook on e8
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackRook; // e8

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should detect check from bishop', () => {
            // Place white king on e1 and black bishop on a5
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackBishop = new Piece('bishop', 'black', 3, '♝');

            board.squares[4] = whiteKing; // e1
            board.squares[32] = blackBishop; // a5

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should detect check from knight', () => {
            // Place white king on e4 and black knight on d6
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKnight = new Piece('knight', 'black', 3, '♞');

            board.squares[28] = whiteKing; // e4
            board.squares[43] = blackKnight; // d6

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should detect check from pawn', () => {
            // Place white king on e4 and black pawn on d5
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackPawn = new Piece('pawn', 'black', 1, '♟');

            board.squares[28] = whiteKing; // e4
            board.squares[35] = blackPawn; // d5

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(true);
        });

        test('should not detect check when king is safe', () => {
            // Place white king on e1 and black rook on a8 (not attacking)
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[56] = blackRook; // a8

            const inCheck = moveValidator.isInCheck('white');
            expect(inCheck).toBe(false);
        });

        test('should throw error when king not found', () => {
            expect(() => {
                moveValidator.isInCheck('white');
            }).toThrow('No white king found on the board');
        });
    });

    describe('Self-Check Prevention', () => {
        test('should prevent move that exposes king to check', () => {
            // Set up pinned piece scenario
            // White king on e1, white rook on e2, black rook on e8
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[12] = whiteRook; // e2
            board.squares[60] = blackRook; // e8

            // White rook on e2 is pinned and cannot move sideways
            const isValid = moveValidator.isValidMove(12, 13); // e2 to f2
            expect(isValid).toBe(false);
        });

        test('should allow move that does not expose king', () => {
            // White king on e1, white rook on a1 (not pinned)
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const whiteRook = new Piece('rook', 'white', 5, '♖');

            board.squares[4] = whiteKing; // e1
            board.squares[56] = whiteRook; // a1

            // Rook can move freely
            const isValid = moveValidator.isValidMove(56, 48); // a1 to a2
            expect(isValid).toBe(true);
        });

        test('should prevent king from moving into check', () => {
            // White king on e1, black rook on d8 (not on same file)
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[59] = blackRook; // d8

            // King cannot move to d1 (would be in check from rook on d8)
            const isValid = moveValidator.isValidMove(4, 3); // e1 to d1
            expect(isValid).toBe(false);
        });
    });

    describe('Checkmate Detection', () => {
        test('should detect back rank mate', () => {
            // Classic back rank mate: white king on g1, black rook on g8, white pawns on f2, g2, h2
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');
            const whitePawn1 = new Piece('pawn', 'white', 1, '♙');
            const whitePawn2 = new Piece('pawn', 'white', 1, '♙');
            const whitePawn3 = new Piece('pawn', 'white', 1, '♙');

            board.squares[6] = whiteKing; // g1
            board.squares[62] = blackRook; // g8
            board.squares[13] = whitePawn1; // f2
            board.squares[14] = whitePawn2; // g2
            board.squares[15] = whitePawn3; // h2

            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(true);
        });

        test('should not detect checkmate when escape move exists', () => {
            // King in check but can escape
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackRook; // e8

            // King can move to d1, f1, etc.
            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(false);
        });

        test('should not detect checkmate when not in check', () => {
            // King not in check
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            board.squares[4] = whiteKing; // e1

            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(false);
        });

        test('should not detect checkmate when check can be blocked', () => {
            // King in check but can be blocked by another piece
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');
            const whiteRook = new Piece('rook', 'white', 5, '♖');

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackRook; // e8
            board.squares[56] = whiteRook; // a1

            // White rook can block on e2, e3, etc.
            const isCheckmate = moveValidator.isCheckmate('white');
            expect(isCheckmate).toBe(false);
        });
    });

    describe('Stalemate Detection', () => {
        test('should detect stalemate when no legal moves but not in check', () => {
            // King on corner with no legal moves but not in check
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');
            const blackQueen = new Piece('queen', 'black', 9, '♛');

            board.squares[0] = whiteKing; // a1
            board.squares[18] = blackKing; // c3
            board.squares[9] = blackQueen; // b2

            // White king has no legal moves but is not in check
            const isStalemate = moveValidator.isStalemate('white');
            expect(isStalemate).toBe(true);
        });

        test('should not detect stalemate when in check', () => {
            // King in check cannot be stalemate
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackRook; // e8

            const isStalemate = moveValidator.isStalemate('white');
            expect(isStalemate).toBe(false);
        });

        test('should not detect stalemate when legal moves exist', () => {
            // King has legal moves available
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚'); // Add black king to prevent errors

            board.squares[28] = whiteKing; // e4
            board.squares[60] = blackKing; // e8

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

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackKing; // e8

            expect(moveValidator.findKing('white')).toBe(4);
            expect(moveValidator.findKing('black')).toBe(60);
            expect(moveValidator.findKing('nonexistent')).toBe(-1);
        });

        test('getAllPiecesOfColor should return all pieces of specified color', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackPawn = new Piece('pawn', 'black', 1, '♟');

            board.squares[12] = whitePawn; // e2
            board.squares[0] = whiteRook; // a1
            board.squares[52] = blackPawn; // e7

            const whitePieces = moveValidator.getAllPiecesOfColor('white');
            const blackPieces = moveValidator.getAllPiecesOfColor('black');

            expect(whitePieces).toHaveLength(2);
            expect(blackPieces).toHaveLength(1);
            expect(whitePieces[0].position).toBe(0);
            expect(whitePieces[1].position).toBe(12);
            expect(blackPieces[0].position).toBe(52);
        });

        test('getAllLegalMoves should return only legal moves', () => {
            // Set up position where some moves are illegal due to check
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            const blackRook = new Piece('rook', 'black', 5, '♜');

            board.squares[4] = whiteKing; // e1
            board.squares[12] = whiteRook; // e2 (pinned)
            board.squares[60] = blackRook; // e8

            const legalMoves = moveValidator.getAllLegalMoves('white');

            // Should have king moves and legal rook moves (only vertical)
            expect(legalMoves.length).toBeGreaterThan(0);

            // Pinned rook should not have horizontal moves
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

            expect(boardCopy.squares[12]).not.toBe(whitePawn); // Different object
            expect(boardCopy.squares[12].getType()).toBe('pawn');
            expect(boardCopy.squares[12].getColor()).toBe('white');
            expect(boardCopy.squares[12].getHasMoved()).toBe(true);
        });
    });

    describe('Integration Tests', () => {
        test('should handle complex position with multiple pieces', () => {
            // Set up a complex middle game position
            board.setupInitialBoard();

            // Make some moves to create a realistic position
            board.movePiece(12, 28); // e2-e4
            board.movePiece(52, 36); // e7-e5

            gameState.switchPlayer(); // Now black's turn

            // Validate that black can make legal moves
            const isValid = moveValidator.isValidMove(57, 42); // b8-c6 (knight)
            expect(isValid).toBe(true);
        });

        test('should correctly validate game state transitions', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');
            const whitePawn = new Piece('pawn', 'white', 1, '♙');

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackKing; // e8
            board.squares[12] = whitePawn; // e2

            // White's turn - should be able to move pawn
            expect(moveValidator.isValidMove(12, 20)).toBe(true);

            // Switch to black's turn
            gameState.switchPlayer();

            // Now white pieces should not be movable
            expect(moveValidator.isValidMove(12, 20)).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty board gracefully', () => {
            // Test that methods handle missing kings appropriately
            expect(() => moveValidator.isInCheck('white')).toThrow(
                'No white king found on the board'
            );
            expect(moveValidator.getAllLegalMoves('white')).toEqual([]);
            expect(moveValidator.isCheckmate('white')).toBe(false);
            expect(moveValidator.isStalemate('white')).toBe(false);
        });

        test('should handle board with only kings', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚');

            board.squares[4] = whiteKing; // e1
            board.squares[60] = blackKing; // e8

            expect(moveValidator.isInCheck('white')).toBe(false);
            expect(moveValidator.isCheckmate('white')).toBe(false);
            expect(moveValidator.getAllLegalMoves('white').length).toBeGreaterThan(0);
        });

        test('should handle piece at board boundaries correctly', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            const blackKing = new Piece('king', 'black', 1000, '♚'); // Add black king to prevent errors

            board.squares[0] = whiteKing; // a1 (corner)
            board.squares[63] = blackKing; // h8 (opposite corner)

            const legalMoves = moveValidator.getAllLegalMoves('white');
            expect(legalMoves.length).toBe(3); // Only 3 moves from corner

            // All moves should be valid positions
            legalMoves.forEach((move) => {
                expect(move.to).toBeGreaterThanOrEqual(0);
                expect(move.to).toBeLessThan(64);
            });
        });
    });
});
