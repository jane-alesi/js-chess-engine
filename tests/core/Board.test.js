// tests/Board.test.js

import { Board } from '../src/core/Board.js';

describe('Board', () => {
    let board;

    beforeEach(() => {
        board = new Board();
    });

    test('should initialize with 64 null squares', () => {
        expect(board.squares.length).toBe(64);
        expect(board.squares.every(square => square === null)).toBe(true);
    });

    test('should correctly set up initial board with pieces', () => {
        board.setupInitialBoard();
        // Check a few specific squares
        expect(board.squares[0]).not.toBeNull(); // Rook at a1
        expect(board.squares[1]).not.toBeNull(); // Knight at b1
        expect(board.squares[8]).not.toBeNull(); // Pawn at a2
        expect(board.squares[63]).not.toBeNull(); // Rook at h8
        expect(board.squares[55]).not.toBeNull(); // Pawn at h7

        // Check piece types and colors (example for white pawn at a2)
        expect(board.squares[8].type).toBe('pawn');
        expect(board.squares[8].color).toBe('white');

        // Check empty square in the middle
        expect(board.squares[20]).toBeNull();
    });

    test('should move a piece from one square to another', () => {
        board.setupInitialBoard();
        const originalPiece = board.squares[0]; // Rook at a1
        board.movePiece(0, 16); // Move rook to a3

        expect(board.squares[16]).toBe(originalPiece);
        expect(board.squares[0]).toBeNull();
    });

    test('should not move a piece from an empty square', () => {
        board.setupInitialBoard();
        const result = board.movePiece(20, 21); // Try to move from an empty square
        expect(result).toBe(false);
        expect(board.squares[20]).toBeNull(); // Should remain null
        expect(board.squares[21]).toBeNull(); // Should remain null
    });
});
