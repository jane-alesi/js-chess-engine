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
        const moveResult = board.movePiece(0, 16); // Move rook to a3

        expect(board.squares[16]).toBe(originalPiece);
        expect(board.squares[0]).toBeNull();

        // Verify the move result object
        expect(moveResult).toEqual({
            from: 0,
            to: 16,
            pieceMoved: 'rook',
            pieceCaptured: null,
            success: true,
        });
    });

    test('should return detailed move information for captures', () => {
        board.setupInitialBoard();

        // Move white pawn to capture position
        board.movePiece(8, 16); // Move pawn from a2 to a3
        board.movePiece(16, 24); // Move pawn from a3 to a4
        board.movePiece(24, 32); // Move pawn from a4 to a5
        board.movePiece(32, 40); // Move pawn from a5 to a6

        // Now capture black pawn
        const moveResult = board.movePiece(40, 48); // Capture black pawn at a7

        expect(moveResult).toEqual({
            from: 40,
            to: 48,
            pieceMoved: 'pawn',
            pieceCaptured: 'pawn',
            success: true,
        });
    });

    test('should mark pieces as moved after first move', () => {
        board.setupInitialBoard();
        const rook = board.squares[0]; // White rook at a1

        // Initially, piece should not have moved
        expect(rook.getHasMoved()).toBe(false);

        // Move the piece
        board.movePiece(0, 16);

        // After moving, piece should be marked as moved
        expect(rook.getHasMoved()).toBe(true);
    });

    test('should not mark piece as moved again if already moved', () => {
        board.setupInitialBoard();
        const rook = board.squares[0]; // White rook at a1

        // Move the piece first time
        board.movePiece(0, 16);
        expect(rook.getHasMoved()).toBe(true);

        // Move the piece second time - should not throw error
        const moveResult = board.movePiece(16, 24);
        expect(moveResult.success).toBe(true);
        expect(rook.getHasMoved()).toBe(true);
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

    test('should handle king moves and mark as moved (important for castling)', () => {
        board.setupInitialBoard();
        const whiteKing = board.squares[4]; // White king at e1

        expect(whiteKing.getType()).toBe('king');
        expect(whiteKing.getHasMoved()).toBe(false);

        // Move king
        const moveResult = board.movePiece(4, 12); // Move king to e2

        expect(moveResult.pieceMoved).toBe('king');
        expect(whiteKing.getHasMoved()).toBe(true);
    });

    test('should handle rook moves and mark as moved (important for castling)', () => {
        board.setupInitialBoard();
        const whiteRook = board.squares[0]; // White rook at a1

        expect(whiteRook.getType()).toBe('rook');
        expect(whiteRook.getHasMoved()).toBe(false);

        // Move rook
        const moveResult = board.movePiece(0, 8); // Move rook to a2

        expect(moveResult.pieceMoved).toBe('rook');
        expect(whiteRook.getHasMoved()).toBe(true);
    });

    test('should handle pawn moves and mark as moved (important for double move rules)', () => {
        board.setupInitialBoard();
        const whitePawn = board.squares[8]; // White pawn at a2

        expect(whitePawn.getType()).toBe('pawn');
        expect(whitePawn.getHasMoved()).toBe(false);

        // Move pawn
        const moveResult = board.movePiece(8, 16); // Move pawn to a3

        expect(moveResult.pieceMoved).toBe('pawn');
        expect(whitePawn.getHasMoved()).toBe(true);
    });
});
