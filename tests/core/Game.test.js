// tests/core/Game.test.js

import { jest } from '@jest/globals';
import { Game } from '../../src/core/Game.js';
import { Board } from '../../src/core/Board.js';
import { BoardRenderer } from '../../src/ui/BoardRenderer.js';
import { GameState } from '../../src/core/GameState.js';

// Mock DOM environment for testing
const mockDOM = () => {
    global.document = {
        createElement: jest.fn(() => ({
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
            appendChild: jest.fn(),
            dataset: {},
            style: {},
            addEventListener: jest.fn(),
        })),
        getElementById: jest.fn(() => ({
            appendChild: jest.fn(),
            children: Array(64)
                .fill()
                .map(() => ({
                    innerHTML: '',
                    appendChild: jest.fn(),
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn(),
                    },
                })),
            addEventListener: jest.fn(),
        })),
        querySelectorAll: jest.fn(() =>
            Array(64)
                .fill()
                .map(() => ({
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn(),
                    },
                }))
        ),
    };
    global.console = {
        log: jest.fn(),
        error: jest.fn(),
    };
};

describe('Game Class - Issue #14 Validation', () => {
    let game;

    beforeEach(() => {
        mockDOM();
        game = new Game('test-board');
    });

    describe('Constructor and Initialization', () => {
        test('should create Game instance with required components', () => {
            expect(game).toBeInstanceOf(Game);
            expect(game.board).toBeInstanceOf(Board);
            expect(game.gameState).toBeInstanceOf(GameState);
            expect(game.boardRenderer).toBeInstanceOf(BoardRenderer);
        });

        test('should initialize game state properties', () => {
            expect(game.selectedSquare).toBe(null);
            expect(game.currentPlayer).toBe('white');
            expect(game.gameStatus).toBe('active');
            expect(game.inputHandler).toBe(null);
        });

        test('should bind handleSquareClick method', () => {
            expect(typeof game.handleSquareClick).toBe('function');
        });
    });

    describe('startGame() Method - Acceptance Criteria #3', () => {
        test('should set up initial board and render it', () => {
            const setupSpy = jest.spyOn(game.board, 'setupInitialBoard');
            const renderSpy = jest.spyOn(game.boardRenderer, 'render');

            game.startGame();

            expect(setupSpy).toHaveBeenCalled();
            expect(renderSpy).toHaveBeenCalledWith(game.board.squares);
        });

        test('should initialize input handling', () => {
            const setupInputSpy = jest.spyOn(game, 'setupInputHandling');

            game.startGame();

            expect(setupInputSpy).toHaveBeenCalled();
        });

        test('should update game state display', () => {
            const updateDisplaySpy = jest.spyOn(game, 'updateGameStateDisplay');

            game.startGame();

            expect(updateDisplaySpy).toHaveBeenCalled();
        });
    });

    describe('Input Handling - Acceptance Criteria #4', () => {
        test('should set up click event listener on board container', () => {
            const mockContainer = {
                addEventListener: jest.fn(),
            };
            jest.spyOn(game.boardRenderer, 'getBoardContainer').mockReturnValue(mockContainer);

            game.setupInputHandling();

            expect(mockContainer.addEventListener).toHaveBeenCalledWith(
                'click',
                game.handleSquareClick
            );
        });

        test('should handle missing board container gracefully', () => {
            jest.spyOn(game.boardRenderer, 'getBoardContainer').mockReturnValue(null);
            const _consoleSpy = jest.spyOn(console, 'error');

            game.setupInputHandling();

            expect(_consoleSpy).toHaveBeenCalledWith(
                'Board container not found. Cannot setup input handling.'
            );
        });
    });

    describe('Game State Management - Acceptance Criteria #4', () => {
        beforeEach(() => {
            game.board.setupInitialBoard();
        });

        test('should manage selectedPiece state', () => {
            // Initially no selection
            expect(game.selectedSquare).toBe(null);

            // Select a white pawn
            game.processSquareSelection(8); // White pawn at a2
            expect(game.selectedSquare).toBe(8);

            // Clear selection
            game.clearSelection();
            expect(game.selectedSquare).toBe(null);
        });

        test('should manage currentPlayer state', () => {
            expect(game.currentPlayer).toBe('white');

            game.switchPlayer();
            expect(game.currentPlayer).toBe('black');

            game.switchPlayer();
            expect(game.currentPlayer).toBe('white');
        });

        test('should only allow selection of current player pieces', () => {
            const _consoleSpy = jest.spyOn(console, 'log');

            // Try to select black piece when white to move
            game.handlePieceSelection(56, game.board.squares[56]); // Black rook
            expect(game.selectedSquare).toBe(null);
            expect(_consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Cannot select black piece')
            );

            // Select white piece
            game.handlePieceSelection(8, game.board.squares[8]); // White pawn
            expect(game.selectedSquare).toBe(8);
        });
    });

    describe('Move Processing - Acceptance Criteria #5', () => {
        beforeEach(() => {
            game.board.setupInitialBoard();
        });

        test('should call board.movePiece() and boardRenderer.render() after valid move', () => {
            const movePieceSpy = jest.spyOn(game.board, 'movePiece');
            const renderSpy = jest.spyOn(game.boardRenderer, 'render');

            // Mock a successful move
            movePieceSpy.mockReturnValue({
                from: 8,
                to: 24,
                pieceMoved: 'pawn',
                pieceCaptured: null,
                success: true,
            });

            const moveResult = game.attemptMove(8, 24); // Pawn move

            expect(movePieceSpy).toHaveBeenCalledWith(8, 24);

            if (moveResult.success) {
                game.processMoveSuccess(moveResult);
                expect(renderSpy).toHaveBeenCalledWith(game.board.squares);
            }
        });

        test('should handle invalid moves gracefully', () => {
            const _consoleSpy = jest.spyOn(console, 'log');

            // Try to move from empty square
            const result = game.attemptMove(20, 28); // Empty square to empty square

            expect(result.success).toBe(false);
            expect(result.reason).toBe('No piece at source square');
        });

        test('should prevent moving opponent pieces', () => {
            const result = game.attemptMove(56, 48); // Try to move black rook when white to move

            expect(result.success).toBe(false);
            expect(result.reason).toBe('Not your piece');
        });
    });

    describe('Turn Management - Acceptance Criteria #6', () => {
        beforeEach(() => {
            game.board.setupInitialBoard();
        });

        test('should switch currentPlayer after successful move', () => {
            expect(game.currentPlayer).toBe('white');

            // Mock successful move
            const mockMoveResult = {
                success: true,
                from: 8,
                to: 24,
                pieceMoved: 'pawn',
                pieceCaptured: null,
                notation: 'a2a3',
            };

            game.processMoveSuccess(mockMoveResult);

            expect(game.currentPlayer).toBe('black');
        });

        test('should update game state after move', () => {
            const updateStateSpy = jest.spyOn(game, 'updateGameState');
            const updateDisplaySpy = jest.spyOn(game, 'updateGameStateDisplay');

            const mockMoveResult = {
                success: true,
                from: 8,
                to: 24,
                pieceMoved: 'pawn',
                pieceCaptured: null,
                notation: 'a2a3',
            };

            game.processMoveSuccess(mockMoveResult);

            expect(updateStateSpy).toHaveBeenCalledWith(mockMoveResult);
            expect(updateDisplaySpy).toHaveBeenCalled();
        });
    });

    describe('Enhanced Features Beyond Requirements', () => {
        beforeEach(() => {
            game.board.setupInitialBoard();
        });

        test('should generate move notation', () => {
            const notation = game.generateMoveNotation(8, 24, 'pawn', null);

            expect(notation).toBe('pawna2a3');
        });

        test('should convert index to square notation', () => {
            expect(game.indexToSquare(0)).toBe('a1');
            expect(game.indexToSquare(7)).toBe('h1');
            expect(game.indexToSquare(56)).toBe('a8');
            expect(game.indexToSquare(63)).toBe('h8');
        });

        test('should handle square highlighting', () => {
            game.highlightSelectedSquare(8);
            // Verify highlight functionality (mocked DOM)
            expect(document.querySelectorAll).toHaveBeenCalledWith('.square');
        });

        test('should provide game state getter', () => {
            const state = game.getGameState();

            expect(state).toHaveProperty('currentPlayer', 'white');
            expect(state).toHaveProperty('gameStatus', 'active');
            expect(state).toHaveProperty('selectedSquare', null);
            expect(state).toHaveProperty('board');
            expect(state).toHaveProperty('moveNumber');
        });

        test('should support game reset', () => {
            // Make a move first
            game.currentPlayer = 'black';
            game.selectedSquare = 8;

            game.resetGame();

            expect(game.currentPlayer).toBe('white');
            expect(game.selectedSquare).toBe(null);
            expect(game.gameStatus).toBe('active');
        });

        test('should provide move history functionality', () => {
            const history = game.getMoveHistory();
            expect(Array.isArray(history)).toBe(true);
            expect(history.length).toBe(0); // Initially empty
        });
    });

    describe('Integration with Enhanced Board.js (Issue #15)', () => {
        beforeEach(() => {
            game.board.setupInitialBoard();
        });

        test('should work with enhanced movePiece method', () => {
            // The enhanced movePiece returns detailed move information
            const result = game.board.movePiece(8, 24);

            expect(result).toHaveProperty('from', 8);
            expect(result).toHaveProperty('to', 24);
            expect(result).toHaveProperty('pieceMoved', 'pawn');
            expect(result).toHaveProperty('pieceCaptured', null);
            expect(result).toHaveProperty('success', true);
        });

        test('should handle piece movement tracking', () => {
            const piece = game.board.squares[8]; // White pawn
            expect(piece.getHasMoved()).toBe(false);

            game.board.movePiece(8, 24);

            expect(piece.getHasMoved()).toBe(true);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle click events on non-square elements', () => {
            const mockEvent = {
                target: {
                    closest: jest.fn().mockReturnValue(null),
                },
            };

            // Should not throw error
            expect(() => game.handleSquareClick(mockEvent)).not.toThrow();
        });

        test('should handle invalid square indices', () => {
            const mockEvent = {
                target: {
                    closest: jest.fn().mockReturnValue({
                        dataset: { index: 'invalid' },
                    }),
                },
            };

            // Should not throw error
            expect(() => game.handleSquareClick(mockEvent)).not.toThrow();
        });

        test('should handle same square selection', () => {
            const result = game.attemptMove(8, 8);

            expect(result.success).toBe(false);
            expect(result.reason).toBe('Cannot move to the same square');
        });
    });
});
