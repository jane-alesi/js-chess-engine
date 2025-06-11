// tests/core/Piece.test.js

import { Piece } from '../../src/core/Piece.js';
import {
    PIECE_VALUES,
    PIECE_SYMBOLS,
    PIECE_TYPES,
    PIECE_COLORS,
    getPieceSymbol,
    getPieceValue,
} from '../../src/utils/Constants.js';

describe('Piece Class', () => {
    describe('Constructor', () => {
        test('should create a valid piece with correct properties', () => {
            const piece = new Piece('pawn', 'white', 1, '♙');

            expect(piece.getType()).toBe('pawn');
            expect(piece.getColor()).toBe('white');
            expect(piece.getPoints()).toBe(1);
            expect(piece.getSymbol()).toBe('♙');
            expect(piece.getHasMoved()).toBe(false);
        });

        test('should normalize type and color to lowercase', () => {
            const piece = new Piece('PAWN', 'WHITE', 1, '♙');

            expect(piece.getType()).toBe('pawn');
            expect(piece.getColor()).toBe('white');
        });

        test('should create pieces for all valid types', () => {
            Object.values(PIECE_TYPES).forEach((type) => {
                const piece = new Piece(
                    type,
                    'white',
                    PIECE_VALUES[type],
                    PIECE_SYMBOLS[type]['white']
                );
                expect(piece.getType()).toBe(type);
            });
        });

        test('should create pieces for all valid colors', () => {
            Object.values(PIECE_COLORS).forEach((color) => {
                const piece = new Piece('pawn', color, 1, PIECE_SYMBOLS.pawn[color]);
                expect(piece.getColor()).toBe(color);
            });
        });
    });

    describe('Constructor Validation', () => {
        test('should throw error for invalid piece type', () => {
            expect(() => new Piece('invalid', 'white', 1, '♙')).toThrow(
                'Invalid piece type: invalid'
            );
        });

        test('should throw error for empty piece type', () => {
            expect(() => new Piece('', 'white', 1, '♙')).toThrow(
                'Piece type must be a non-empty string'
            );
        });

        test('should throw error for null piece type', () => {
            expect(() => new Piece(null, 'white', 1, '♙')).toThrow(
                'Piece type must be a non-empty string'
            );
        });

        test('should throw error for invalid piece color', () => {
            expect(() => new Piece('pawn', 'red', 1, '♙')).toThrow('Invalid piece color: red');
        });

        test('should throw error for empty piece color', () => {
            expect(() => new Piece('pawn', '', 1, '♙')).toThrow(
                'Piece color must be a non-empty string'
            );
        });

        test('should throw error for null piece color', () => {
            expect(() => new Piece('pawn', null, 1, '♙')).toThrow(
                'Piece color must be a non-empty string'
            );
        });

        test('should throw error for negative points', () => {
            expect(() => new Piece('pawn', 'white', -1, '♙')).toThrow(
                'Piece points must be a non-negative number'
            );
        });

        test('should throw error for non-numeric points', () => {
            expect(() => new Piece('pawn', 'white', 'invalid', '♙')).toThrow(
                'Piece points must be a non-negative number'
            );
        });

        test('should throw error for empty symbol', () => {
            expect(() => new Piece('pawn', 'white', 1, '')).toThrow(
                'Piece symbol must be a non-empty string'
            );
        });

        test('should throw error for null symbol', () => {
            expect(() => new Piece('pawn', 'white', 1, null)).toThrow(
                'Piece symbol must be a non-empty string'
            );
        });
    });

    describe('Getters', () => {
        const piece = new Piece('pawn', 'white', 1, '♙');

        test('getType() should return the correct type', () => {
            expect(piece.getType()).toBe('pawn');
        });

        test('getColor() should return the correct color', () => {
            expect(piece.getColor()).toBe('white');
        });

        test('getPoints() should return the correct points', () => {
            expect(piece.getPoints()).toBe(1);
        });

        test('getSymbol() should return the correct symbol', () => {
            expect(piece.getSymbol()).toBe('♙');
        });

        test('getHasMoved() should return the initial moved status', () => {
            expect(piece.getHasMoved()).toBe(false);
        });
    });

    describe('Movement Tracking', () => {
        let piece;

        beforeEach(() => {
            piece = new Piece('pawn', 'white', 1, '♙');
        });

        test('should initialize with hasMoved as false', () => {
            expect(piece.getHasMoved()).toBe(false);
        });

        test('should mark piece as moved', () => {
            piece.markAsMoved();
            expect(piece.getHasMoved()).toBe(true);
        });

        test('should throw error when marking already moved piece', () => {
            piece.markAsMoved();
            expect(() => piece.markAsMoved()).toThrow(
                'white pawn has already been marked as moved'
            );
        });

        test('should reset moved status', () => {
            piece.markAsMoved();
            piece.resetMovedStatus();
            expect(piece.getHasMoved()).toBe(false);
        });

        test('should throw error when resetting unmoved piece', () => {
            expect(() => piece.resetMovedStatus()).toThrow("white pawn hasn't moved yet");
        });
    });

    describe('Piece Comparison', () => {
        let whitePawn;
        let blackPawn;
        let whiteRook;

        beforeEach(() => {
            whitePawn = new Piece('pawn', 'white', 1, '♙');
            blackPawn = new Piece('pawn', 'black', 1, '♟');
            whiteRook = new Piece('rook', 'white', 5, '♖');
        });

        test('should identify opponents correctly', () => {
            expect(whitePawn.isOpponent(blackPawn)).toBe(true);
            expect(blackPawn.isOpponent(whitePawn)).toBe(true);
        });

        test('should identify allies correctly', () => {
            expect(whitePawn.isAlly(whiteRook)).toBe(true);
            expect(whiteRook.isAlly(whitePawn)).toBe(true);
        });

        test('should not consider same color pieces as opponents', () => {
            expect(whitePawn.isOpponent(whiteRook)).toBe(false);
        });

        test('should not consider different color pieces as allies', () => {
            expect(whitePawn.isAlly(blackPawn)).toBe(false);
        });

        test('should throw error for invalid piece comparison', () => {
            expect(() => whitePawn.isOpponent('not a piece')).toThrow(
                'Parameter must be a Piece instance'
            );

            expect(() => whitePawn.isAlly(null)).toThrow('Parameter must be a Piece instance');
        });
    });

    describe('Cloning', () => {
        test('should create exact copy of piece', () => {
            const original = new Piece('queen', 'black', 9, '♛');
            const clone = original.clone();

            expect(clone.getType()).toBe(original.getType());
            expect(clone.getColor()).toBe(original.getColor());
            expect(clone.getPoints()).toBe(original.getPoints());
            expect(clone.getSymbol()).toBe(original.getSymbol());
            expect(clone.getHasMoved()).toBe(original.getHasMoved());
        });

        test('should preserve moved status in clone', () => {
            const original = new Piece('king', 'white', 1000, '♔');
            original.markAsMoved();

            const clone = original.clone();
            expect(clone.getHasMoved()).toBe(true);
        });

        test('should create independent instances', () => {
            const original = new Piece('rook', 'white', 5, '♖');
            const clone = original.clone();

            original.markAsMoved();
            expect(clone.getHasMoved()).toBe(false);
        });
    });

    describe('String Representation', () => {
        test('should provide readable string representation', () => {
            const piece = new Piece('knight', 'black', 3, '♞');
            const str = piece.toString();

            expect(str).toContain('black');
            expect(str).toContain('knight');
            expect(str).toContain('♞');
            expect(str).toContain('3 points');
        });

        test('should indicate moved status in string', () => {
            const piece = new Piece('bishop', 'white', 3, '♗');

            expect(piece.toString()).not.toContain('[moved]');

            piece.markAsMoved();
            expect(piece.toString()).toContain('[moved]');
        });
    });

    describe('JSON Serialization', () => {
        test('should serialize to JSON correctly', () => {
            const piece = new Piece('queen', 'white', 9, '♕');
            piece.markAsMoved();

            const json = piece.toJSON();

            expect(json).toEqual({
                type: 'queen',
                color: 'white',
                points: 9,
                symbol: '♕',
                hasMoved: true,
            });
        });

        test('should serialize unmoved piece correctly', () => {
            const piece = new Piece('pawn', 'black', 1, '♟');
            const json = piece.toJSON();

            expect(json.hasMoved).toBe(false);
        });
    });

    describe('Integration with Constants', () => {
        test('should work with PIECE_VALUES constants', () => {
            Object.keys(PIECE_VALUES).forEach((type) => {
                const piece = new Piece(
                    type,
                    'white',
                    PIECE_VALUES[type],
                    PIECE_SYMBOLS[type]['white']
                );
                expect(piece.getPoints()).toBe(PIECE_VALUES[type]);
            });
        });

        test('should work with PIECE_SYMBOLS constants', () => {
            Object.keys(PIECE_SYMBOLS).forEach((type) => {
                Object.keys(PIECE_SYMBOLS[type]).forEach((color) => {
                    const piece = new Piece(
                        type,
                        color,
                        PIECE_VALUES[type],
                        PIECE_SYMBOLS[type][color]
                    );
                    expect(piece.getSymbol()).toBe(PIECE_SYMBOLS[type][color]);
                });
            });
        });

        test('should work with helper functions', () => {
            const type = PIECE_TYPES.KNIGHT;
            const color = PIECE_COLORS.BLACK;
            const symbol = getPieceSymbol(type, color);
            const value = getPieceValue(type);

            const piece = new Piece(type, color, value, symbol);

            expect(piece.getType()).toBe(type);
            expect(piece.getColor()).toBe(color);
            expect(piece.getSymbol()).toBe(symbol);
            expect(piece.getPoints()).toBe(value);
        });
    });

    describe('Static Properties', () => {
        test('should have correct valid types', () => {
            expect(Piece.VALID_TYPES).toEqual([
                'pawn',
                'rook',
                'knight',
                'bishop',
                'queen',
                'king',
            ]);
        });

        test('should have correct valid colors', () => {
            expect(Piece.VALID_COLORS).toEqual(['white', 'black']);
        });
    });

    describe('Edge Cases', () => {
        test('should handle zero points correctly', () => {
            const piece = new Piece('pawn', 'white', 0, '♙');
            expect(piece.getPoints()).toBe(0);
        });

        test('should handle large point values', () => {
            const piece = new Piece('king', 'white', 10000, '♔');
            expect(piece.getPoints()).toBe(10000);
        });

        test('should handle Unicode symbols correctly', () => {
            const symbols = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];

            symbols.forEach((symbol) => {
                const piece = new Piece('pawn', 'white', 1, symbol);
                expect(piece.getSymbol()).toBe(symbol);
            });
        });
    });
});
