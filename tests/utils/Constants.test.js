// tests/utils/Constants.test.js

import {
    PIECE_VALUES,
    PIECE_SYMBOLS,
    PIECE_SYMBOLS_ALT,
    PIECE_TYPES,
    PIECE_COLORS,
    BOARD_SIZE,
    TOTAL_SQUARES,
    STARTING_POSITIONS,
    getPieceSymbol,
    getPieceValue,
    isValidPieceType,
    isValidPieceColor,
    getAllPieceTypes,
    getAllPieceColors,
} from '../../src/utils/Constants.js';

describe('Constants', () => {
    describe('PIECE_VALUES', () => {
        test('should have correct values for all piece types', () => {
            expect(PIECE_VALUES.pawn).toBe(1);
            expect(PIECE_VALUES.knight).toBe(3);
            expect(PIECE_VALUES.bishop).toBe(3);
            expect(PIECE_VALUES.rook).toBe(5);
            expect(PIECE_VALUES.queen).toBe(9);
            expect(PIECE_VALUES.king).toBe(1000);
        });

        test('should have all required piece types', () => {
            const expectedTypes = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
            expectedTypes.forEach((type) => {
                expect(PIECE_VALUES).toHaveProperty(type);
                expect(typeof PIECE_VALUES[type]).toBe('number');
                expect(PIECE_VALUES[type]).toBeGreaterThan(0);
            });
        });
    });

    describe('PIECE_SYMBOLS', () => {
        test('should have symbols for all piece types and colors', () => {
            const types = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
            const colors = ['white', 'black'];

            types.forEach((type) => {
                expect(PIECE_SYMBOLS).toHaveProperty(type);
                colors.forEach((color) => {
                    expect(PIECE_SYMBOLS[type]).toHaveProperty(color);
                    expect(typeof PIECE_SYMBOLS[type][color]).toBe('string');
                    expect(PIECE_SYMBOLS[type][color].length).toBeGreaterThan(0);
                });
            });
        });

        test('should have different symbols for white and black pieces', () => {
            Object.keys(PIECE_SYMBOLS).forEach((type) => {
                expect(PIECE_SYMBOLS[type].white).not.toBe(PIECE_SYMBOLS[type].black);
            });
        });

        test('should have valid Unicode chess symbols', () => {
            // Test that symbols are actual Unicode chess pieces
            const whiteSymbols = Object.values(PIECE_SYMBOLS).map((p) => p.white);
            const blackSymbols = Object.values(PIECE_SYMBOLS).map((p) => p.black);

            // All symbols should be single characters (Unicode chess pieces)
            [...whiteSymbols, ...blackSymbols].forEach((symbol) => {
                expect(symbol.length).toBe(1);
                // Unicode chess pieces are in the range U+2654 to U+265F
                const codePoint = symbol.codePointAt(0);
                expect(codePoint).toBeGreaterThanOrEqual(0x2654);
                expect(codePoint).toBeLessThanOrEqual(0x265f);
            });
        });
    });

    describe('PIECE_SYMBOLS_ALT', () => {
        test('should have alternative symbols for all piece types and colors', () => {
            const types = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
            const colors = ['white', 'black'];

            types.forEach((type) => {
                expect(PIECE_SYMBOLS_ALT).toHaveProperty(type);
                colors.forEach((color) => {
                    expect(PIECE_SYMBOLS_ALT[type]).toHaveProperty(color);
                    expect(typeof PIECE_SYMBOLS_ALT[type][color]).toBe('string');
                    expect(PIECE_SYMBOLS_ALT[type][color].length).toBeGreaterThan(0);
                });
            });
        });
    });

    describe('PIECE_TYPES', () => {
        test('should have all required piece type constants', () => {
            expect(PIECE_TYPES.PAWN).toBe('pawn');
            expect(PIECE_TYPES.ROOK).toBe('rook');
            expect(PIECE_TYPES.KNIGHT).toBe('knight');
            expect(PIECE_TYPES.BISHOP).toBe('bishop');
            expect(PIECE_TYPES.QUEEN).toBe('queen');
            expect(PIECE_TYPES.KING).toBe('king');
        });

        test('should have exactly 6 piece types', () => {
            expect(Object.keys(PIECE_TYPES)).toHaveLength(6);
        });
    });

    describe('PIECE_COLORS', () => {
        test('should have correct color constants', () => {
            expect(PIECE_COLORS.WHITE).toBe('white');
            expect(PIECE_COLORS.BLACK).toBe('black');
        });

        test('should have exactly 2 colors', () => {
            expect(Object.keys(PIECE_COLORS)).toHaveLength(2);
        });
    });

    describe('Board Constants', () => {
        test('should have correct board dimensions', () => {
            expect(BOARD_SIZE).toBe(8);
            expect(TOTAL_SQUARES).toBe(64);
            expect(BOARD_SIZE * BOARD_SIZE).toBe(TOTAL_SQUARES);
        });
    });

    describe('STARTING_POSITIONS', () => {
        test('should have positions for both colors', () => {
            expect(STARTING_POSITIONS).toHaveProperty('white');
            expect(STARTING_POSITIONS).toHaveProperty('black');
        });

        test('should have correct piece counts', () => {
            // White pieces
            expect(STARTING_POSITIONS.white.rooks).toHaveLength(2);
            expect(STARTING_POSITIONS.white.knights).toHaveLength(2);
            expect(STARTING_POSITIONS.white.bishops).toHaveLength(2);
            expect(STARTING_POSITIONS.white.queen).toHaveLength(1);
            expect(STARTING_POSITIONS.white.king).toHaveLength(1);
            expect(STARTING_POSITIONS.white.pawns).toHaveLength(8);

            // Black pieces
            expect(STARTING_POSITIONS.black.rooks).toHaveLength(2);
            expect(STARTING_POSITIONS.black.knights).toHaveLength(2);
            expect(STARTING_POSITIONS.black.bishops).toHaveLength(2);
            expect(STARTING_POSITIONS.black.queen).toHaveLength(1);
            expect(STARTING_POSITIONS.black.king).toHaveLength(1);
            expect(STARTING_POSITIONS.black.pawns).toHaveLength(8);
        });

        test('should have valid board positions', () => {
            const allPositions = [
                ...STARTING_POSITIONS.white.rooks,
                ...STARTING_POSITIONS.white.knights,
                ...STARTING_POSITIONS.white.bishops,
                ...STARTING_POSITIONS.white.queen,
                ...STARTING_POSITIONS.white.king,
                ...STARTING_POSITIONS.white.pawns,
                ...STARTING_POSITIONS.black.rooks,
                ...STARTING_POSITIONS.black.knights,
                ...STARTING_POSITIONS.black.bishops,
                ...STARTING_POSITIONS.black.queen,
                ...STARTING_POSITIONS.black.king,
                ...STARTING_POSITIONS.black.pawns,
            ];

            allPositions.forEach((position) => {
                expect(position).toBeGreaterThanOrEqual(0);
                expect(position).toBeLessThan(64);
                expect(Number.isInteger(position)).toBe(true);
            });
        });

        test('should have no overlapping positions', () => {
            const allPositions = [
                ...STARTING_POSITIONS.white.rooks,
                ...STARTING_POSITIONS.white.knights,
                ...STARTING_POSITIONS.white.bishops,
                ...STARTING_POSITIONS.white.queen,
                ...STARTING_POSITIONS.white.king,
                ...STARTING_POSITIONS.white.pawns,
                ...STARTING_POSITIONS.black.rooks,
                ...STARTING_POSITIONS.black.knights,
                ...STARTING_POSITIONS.black.bishops,
                ...STARTING_POSITIONS.black.queen,
                ...STARTING_POSITIONS.black.king,
                ...STARTING_POSITIONS.black.pawns,
            ];

            const uniquePositions = new Set(allPositions);
            expect(uniquePositions.size).toBe(allPositions.length);
        });
    });

    describe('getPieceSymbol', () => {
        test('should return correct symbols for valid inputs', () => {
            expect(getPieceSymbol('pawn', 'white')).toBe(PIECE_SYMBOLS.pawn.white);
            expect(getPieceSymbol('king', 'black')).toBe(PIECE_SYMBOLS.king.black);
            expect(getPieceSymbol('queen', 'white')).toBe(PIECE_SYMBOLS.queen.white);
        });

        test('should return alternative symbols when requested', () => {
            expect(getPieceSymbol('pawn', 'white', true)).toBe(PIECE_SYMBOLS_ALT.pawn.white);
            expect(getPieceSymbol('king', 'black', true)).toBe(PIECE_SYMBOLS_ALT.king.black);
        });

        test('should throw error for invalid piece type', () => {
            expect(() => getPieceSymbol('invalid', 'white')).toThrow('Invalid piece type: invalid');
        });

        test('should throw error for invalid piece color', () => {
            expect(() => getPieceSymbol('pawn', 'red')).toThrow('Invalid piece color: red');
        });
    });

    describe('getPieceValue', () => {
        test('should return correct values for all piece types', () => {
            expect(getPieceValue('pawn')).toBe(1);
            expect(getPieceValue('knight')).toBe(3);
            expect(getPieceValue('bishop')).toBe(3);
            expect(getPieceValue('rook')).toBe(5);
            expect(getPieceValue('queen')).toBe(9);
            expect(getPieceValue('king')).toBe(1000);
        });

        test('should throw error for invalid piece type', () => {
            expect(() => getPieceValue('invalid')).toThrow('Invalid piece type: invalid');
        });
    });

    describe('isValidPieceType', () => {
        test('should return true for valid piece types', () => {
            const validTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
            validTypes.forEach((type) => {
                expect(isValidPieceType(type)).toBe(true);
            });
        });

        test('should return false for invalid piece types', () => {
            const invalidTypes = ['invalid', '', null, undefined, 123];
            invalidTypes.forEach((type) => {
                expect(isValidPieceType(type)).toBe(false);
            });
        });
    });

    describe('isValidPieceColor', () => {
        test('should return true for valid piece colors', () => {
            expect(isValidPieceColor('white')).toBe(true);
            expect(isValidPieceColor('black')).toBe(true);
        });

        test('should return false for invalid piece colors', () => {
            const invalidColors = ['red', 'blue', '', null, undefined, 123];
            invalidColors.forEach((color) => {
                expect(isValidPieceColor(color)).toBe(false);
            });
        });
    });

    describe('getAllPieceTypes', () => {
        test('should return all valid piece types', () => {
            const types = getAllPieceTypes();
            expect(types).toEqual(['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']);
            expect(types).toHaveLength(6);
        });

        test('should return a new array each time', () => {
            const types1 = getAllPieceTypes();
            const types2 = getAllPieceTypes();
            expect(types1).not.toBe(types2); // Different array instances
            expect(types1).toEqual(types2); // Same content
        });
    });

    describe('getAllPieceColors', () => {
        test('should return all valid piece colors', () => {
            const colors = getAllPieceColors();
            expect(colors).toEqual(['white', 'black']);
            expect(colors).toHaveLength(2);
        });

        test('should return a new array each time', () => {
            const colors1 = getAllPieceColors();
            const colors2 = getAllPieceColors();
            expect(colors1).not.toBe(colors2); // Different array instances
            expect(colors1).toEqual(colors2); // Same content
        });
    });

    describe('Integration Tests', () => {
        test('should have consistent data across all constants', () => {
            // All piece types in PIECE_VALUES should have symbols
            Object.keys(PIECE_VALUES).forEach((type) => {
                expect(PIECE_SYMBOLS).toHaveProperty(type);
                expect(PIECE_SYMBOLS_ALT).toHaveProperty(type);
            });

            // All piece types in PIECE_SYMBOLS should have values
            Object.keys(PIECE_SYMBOLS).forEach((type) => {
                expect(PIECE_VALUES).toHaveProperty(type);
            });

            // PIECE_TYPES values should match keys in other constants
            Object.values(PIECE_TYPES).forEach((type) => {
                expect(PIECE_VALUES).toHaveProperty(type);
                expect(PIECE_SYMBOLS).toHaveProperty(type);
            });
        });

        test('should work together with helper functions', () => {
            getAllPieceTypes().forEach((type) => {
                getAllPieceColors().forEach((color) => {
                    expect(() => getPieceSymbol(type, color)).not.toThrow();
                    expect(() => getPieceValue(type)).not.toThrow();
                    expect(isValidPieceType(type)).toBe(true);
                    expect(isValidPieceColor(color)).toBe(true);
                });
            });
        });
    });
});
