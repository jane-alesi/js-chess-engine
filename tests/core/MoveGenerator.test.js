// tests/core/MoveGenerator.test.js

import { MoveGenerator } from '../../src/core/MoveGenerator.js';
import { Board } from '../../src/core/Board.js';
import { Piece } from '../../src/core/Piece.js';

describe('MoveGenerator', () => {
    let board;
    let moveGenerator;

    beforeEach(() => {
        board = new Board();
        moveGenerator = new MoveGenerator(board);
    });

    describe('Pawn Move Generation', () => {
        describe('White Pawn Moves', () => {
            test('should generate single forward move for white pawn', () => {
                // Place white pawn on e4 (index 28)
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[28] = whitePawn;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 28);

                expect(moves).toHaveLength(1);
                expect(moves[0]).toEqual({
                    from: 28,
                    to: 36, // e5
                    type: 'normal',
                    piece: 'pawn',
                    color: 'white'
                });
            });

            test('should generate double move for white pawn on starting rank', () => {
                // Place white pawn on e2 (index 12) - starting position
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[12] = whitePawn;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 12);

                expect(moves).toHaveLength(2);
                expect(moves).toContainEqual({
                    from: 12,
                    to: 20, // e3
                    type: 'normal',
                    piece: 'pawn',
                    color: 'white'
                });
                expect(moves).toContainEqual({
                    from: 12,
                    to: 28, // e4
                    type: 'double',
                    piece: 'pawn',
                    color: 'white'
                });
            });

            test('should not generate double move if path is blocked', () => {
                // Place white pawn on e2 (index 12)
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[12] = whitePawn;
                
                // Block e4 (index 28)
                const blockingPiece = new Piece('pawn', 'black', 1, '♟');
                board.squares[28] = blockingPiece;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 12);

                expect(moves).toHaveLength(1);
                expect(moves[0].type).toBe('normal');
                expect(moves[0].to).toBe(20); // Only e3 available
            });

            test('should not generate forward move if blocked', () => {
                // Place white pawn on e4 (index 28)
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[28] = whitePawn;
                
                // Block e5 (index 36)
                const blockingPiece = new Piece('pawn', 'black', 1, '♟');
                board.squares[36] = blockingPiece;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 28);

                expect(moves).toHaveLength(0);
            });

            test('should generate capture moves for white pawn', () => {
                // Place white pawn on e4 (index 28)
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[28] = whitePawn;
                
                // Place black pieces on d5 (index 35) and f5 (index 37)
                const blackPawn1 = new Piece('pawn', 'black', 1, '♟');
                const blackPawn2 = new Piece('pawn', 'black', 1, '♟');
                board.squares[35] = blackPawn1; // d5
                board.squares[37] = blackPawn2; // f5

                const moves = moveGenerator.generatePawnMoves(whitePawn, 28);

                expect(moves).toHaveLength(3); // 1 forward + 2 captures
                
                const captureMoves = moves.filter(move => move.type === 'capture');
                expect(captureMoves).toHaveLength(2);
                
                expect(captureMoves).toContainEqual({
                    from: 28,
                    to: 35, // d5
                    type: 'capture',
                    piece: 'pawn',
                    color: 'white',
                    captured: 'pawn'
                });
                
                expect(captureMoves).toContainEqual({
                    from: 28,
                    to: 37, // f5
                    type: 'capture',
                    piece: 'pawn',
                    color: 'white',
                    captured: 'pawn'
                });
            });

            test('should not capture own pieces', () => {
                // Place white pawn on e4 (index 28)
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[28] = whitePawn;
                
                // Place white pieces on d5 (index 35) and f5 (index 37)
                const whitePawn1 = new Piece('pawn', 'white', 1, '♙');
                const whitePawn2 = new Piece('pawn', 'white', 1, '♙');
                board.squares[35] = whitePawn1; // d5
                board.squares[37] = whitePawn2; // f5

                const moves = moveGenerator.generatePawnMoves(whitePawn, 28);

                expect(moves).toHaveLength(1); // Only forward move
                expect(moves[0].type).toBe('normal');
            });
        });

        describe('Black Pawn Moves', () => {
            test('should generate single forward move for black pawn', () => {
                // Place black pawn on e5 (index 36)
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[36] = blackPawn;

                const moves = moveGenerator.generatePawnMoves(blackPawn, 36);

                expect(moves).toHaveLength(1);
                expect(moves[0]).toEqual({
                    from: 36,
                    to: 28, // e4
                    type: 'normal',
                    piece: 'pawn',
                    color: 'black'
                });
            });

            test('should generate double move for black pawn on starting rank', () => {
                // Place black pawn on e7 (index 52) - starting position
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[52] = blackPawn;

                const moves = moveGenerator.generatePawnMoves(blackPawn, 52);

                expect(moves).toHaveLength(2);
                expect(moves).toContainEqual({
                    from: 52,
                    to: 44, // e6
                    type: 'normal',
                    piece: 'pawn',
                    color: 'black'
                });
                expect(moves).toContainEqual({
                    from: 52,
                    to: 36, // e5
                    type: 'double',
                    piece: 'pawn',
                    color: 'black'
                });
            });

            test('should generate capture moves for black pawn', () => {
                // Place black pawn on e5 (index 36)
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[36] = blackPawn;
                
                // Place white pieces on d4 (index 27) and f4 (index 29)
                const whitePawn1 = new Piece('pawn', 'white', 1, '♙');
                const whitePawn2 = new Piece('pawn', 'white', 1, '♙');
                board.squares[27] = whitePawn1; // d4
                board.squares[29] = whitePawn2; // f4

                const moves = moveGenerator.generatePawnMoves(blackPawn, 36);

                expect(moves).toHaveLength(3); // 1 forward + 2 captures
                
                const captureMoves = moves.filter(move => move.type === 'capture');
                expect(captureMoves).toHaveLength(2);
                
                expect(captureMoves).toContainEqual({
                    from: 36,
                    to: 27, // d4
                    type: 'capture',
                    piece: 'pawn',
                    color: 'black',
                    captured: 'pawn'
                });
                
                expect(captureMoves).toContainEqual({
                    from: 36,
                    to: 29, // f4
                    type: 'capture',
                    piece: 'pawn',
                    color: 'black',
                    captured: 'pawn'
                });
            });
        });

        describe('Edge Cases and Validation', () => {
            test('should handle pawn on edge files correctly', () => {
                // Place white pawn on a4 (index 24) - left edge
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[24] = whitePawn;
                
                // Place black piece on b5 (index 33) for capture
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[33] = blackPawn;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 24);

                expect(moves).toHaveLength(2); // 1 forward + 1 capture (only to the right)
                
                const captureMoves = moves.filter(move => move.type === 'capture');
                expect(captureMoves).toHaveLength(1);
                expect(captureMoves[0].to).toBe(33); // b5
            });

            test('should handle pawn on h-file correctly', () => {
                // Place white pawn on h4 (index 31) - right edge
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[31] = whitePawn;
                
                // Place black piece on g5 (index 38) for capture
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[38] = blackPawn;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 31);

                expect(moves).toHaveLength(2); // 1 forward + 1 capture (only to the left)
                
                const captureMoves = moves.filter(move => move.type === 'capture');
                expect(captureMoves).toHaveLength(1);
                expect(captureMoves[0].to).toBe(38); // g5
            });

            test('should throw error for invalid position', () => {
                const whitePawn = new Piece('pawn', 'white', 1, '♙');

                expect(() => {
                    moveGenerator.generatePawnMoves(whitePawn, -1);
                }).toThrow('Invalid position: -1 must be between 0 and 63');

                expect(() => {
                    moveGenerator.generatePawnMoves(whitePawn, 64);
                }).toThrow('Invalid position: 64 must be between 0 and 63');
            });

            test('should handle pawn at board edges without wrapping', () => {
                // Place white pawn on h2 (index 15) - corner case
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[15] = whitePawn;

                const moves = moveGenerator.generatePawnMoves(whitePawn, 15);

                // Should have forward moves but no invalid captures
                expect(moves.length).toBeGreaterThan(0);
                moves.forEach(move => {
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                });
            });
        });

        describe('Helper Methods', () => {
            test('isValidSquare should validate square indices correctly', () => {
                expect(moveGenerator.isValidSquare(0)).toBe(true);
                expect(moveGenerator.isValidSquare(63)).toBe(true);
                expect(moveGenerator.isValidSquare(32)).toBe(true);
                expect(moveGenerator.isValidSquare(-1)).toBe(false);
                expect(moveGenerator.isValidSquare(64)).toBe(false);
                expect(moveGenerator.isValidSquare(100)).toBe(false);
            });

            test('isValidPawnCapture should prevent board wrapping', () => {
                // Valid captures
                expect(moveGenerator.isValidPawnCapture(28, 35)).toBe(true); // e4 to d5
                expect(moveGenerator.isValidPawnCapture(28, 37)).toBe(true); // e4 to f5
                
                // Invalid captures (wrapping)
                expect(moveGenerator.isValidPawnCapture(7, 14)).toBe(false); // h1 to g2 (wraps)
                expect(moveGenerator.isValidPawnCapture(0, 9)).toBe(false); // a1 to b2 (wraps)
                
                // Same file (not a capture)
                expect(moveGenerator.isValidPawnCapture(28, 36)).toBe(false); // e4 to e5
            });
        });
    });

    describe('Other Piece Move Generation (TODO)', () => {
        test('should return empty array for rook moves (not implemented)', () => {
            const rook = new Piece('rook', 'white', 5, '♖');
            const moves = moveGenerator.generateRookMoves(rook, 0);
            expect(moves).toEqual([]);
        });

        test('should return empty array for knight moves (not implemented)', () => {
            const knight = new Piece('knight', 'white', 3, '♘');
            const moves = moveGenerator.generateKnightMoves(knight, 1);
            expect(moves).toEqual([]);
        });

        test('should return empty array for bishop moves (not implemented)', () => {
            const bishop = new Piece('bishop', 'white', 3, '♗');
            const moves = moveGenerator.generateBishopMoves(bishop, 2);
            expect(moves).toEqual([]);
        });

        test('should return empty array for queen moves (not implemented)', () => {
            const queen = new Piece('queen', 'white', 9, '♕');
            const moves = moveGenerator.generateQueenMoves(queen, 3);
            expect(moves).toEqual([]);
        });

        test('should return empty array for king moves (not implemented)', () => {
            const king = new Piece('king', 'white', 1000, '♔');
            const moves = moveGenerator.generateKingMoves(king, 4);
            expect(moves).toEqual([]);
        });
    });

    describe('Main generateMoves method', () => {
        test('should route to correct piece-specific method', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            board.squares[12] = whitePawn;

            const moves = moveGenerator.generateMoves(whitePawn, 12);

            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('pawn');
        });

        test('should return empty array for unknown piece type', () => {
            // Create a mock piece with invalid type
            const invalidPiece = {
                getType: () => 'invalid'
            };

            const moves = moveGenerator.generateMoves(invalidPiece, 0);
            expect(moves).toEqual([]);
        });
    });
});