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
                    color: 'white',
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
                    color: 'white',
                });
                expect(moves).toContainEqual({
                    from: 12,
                    to: 28, // e4
                    type: 'double',
                    piece: 'pawn',
                    color: 'white',
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

                const captureMoves = moves.filter((move) => move.type === 'capture');
                expect(captureMoves).toHaveLength(2);

                expect(captureMoves).toContainEqual({
                    from: 28,
                    to: 35, // d5
                    type: 'capture',
                    piece: 'pawn',
                    color: 'white',
                    captured: 'pawn',
                });

                expect(captureMoves).toContainEqual({
                    from: 28,
                    to: 37, // f5
                    type: 'capture',
                    piece: 'pawn',
                    color: 'white',
                    captured: 'pawn',
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
                    color: 'black',
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
                    color: 'black',
                });
                expect(moves).toContainEqual({
                    from: 52,
                    to: 36, // e5
                    type: 'double',
                    piece: 'pawn',
                    color: 'black',
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

                const captureMoves = moves.filter((move) => move.type === 'capture');
                expect(captureMoves).toHaveLength(2);

                expect(captureMoves).toContainEqual({
                    from: 36,
                    to: 27, // d4
                    type: 'capture',
                    piece: 'pawn',
                    color: 'black',
                    captured: 'pawn',
                });

                expect(captureMoves).toContainEqual({
                    from: 36,
                    to: 29, // f4
                    type: 'capture',
                    piece: 'pawn',
                    color: 'black',
                    captured: 'pawn',
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

                const captureMoves = moves.filter((move) => move.type === 'capture');
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

                const captureMoves = moves.filter((move) => move.type === 'capture');
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
                moves.forEach((move) => {
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

                // Invalid captures (wrapping) - corrected examples
                expect(moveGenerator.isValidPawnCapture(7, 8)).toBe(false); // h1 to a2 (wraps around)
                expect(moveGenerator.isValidPawnCapture(0, 15)).toBe(false); // a1 to h2 (wraps around)

                // Same file (not a capture)
                expect(moveGenerator.isValidPawnCapture(28, 36)).toBe(false); // e4 to e5

                // More than 1 file difference (invalid)
                expect(moveGenerator.isValidPawnCapture(28, 34)).toBe(false); // e4 to c5 (2 files)
            });

            test('isValidHorizontalMove should prevent board wrapping', () => {
                // Valid horizontal moves (same rank)
                expect(moveGenerator.isValidHorizontalMove(0, 7)).toBe(true); // a1 to h1
                expect(moveGenerator.isValidHorizontalMove(56, 63)).toBe(true); // a8 to h8
                expect(moveGenerator.isValidHorizontalMove(28, 31)).toBe(true); // e4 to h4

                // Invalid horizontal moves (different ranks)
                expect(moveGenerator.isValidHorizontalMove(0, 8)).toBe(false); // a1 to a2
                expect(moveGenerator.isValidHorizontalMove(7, 15)).toBe(false); // h1 to h2
                expect(moveGenerator.isValidHorizontalMove(28, 36)).toBe(false); // e4 to e5
            });
        });
    });

    describe('Rook Move Generation', () => {
        describe('Basic Rook Movement', () => {
            test('should generate all possible moves for rook in center of empty board', () => {
                // Place white rook on e4 (index 28) - center position
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[28] = whiteRook;

                const moves = moveGenerator.generateRookMoves(whiteRook, 28);

                expect(moves).toHaveLength(14); // 7 horizontal + 7 vertical moves

                // Check that all moves are valid squares
                moves.forEach((move) => {
                    expect(move.from).toBe(28);
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                    expect(move.type).toBe('normal');
                    expect(move.piece).toBe('rook');
                    expect(move.color).toBe('white');
                });

                // Check specific directional moves
                const upMoves = moves.filter((move) => move.to > 28 && (move.to - 28) % 8 === 0);
                const downMoves = moves.filter((move) => move.to < 28 && (28 - move.to) % 8 === 0);
                const rightMoves = moves.filter(
                    (move) => move.to > 28 && Math.floor(move.to / 8) === Math.floor(28 / 8)
                );
                const leftMoves = moves.filter(
                    (move) => move.to < 28 && Math.floor(move.to / 8) === Math.floor(28 / 8)
                );

                expect(upMoves).toHaveLength(4); // e5, e6, e7, e8 (36, 44, 52, 60)
                expect(downMoves).toHaveLength(3); // e3, e2, e1 (20, 12, 4)
                expect(rightMoves).toHaveLength(3); // f4, g4, h4 (29, 30, 31)
                expect(leftMoves).toHaveLength(4); // d4, c4, b4, a4 (27, 26, 25, 24)
            });

            test('should generate moves for rook in corner position', () => {
                // Place white rook on a1 (index 56) - corner position
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[56] = whiteRook;

                const moves = moveGenerator.generateRookMoves(whiteRook, 56);

                expect(moves).toHaveLength(14); // 7 horizontal + 7 vertical moves

                // All moves should be valid
                moves.forEach((move) => {
                    expect(move.from).toBe(56);
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                    expect(move.type).toBe('normal');
                });
            });

            test('should generate moves for rook on edge of board', () => {
                // Place white rook on a4 (index 60) - bottom edge
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[60] = whiteRook;

                const moves = moveGenerator.generateRookMoves(whiteRook, 60);

                expect(moves).toHaveLength(14); // 7 horizontal + 7 vertical moves

                // Check that moves don't wrap around board
                moves.forEach((move) => {
                    expect(move.from).toBe(60);
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                });
            });
        });

        describe('Rook Movement with Obstructions', () => {
            test('should stop at friendly piece and not capture it', () => {
                // Place white rook on e4 (index 28)
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[28] = whiteRook;

                // Place friendly piece on e6 (index 44) - blocks upward movement
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[44] = whitePawn;

                const moves = moveGenerator.generateRookMoves(whiteRook, 28);

                // Should have fewer moves due to obstruction
                expect(moves.length).toBeLessThan(14);

                // Should not include e6 or beyond in upward direction
                const upwardMoves = moves.filter(
                    (move) => move.to > 28 && (move.to - 28) % 8 === 0
                );
                expect(upwardMoves).toHaveLength(1); // Only e5 (index 36)
                expect(upwardMoves[0].to).toBe(36);

                // Should not capture friendly piece
                const captureAtE6 = moves.find((move) => move.to === 44);
                expect(captureAtE6).toBeUndefined();
            });

            test('should capture enemy piece and stop', () => {
                // Place white rook on e4 (index 28)
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[28] = whiteRook;

                // Place enemy piece on e6 (index 44) - can be captured
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[44] = blackPawn;

                const moves = moveGenerator.generateRookMoves(whiteRook, 28);

                // Should include capture move at e6
                const captureMove = moves.find((move) => move.to === 44);
                expect(captureMove).toBeDefined();
                expect(captureMove).toEqual({
                    from: 28,
                    to: 44,
                    type: 'capture',
                    piece: 'rook',
                    color: 'white',
                    captured: 'pawn',
                });

                // Should not include moves beyond e6 in upward direction
                const beyondCapture = moves.filter(
                    (move) => move.to > 44 && (move.to - 28) % 8 === 0
                );
                expect(beyondCapture).toHaveLength(0);
            });

            test('should handle multiple obstructions in different directions', () => {
                // Place white rook on e4 (index 28)
                const whiteRook = new Piece('rook', 'white', 1, '♖');
                board.squares[28] = whiteRook;

                // Place pieces in all directions
                const whitePawn1 = new Piece('pawn', 'white', 1, '♙');
                const blackPawn1 = new Piece('pawn', 'black', 1, '♟');
                const whitePawn2 = new Piece('pawn', 'white', 1, '♙');
                const blackPawn2 = new Piece('pawn', 'black', 1, '♟');

                board.squares[36] = whitePawn1; // e5 (up) - friendly, blocks
                board.squares[20] = blackPawn1; // e3 (down) - enemy, can capture
                board.squares[29] = whitePawn2; // f4 (right) - friendly, blocks
                board.squares[27] = blackPawn2; // d4 (left) - enemy, can capture

                const moves = moveGenerator.generateRookMoves(whiteRook, 28);

                // Should have limited moves due to obstructions
                expect(moves.length).toBeLessThan(14);

                // Check specific blocked/capture scenarios
                const upMoves = moves.filter((move) => move.to > 28 && (move.to - 28) % 8 === 0);
                expect(upMoves).toHaveLength(0); // Blocked by friendly piece

                const downMoves = moves.filter((move) => move.to < 28 && (28 - move.to) % 8 === 0);
                expect(downMoves.some((move) => move.to === 20 && move.type === 'capture')).toBe(
                    true
                );

                const rightMoves = moves.filter(
                    (move) => move.to > 28 && Math.floor(move.to / 8) === Math.floor(28 / 8)
                );
                expect(rightMoves).toHaveLength(0); // Blocked by friendly piece

                const leftMoves = moves.filter(
                    (move) => move.to < 28 && Math.floor(move.to / 8) === Math.floor(28 / 8)
                );
                expect(leftMoves.some((move) => move.to === 27 && move.type === 'capture')).toBe(
                    true
                );
            });
        });

        describe('Rook Edge Cases and Validation', () => {
            test('should throw error for invalid position', () => {
                const whiteRook = new Piece('rook', 'white', 5, '♖');

                expect(() => {
                    moveGenerator.generateRookMoves(whiteRook, -1);
                }).toThrow('Invalid position: -1 must be between 0 and 63');

                expect(() => {
                    moveGenerator.generateRookMoves(whiteRook, 64);
                }).toThrow('Invalid position: 64 must be between 0 and 63');
            });

            test('should handle rook surrounded by pieces', () => {
                // Place white rook on e4 (index 28)
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[28] = whiteRook;

                // Surround with pieces in all 4 directions (adjacent squares)
                const blackPawn1 = new Piece('pawn', 'black', 1, '♟');
                const blackPawn2 = new Piece('pawn', 'black', 1, '♟');
                const blackPawn3 = new Piece('pawn', 'black', 1, '♟');
                const blackPawn4 = new Piece('pawn', 'black', 1, '♟');

                board.squares[36] = blackPawn1; // e5 (up)
                board.squares[20] = blackPawn2; // e3 (down)
                board.squares[29] = blackPawn3; // f4 (right)
                board.squares[27] = blackPawn4; // d4 (left)

                const moves = moveGenerator.generateRookMoves(whiteRook, 28);

                expect(moves).toHaveLength(4); // Can capture all 4 adjacent pieces
                moves.forEach((move) => {
                    expect(move.type).toBe('capture');
                    expect(move.captured).toBe('pawn');
                });
            });

            test('should not wrap around board edges', () => {
                // Place white rook on h4 (index 31) - right edge
                const whiteRook = new Piece('rook', 'white', 5, '♖');
                board.squares[31] = whiteRook;

                const moves = moveGenerator.generateRookMoves(whiteRook, 31);

                // Check that no moves wrap to the next rank
                moves.forEach((move) => {
                    if (move.to > 31) {
                        // Upward moves should be on same file
                        expect((move.to - 31) % 8).toBe(0);
                    } else if (move.to < 31) {
                        // Downward or leftward moves
                        const isVertical = (31 - move.to) % 8 === 0;
                        const isHorizontal = Math.floor(move.to / 8) === Math.floor(31 / 8);
                        expect(isVertical || isHorizontal).toBe(true);
                    }
                });
            });

            test('should generate correct moves for black rook', () => {
                // Place black rook on d5 (index 35)
                const blackRook = new Piece('rook', 'black', 5, '♜');
                board.squares[35] = blackRook;

                const moves = moveGenerator.generateRookMoves(blackRook, 35);

                expect(moves).toHaveLength(14); // Full movement on empty board
                moves.forEach((move) => {
                    expect(move.from).toBe(35);
                    expect(move.piece).toBe('rook');
                    expect(move.color).toBe('black');
                    expect(move.type).toBe('normal');
                });
            });
        });
    });

    describe('Bishop Move Generation', () => {
        describe('Basic Bishop Movement', () => {
            test('should generate all possible moves for bishop in center of empty board', () => {
                // Place white bishop on e4 (index 28) - center position
                const whiteBishop = new Piece('bishop', 'white', 3, '♗');
                board.squares[28] = whiteBishop;

                const moves = moveGenerator.generateBishopMoves(whiteBishop, 28);

                expect(moves).toHaveLength(13); // 4 diagonal directions with varying lengths

                // Check that all moves are valid squares
                moves.forEach((move) => {
                    expect(move.from).toBe(28);
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                    expect(move.type).toBe('normal');
                    expect(move.piece).toBe('bishop');
                    expect(move.color).toBe('white');
                });

                // Check specific diagonal moves
                const neMoves = moves.filter((move) => move.to > 28 && (move.to - 28) % 7 === 0);
                const nwMoves = moves.filter((move) => move.to > 28 && (move.to - 28) % 9 === 0);
                const seMoves = moves.filter((move) => move.to < 28 && (28 - move.to) % 9 === 0);
                const swMoves = moves.filter((move) => move.to < 28 && (28 - move.to) % 7 === 0);

                expect(neMoves.length).toBeGreaterThan(0); // NE diagonal
                expect(nwMoves.length).toBeGreaterThan(0); // NW diagonal
                expect(seMoves.length).toBeGreaterThan(0); // SE diagonal
                expect(swMoves.length).toBeGreaterThan(0); // SW diagonal
            });

            test('should generate moves for bishop in corner position', () => {
                // Place white bishop on a1 (index 56) - corner position
                const whiteBishop = new Piece('bishop', 'white', 3, '♗');
                board.squares[56] = whiteBishop;

                const moves = moveGenerator.generateBishopMoves(whiteBishop, 56);

                expect(moves).toHaveLength(7); // Only one diagonal available from corner

                // All moves should be valid
                moves.forEach((move) => {
                    expect(move.from).toBe(56);
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                    expect(move.type).toBe('normal');
                });
            });
        });

        describe('Bishop Movement with Obstructions', () => {
            test('should stop at friendly piece and not capture it', () => {
                // Place white bishop on e4 (index 28)
                const whiteBishop = new Piece('bishop', 'white', 3, '♗');
                board.squares[28] = whiteBishop;

                // Place friendly piece on g6 (index 46) - blocks SE diagonal
                const whitePawn = new Piece('pawn', 'white', 1, '♙');
                board.squares[46] = whitePawn;

                const moves = moveGenerator.generateBishopMoves(whiteBishop, 28);

                // Should not capture friendly piece
                const captureAtG6 = moves.find((move) => move.to === 46);
                expect(captureAtG6).toBeUndefined();

                // Should not include moves beyond g6 in SE direction
                const beyondG6 = moves.filter((move) => move.to > 46 && (move.to - 28) % 9 === 0);
                expect(beyondG6).toHaveLength(0);
            });

            test('should capture enemy piece and stop', () => {
                // Place white bishop on e4 (index 28)
                const whiteBishop = new Piece('bishop', 'white', 3, '♗');
                board.squares[28] = whiteBishop;

                // Place enemy piece on g6 (index 46) - can be captured
                const blackPawn = new Piece('pawn', 'black', 1, '♟');
                board.squares[46] = blackPawn;

                const moves = moveGenerator.generateBishopMoves(whiteBishop, 28);

                // Should include capture move at g6
                const captureMove = moves.find((move) => move.to === 46);
                expect(captureMove).toBeDefined();
                expect(captureMove).toEqual({
                    from: 28,
                    to: 46,
                    type: 'capture',
                    piece: 'bishop',
                    color: 'white',
                    captured: 'pawn',
                });
            });
        });

        describe('Bishop Edge Cases and Validation', () => {
            test('should throw error for invalid position', () => {
                const whiteBishop = new Piece('bishop', 'white', 3, '♗');

                expect(() => {
                    moveGenerator.generateBishopMoves(whiteBishop, -1);
                }).toThrow('Invalid position: -1 must be between 0 and 63');

                expect(() => {
                    moveGenerator.generateBishopMoves(whiteBishop, 64);
                }).toThrow('Invalid position: 64 must be between 0 and 63');
            });

            test('should not wrap around board edges', () => {
                // Place white bishop on h1 (index 63) - corner edge case
                const whiteBishop = new Piece('bishop', 'white', 3, '♗');
                board.squares[63] = whiteBishop;

                const moves = moveGenerator.generateBishopMoves(whiteBishop, 63);

                // Check that no moves wrap around board
                moves.forEach((move) => {
                    expect(move.to).toBeGreaterThanOrEqual(0);
                    expect(move.to).toBeLessThan(64);
                    // Verify diagonal movement is valid
                    expect(moveGenerator.isValidDiagonalMove(63, move.to)).toBe(true);
                });
            });

            test('should generate correct moves for black bishop', () => {
                // Place black bishop on d5 (index 35)
                const blackBishop = new Piece('bishop', 'black', 3, '♝');
                board.squares[35] = blackBishop;

                const moves = moveGenerator.generateBishopMoves(blackBishop, 35);

                expect(moves.length).toBeGreaterThan(0);
                moves.forEach((move) => {
                    expect(move.from).toBe(35);
                    expect(move.piece).toBe('bishop');
                    expect(move.color).toBe('black');
                    expect(move.type).toBe('normal');
                });
            });
        });

        describe('Helper Methods', () => {
            test('isValidDiagonalMove should prevent board wrapping', () => {
                // Valid diagonal moves
                expect(moveGenerator.isValidDiagonalMove(28, 35)).toBe(true); // e4 to d5
                expect(moveGenerator.isValidDiagonalMove(28, 37)).toBe(true); // e4 to f5
                expect(moveGenerator.isValidDiagonalMove(28, 21)).toBe(true); // e4 to f3
                expect(moveGenerator.isValidDiagonalMove(28, 19)).toBe(true); // e4 to d3

                // Invalid diagonal moves (wrapping)
                expect(moveGenerator.isValidDiagonalMove(7, 8)).toBe(false); // h1 to a2 (wraps)
                expect(moveGenerator.isValidDiagonalMove(0, 15)).toBe(false); // a1 to h2 (wraps)

                // Non-diagonal moves
                expect(moveGenerator.isValidDiagonalMove(28, 29)).toBe(false); // e4 to f4 (horizontal)
                expect(moveGenerator.isValidDiagonalMove(28, 36)).toBe(false); // e4 to e5 (vertical)
            });
        });
    });

    describe('Knight Move Generation', () => {
        test('should generate all 8 moves for knight in center of empty board', () => {
            const knight = new Piece('knight', 'white', 3, '♘');
            board.squares[28] = knight; // e4

            const moves = moveGenerator.generateKnightMoves(knight, 28);
            expect(moves).toHaveLength(8);
        });

        test('should generate 2 moves for knight in corner (a1)', () => {
            const knight = new Piece('knight', 'white', 3, '♘');
            board.squares[56] = knight; // a1

            const moves = moveGenerator.generateKnightMoves(knight, 56);
            expect(moves).toHaveLength(2);
            const destinations = moves.map((m) => m.to);
            expect(destinations).toEqual(expect.arrayContaining([41, 50])); // c2, b3
        });

        test('should generate 4 moves for knight on edge (a4)', () => {
            const knight = new Piece('knight', 'white', 3, '♘');
            board.squares[32] = knight; // a4

            const moves = moveGenerator.generateKnightMoves(knight, 32);
            expect(moves).toHaveLength(4);
        });

        test('should not be blocked by surrounding pieces', () => {
            const knight = new Piece('knight', 'white', 3, '♘');
            board.squares[28] = knight; // e4

            // Surround the knight
            board.squares[27] = new Piece('pawn', 'black', 1, '♟'); // d4
            board.squares[29] = new Piece('pawn', 'black', 1, '♟'); // f4
            board.squares[36] = new Piece('pawn', 'black', 1, '♟'); // e5
            board.squares[20] = new Piece('pawn', 'black', 1, '♟'); // e3

            const moves = moveGenerator.generateKnightMoves(knight, 28);
            expect(moves).toHaveLength(8); // Still has 8 moves
        });

        test('should capture enemy pieces but not land on friendly pieces', () => {
            const knight = new Piece('knight', 'white', 3, '♘');
            board.squares[28] = knight; // e4

            // Friendly piece at one destination
            board.squares[11] = new Piece('pawn', 'white', 1, '♙'); // d2, blocks one move
            // Enemy piece at another
            board.squares[13] = new Piece('pawn', 'black', 1, '♟'); // f2, can be captured

            const moves = moveGenerator.generateKnightMoves(knight, 28);
            expect(moves).toHaveLength(7); // 8 possible moves - 1 blocked by friendly

            const captureMove = moves.find((m) => m.to === 13);
            expect(captureMove).toBeDefined();
            expect(captureMove.type).toBe('capture');
            expect(captureMove.captured).toBe('pawn');
        });

        test('isValidKnightMove should prevent wrapping', () => {
            // Valid moves
            expect(moveGenerator.isValidKnightMove(0, 10)).toBe(true); // a8 to b6
            expect(moveGenerator.isValidKnightMove(28, 11)).toBe(true); // e4 to d2

            // Invalid moves (wrapping from h-file to a-file)
            expect(moveGenerator.isValidKnightMove(7, 16)).toBe(false); // h8 to a6
            expect(moveGenerator.isValidKnightMove(15, 25)).toBe(false); // h7 to b5
        });
    });

    describe('King Move Generation', () => {
        test('should generate all 8 moves for king in center of empty board', () => {
            const king = new Piece('king', 'white', 1000, '♔');
            board.squares[28] = king; // e4

            const moves = moveGenerator.generateKingMoves(king, 28);
            expect(moves).toHaveLength(8);
        });

        test('should generate 3 moves for king in corner (a1)', () => {
            const king = new Piece('king', 'white', 1000, '♔');
            board.squares[56] = king; // a1

            const moves = moveGenerator.generateKingMoves(king, 56);
            expect(moves).toHaveLength(3);
            const destinations = moves.map((m) => m.to);
            expect(destinations).toEqual(expect.arrayContaining([48, 49, 57])); // a2, b2, b1
        });

        test('should generate 5 moves for king on edge (a4)', () => {
            const king = new Piece('king', 'white', 1000, '♔');
            board.squares[32] = king; // a4

            const moves = moveGenerator.generateKingMoves(king, 32);
            expect(moves).toHaveLength(5);
        });

        test('should capture enemy pieces but not land on friendly pieces', () => {
            const king = new Piece('king', 'white', 1000, '♔');
            board.squares[28] = king; // e4

            // Friendly piece at one destination
            board.squares[27] = new Piece('pawn', 'white', 1, '♙'); // d4, blocks one move
            // Enemy piece at another
            board.squares[29] = new Piece('pawn', 'black', 1, '♟'); // f4, can be captured

            const moves = moveGenerator.generateKingMoves(king, 28);
            expect(moves).toHaveLength(7); // 8 possible moves - 1 blocked by friendly

            const captureMove = moves.find((m) => m.to === 29);
            expect(captureMove).toBeDefined();
            expect(captureMove.type).toBe('capture');
            expect(captureMove.captured).toBe('pawn');
        });

        test('isValidKingMove should prevent wrapping', () => {
            // Valid moves
            expect(moveGenerator.isValidKingMove(0, 9)).toBe(true); // a8 to b7
            expect(moveGenerator.isValidKingMove(28, 27)).toBe(true); // e4 to d4

            // Invalid moves (wrapping from h-file to a-file)
            expect(moveGenerator.isValidKingMove(7, 8)).toBe(false); // h8 to a7
            expect(moveGenerator.isValidKingMove(15, 16)).toBe(false); // h7 to a6
        });
    });

    describe('Queen Move Generation', () => {
        test('should generate all 27 moves for queen in center of empty board', () => {
            const queen = new Piece('queen', 'white', 9, '♕');
            board.squares[28] = queen; // e4
    
            const moves = moveGenerator.generateQueenMoves(queen, 28);
            // Rook moves from e4 = 14; Bishop moves from e4 = 13. Total = 27.
            expect(moves).toHaveLength(27);
        });
    
        test('should generate 21 moves for queen in corner (a1)', () => {
            const queen = new Piece('queen', 'white', 9, '♕');
            board.squares[56] = queen; // a1
    
            const moves = moveGenerator.generateQueenMoves(queen, 56);
            // Rook moves from a1 = 14; Bishop moves from a1 = 7. Total = 21.
            expect(moves).toHaveLength(21);
        });
    
        test('should be blocked by friendly pieces', () => {
            const queen = new Piece('queen', 'white', 9, '♕');
            board.squares[28] = queen; // e4
    
            // Friendly piece blocking vertically
            board.squares[36] = new Piece('pawn', 'white', 1, '♙'); // e5
            // Friendly piece blocking diagonally
            board.squares[37] = new Piece('pawn', 'white', 1, '♙'); // f5
    
            const moves = moveGenerator.generateQueenMoves(queen, 28);
            expect(moves.length).toBeLessThan(27);
            
            const movesToE5 = moves.find(m => m.to === 36);
            expect(movesToE5).toBeUndefined(); // Cannot land on friendly piece
    
            const movesToF5 = moves.find(m => m.to === 37);
            expect(movesToF5).toBeUndefined(); // Cannot land on friendly piece
        });
    
        test('should capture enemy pieces', () => {
            const queen = new Piece('queen', 'white', 9, '♕');
            board.squares[28] = queen; // e4
    
            // Enemy piece blocking vertically
            board.squares[36] = new Piece('pawn', 'black', 1, '♟'); // e5
            // Enemy piece blocking diagonally
            board.squares[37] = new Piece('pawn', 'black', 1, '♟'); // f5
    
            const moves = moveGenerator.generateQueenMoves(queen, 28);
            
            const captureAtE5 = moves.find(m => m.to === 36);
            expect(captureAtE5).toBeDefined();
            expect(captureAtE5.type).toBe('capture');
            expect(captureAtE5.captured).toBe('pawn');
    
            const captureAtF5 = moves.find(m => m.to === 37);
            expect(captureAtF5).toBeDefined();
            expect(captureAtF5.type).toBe('capture');
            expect(captureAtF5.captured).toBe('pawn');
        });
    
        test('all generated moves should have correct piece type and color', () => {
            const queen = new Piece('queen', 'white', 9, '♕');
            board.squares[28] = queen; // e4
    
            const moves = moveGenerator.generateQueenMoves(queen, 28);
            moves.forEach(move => {
                expect(move.piece).toBe('queen');
                expect(move.color).toBe('white');
            });
        });
    });

    describe('Main generateMoves method', () => {
        test('should route to correct piece-specific method for pawn', () => {
            const whitePawn = new Piece('pawn', 'white', 1, '♙');
            board.squares[12] = whitePawn;

            const moves = moveGenerator.generateMoves(whitePawn, 12);

            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('pawn');
        });

        test('should route to correct piece-specific method for rook', () => {
            const whiteRook = new Piece('rook', 'white', 5, '♖');
            board.squares[28] = whiteRook;

            const moves = moveGenerator.generateMoves(whiteRook, 28);

            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('rook');
        });

        test('should route to correct piece-specific method for bishop', () => {
            const whiteBishop = new Piece('bishop', 'white', 3, '♗');
            board.squares[28] = whiteBishop;

            const moves = moveGenerator.generateMoves(whiteBishop, 28);

            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('bishop');
        });

        test('should route to correct piece-specific method for knight', () => {
            const whiteKnight = new Piece('knight', 'white', 3, '♘');
            board.squares[28] = whiteKnight;

            const moves = moveGenerator.generateMoves(whiteKnight, 28);

            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('knight');
        });

        test('should route to correct piece-specific method for king', () => {
            const whiteKing = new Piece('king', 'white', 1000, '♔');
            board.squares[28] = whiteKing;

            const moves = moveGenerator.generateMoves(whiteKing, 28);

            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('king');
        });

        test('should route to correct piece-specific method for queen', () => {
            const whiteQueen = new Piece('queen', 'white', 9, '♕');
            board.squares[28] = whiteQueen;
        
            const moves = moveGenerator.generateMoves(whiteQueen, 28);
        
            expect(moves.length).toBeGreaterThan(0);
            expect(moves[0].piece).toBe('queen');
        });

        test('should return empty array for unknown piece type', () => {
            // Create a mock piece with invalid type
            const invalidPiece = {
                getType: () => 'invalid',
            };

            const moves = moveGenerator.generateMoves(invalidPiece, 0);
            expect(moves).toEqual([]);
        });
    });
});