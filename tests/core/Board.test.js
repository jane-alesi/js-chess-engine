// tests/core/Board.test.js

import { Board } from '../../src/core/Board.js';

describe('Board', () => {
    let board;

    beforeEach(() => {
        board = new Board();
    });

    test('should initialize with 64 null squares', () => {
        expect(board.squares.length).toBe(64);
        expect(board.squares.every((square) => square === null)).toBe(true);
    });

    test('should correctly set up initial board with pieces', () => {
        board.setupInitialBoard();
        // Check a few specific squares
        expect(board.squares[0]).not.toBeNull(); // Rook at a1
        expect(board.squares[1]).not.toBeNull(); // Knight at b1
        expect(board.squares[8]).not.toBeNull(); // Pawn at a2
        expect(board.squares[63]).not.toBeNull(); // Rook at h8
        expect(board.squares[55]).not.toBeNull(); // Pawn at h7

        // Check piece types and colors using getter methods (example for white pawn at a2)
        expect(board.squares[8].getType()).toBe('pawn');
        expect(board.squares[8].getColor()).toBe('white');

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

    test('should throw error when moving from empty square', () => {
        board.setupInitialBoard();
        expect(() => {
            board.movePiece(20, 21); // Try to move from an empty square
        }).toThrow('Invalid move: no piece found at square 20');

        // Board state should remain unchanged
        expect(board.squares[20]).toBeNull(); // Should remain null
        expect(board.squares[21]).toBeNull(); // Should remain null
    });

    test('should throw error for invalid fromIndex', () => {
        board.setupInitialBoard();
        expect(() => {
            board.movePiece(-1, 20);
        }).toThrow('Invalid move: square indices out of bounds (from: -1, to: 20)');

        expect(() => {
            board.movePiece(64, 20);
        }).toThrow('Invalid move: square indices out of bounds (from: 64, to: 20)');
    });

    test('should throw error for invalid toIndex', () => {
        board.setupInitialBoard();
        expect(() => {
            board.movePiece(0, -1);
        }).toThrow('Invalid move: square indices out of bounds (from: 0, to: -1)');

        expect(() => {
            board.movePiece(0, 64);
        }).toThrow('Invalid move: square indices out of bounds (from: 0, to: 64)');
    });

    test('should throw error for both invalid indices', () => {
        board.setupInitialBoard();
        expect(() => {
            board.movePiece(-1, 64);
        }).toThrow('Invalid move: square indices out of bounds (from: -1, to: 64)');
    });
});
