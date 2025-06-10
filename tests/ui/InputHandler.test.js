// tests/ui/InputHandler.test.js

import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { InputHandler } from '../../src/ui/InputHandler.js';

describe('InputHandler', () => {
    let inputHandler;
    let mockCallback;
    let mockBoardElement;
    let mockSquareElement;

    beforeEach(() => {
        // Create fresh mocks for each test
        mockBoardElement = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            querySelector: jest.fn(),
            querySelectorAll: jest.fn(() => [])
        };

        mockSquareElement = {
            dataset: { index: '0' },
            classList: { add: jest.fn(), remove: jest.fn() },
            closest: jest.fn()
        };

        mockCallback = jest.fn();
        
        // Setup default mock returns
        mockBoardElement.querySelector.mockReturnValue(mockSquareElement);
        mockSquareElement.closest.mockReturnValue(mockSquareElement);
    });

    afterEach(() => {
        if (inputHandler) {
            inputHandler.destroy();
            inputHandler = null;
        }
    });

    describe('Constructor', () => {
        test('should initialize with correct properties', () => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
            
            expect(inputHandler.boardElement).toBe(mockBoardElement);
            expect(inputHandler.onSquareClick).toBe(mockCallback);
            expect(inputHandler.selectedSquare).toBeNull();
            expect(inputHandler.isFirstClick).toBe(true);
        });

        test('should attach event listeners on initialization', () => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
            
            expect(mockBoardElement.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('should handle missing board element gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            inputHandler = new InputHandler(null, mockCallback);
            expect(consoleSpy).toHaveBeenCalledWith('Board element not found');
            consoleSpy.mockRestore();
        });
    });

    describe('Square Selection', () => {
        beforeEach(() => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
        });

        test('should select a square on first click', () => {
            const mockEvent = {
                target: mockSquareElement
            };

            inputHandler.handleSquareClick(mockEvent);

            expect(inputHandler.selectedSquare).toBe(0);
            expect(inputHandler.isFirstClick).toBe(false);
            expect(mockSquareElement.classList.add).toHaveBeenCalledWith('selected');
            expect(mockCallback).toHaveBeenCalledWith({
                type: 'select',
                squareIndex: 0,
                selectedSquare: 0
            });
        });

        test('should deselect square when clicking the same square twice', () => {
            // First click to select
            inputHandler.selectedSquare = 0;
            inputHandler.isFirstClick = false;

            const mockEvent = {
                target: mockSquareElement
            };

            inputHandler.handleSquareClick(mockEvent);

            expect(inputHandler.selectedSquare).toBeNull();
            expect(inputHandler.isFirstClick).toBe(true);
            expect(mockSquareElement.classList.remove).toHaveBeenCalledWith('selected');
        });

        test('should attempt move when clicking different square on second click', () => {
            // Setup: first square selected
            inputHandler.selectedSquare = 0;
            inputHandler.isFirstClick = false;

            // Mock second square
            const mockSecondSquare = {
                dataset: { index: '8' },
                classList: { add: jest.fn(), remove: jest.fn() },
                closest: jest.fn().mockReturnValue({
                    dataset: { index: '8' },
                    classList: { add: jest.fn(), remove: jest.fn() }
                })
            };

            const mockEvent = {
                target: mockSecondSquare
            };

            inputHandler.handleSquareClick(mockEvent);

            expect(mockCallback).toHaveBeenCalledWith({
                type: 'move',
                from: 0,
                to: 8,
                selectedSquare: 0
            });
            expect(inputHandler.selectedSquare).toBeNull();
            expect(inputHandler.isFirstClick).toBe(true);
        });
    });

    describe('Input Validation', () => {
        beforeEach(() => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
        });

        test('should ignore clicks on non-square elements', () => {
            const mockEvent = {
                target: { closest: jest.fn().mockReturnValue(null) }
            };

            inputHandler.handleSquareClick(mockEvent);

            expect(mockCallback).not.toHaveBeenCalled();
        });

        test('should handle invalid square indices', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const mockInvalidSquare = {
                dataset: { index: 'invalid' },
                closest: jest.fn().mockReturnValue({
                    dataset: { index: 'invalid' }
                })
            };

            const mockEvent = {
                target: mockInvalidSquare
            };

            inputHandler.handleSquareClick(mockEvent);

            expect(consoleSpy).toHaveBeenCalledWith('Invalid square index:', NaN);
            expect(mockCallback).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        test('should handle out-of-bounds square indices', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const mockOutOfBoundsSquare = {
                dataset: { index: '64' },
                closest: jest.fn().mockReturnValue({
                    dataset: { index: '64' }
                })
            };

            const mockEvent = {
                target: mockOutOfBoundsSquare
            };

            inputHandler.handleSquareClick(mockEvent);

            expect(consoleSpy).toHaveBeenCalledWith('Invalid square index:', 64);
            expect(mockCallback).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('Visual Feedback', () => {
        beforeEach(() => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
        });

        test('should highlight valid moves', () => {
            const validMoves = [8, 16, 24];
            const mockSquares = validMoves.map(_index => ({
                classList: { add: jest.fn(), remove: jest.fn() }
            }));

            mockBoardElement.querySelector
                .mockReturnValueOnce(mockSquareElement) // for selected square
                .mockReturnValueOnce(mockSquares[0])
                .mockReturnValueOnce(mockSquares[1])
                .mockReturnValueOnce(mockSquares[2]);

            inputHandler.selectedSquare = 0;
            inputHandler.highlightValidMoves(validMoves);

            mockSquares.forEach(square => {
                expect(square.classList.add).toHaveBeenCalledWith('valid-move');
            });
        });

        test('should highlight last move', () => {
            const fromSquare = { classList: { add: jest.fn(), remove: jest.fn() } };
            const toSquare = { classList: { add: jest.fn(), remove: jest.fn() } };

            mockBoardElement.querySelector
                .mockReturnValueOnce(fromSquare)
                .mockReturnValueOnce(toSquare);

            inputHandler.highlightLastMove(0, 8);

            expect(fromSquare.classList.add).toHaveBeenCalledWith('last-move');
            expect(toSquare.classList.add).toHaveBeenCalledWith('last-move');
        });

        test('should clear all highlights', () => {
            const mockSquares = [
                { classList: { remove: jest.fn() } },
                { classList: { remove: jest.fn() } }
            ];

            mockBoardElement.querySelectorAll.mockReturnValue(mockSquares);

            inputHandler.clearHighlights();
            mockSquares.forEach(square => {
                expect(square.classList.remove).toHaveBeenCalledWith('selected', 'valid-move', 'last-move');
            });
        });
    });

    describe('State Management', () => {
        beforeEach(() => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
        });

        test('should reset state correctly', () => {
            inputHandler.selectedSquare = 5;
            inputHandler.isFirstClick = false;

            inputHandler.reset();

            expect(inputHandler.selectedSquare).toBeNull();
            expect(inputHandler.isFirstClick).toBe(true);
        });

        test('should get square element by index', () => {
            const squareIndex = 15;
            inputHandler.getSquareElement(squareIndex);

            expect(mockBoardElement.querySelector).toHaveBeenCalledWith(`[data-index="${squareIndex}"]`);
        });
    });

    describe('Cleanup', () => {
        test('should remove event listeners on destroy', () => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
            
            inputHandler.destroy();

            expect(mockBoardElement.removeEventListener).toHaveBeenCalledWith('click', inputHandler.handleSquareClick);
        });

        test('should reset state on destroy', () => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
            
            inputHandler.selectedSquare = 10;
            inputHandler.isFirstClick = false;

            inputHandler.destroy();

            expect(inputHandler.selectedSquare).toBeNull();
            expect(inputHandler.isFirstClick).toBe(true);
        });

        test('should handle destroy with null board element', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            inputHandler = new InputHandler(null, mockCallback);
            consoleSpy.mockRestore();
            
            // This should not throw an error
            expect(() => inputHandler.destroy()).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        test('should handle missing callback function', () => {
            inputHandler = new InputHandler(mockBoardElement, null);
            const mockEvent = {
                target: mockSquareElement
            };

            expect(() => inputHandler.handleSquareClick(mockEvent)).not.toThrow();
        });

        test('should handle missing square elements in highlight methods', () => {
            inputHandler = new InputHandler(mockBoardElement, mockCallback);
            mockBoardElement.querySelector.mockReturnValue(null);

            expect(() => inputHandler.highlightValidMoves([8, 16])).not.toThrow();
            expect(() => inputHandler.highlightLastMove(0, 8)).not.toThrow();
        });
    });
});