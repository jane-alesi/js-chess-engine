// src/ui/InputHandler.js

/**
 * InputHandler class manages user input for the chess board
 * Handles click events on squares and manages piece selection state
 */
export class InputHandler {
    constructor(boardElement, onSquareClick) {
        this.boardElement = boardElement;
        this.onSquareClick = onSquareClick; // Callback function for square clicks
        this.selectedSquare = null; // Currently selected square index
        this.isFirstClick = true; // Track if this is the first or second click
        
        this.attachEventListeners();
    }

    /**
     * Attach click event listeners to all board squares
     */
    attachEventListeners() {
        if (!this.boardElement) {
            console.error('Board element not found');
            return;
        }

        // Add event listener to the board container using event delegation
        this.boardElement.addEventListener('click', (event) => {
            this.handleSquareClick(event);
        });
    }

    /**
     * Handle click events on board squares
     * @param {Event} event - The click event
     */
    handleSquareClick(event) {
        const square = event.target.closest('[data-index]');
        if (!square) return;

        const squareIndex = parseInt(square.dataset.index);
        if (isNaN(squareIndex) || squareIndex < 0 || squareIndex >= 64) {
            console.error('Invalid square index:', squareIndex);
            return;
        }

        if (this.isFirstClick) {
            // First click - select a piece
            this.selectSquare(squareIndex);
        } else {
            // Second click - attempt to move or reselect
            if (squareIndex === this.selectedSquare) {
                // Clicking the same square deselects it
                this.deselectSquare();
            } else {
                // Attempt to move to the new square
                this.attemptMove(this.selectedSquare, squareIndex);
            }
        }
    }

    /**
     * Select a square and provide visual feedback
     * @param {number} squareIndex - The index of the square to select
     */
    selectSquare(squareIndex) {
        // Clear any previous selection
        this.clearHighlights();

        this.selectedSquare = squareIndex;
        this.isFirstClick = false;

        // Add visual feedback for selected square
        const squareElement = this.getSquareElement(squareIndex);
        if (squareElement) {
            squareElement.classList.add('selected');
        }

        // Notify the game logic about the selection
        if (this.onSquareClick) {
            this.onSquareClick({
                type: 'select',
                squareIndex: squareIndex,
                selectedSquare: this.selectedSquare
            });
        }
    }

    /**
     * Deselect the currently selected square
     */
    deselectSquare() {
        if (this.selectedSquare !== null) {
            const squareElement = this.getSquareElement(this.selectedSquare);
            if (squareElement) {
                squareElement.classList.remove('selected');
            }
        }

        this.selectedSquare = null;
        this.isFirstClick = true;
        this.clearHighlights();
    }

    /**
     * Attempt to move from the selected square to the target square
     * @param {number} fromIndex - Source square index
     * @param {number} toIndex - Target square index
     */
    attemptMove(fromIndex, toIndex) {
        // Notify the game logic about the move attempt
        if (this.onSquareClick) {
            this.onSquareClick({
                type: 'move',
                from: fromIndex,
                to: toIndex,
                selectedSquare: this.selectedSquare
            });
        }

        // Reset selection state after move attempt
        this.deselectSquare();
    }

    /**
     * Get the DOM element for a specific square
     * @param {number} squareIndex - The square index
     * @returns {Element|null} The square element or null if not found
     */
    getSquareElement(squareIndex) {
        return this.boardElement.querySelector(`[data-index="${squareIndex}"]`);
    }

    /**
     * Clear all visual highlights from the board
     */
    clearHighlights() {
        const squares = this.boardElement.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected', 'valid-move', 'last-move');
        });
    }

    /**
     * Highlight valid moves for the currently selected piece
     * @param {number[]} validMoves - Array of valid move square indices
     */
    highlightValidMoves(validMoves) {
        this.clearHighlights();
        
        // Re-highlight selected square
        if (this.selectedSquare !== null) {
            const selectedElement = this.getSquareElement(this.selectedSquare);
            if (selectedElement) {
                selectedElement.classList.add('selected');
            }
        }

        // Highlight valid moves
        validMoves.forEach(moveIndex => {
            const squareElement = this.getSquareElement(moveIndex);
            if (squareElement) {
                squareElement.classList.add('valid-move');
            }
        });
    }

    /**
     * Highlight the last move made
     * @param {number} fromIndex - Source square of the last move
     * @param {number} toIndex - Target square of the last move
     */
    highlightLastMove(fromIndex, toIndex) {
        // Clear previous last-move highlights
        const lastMoveSquares = this.boardElement.querySelectorAll('.last-move');
        lastMoveSquares.forEach(square => {
            square.classList.remove('last-move');
        });

        // Highlight the new last move
        const fromElement = this.getSquareElement(fromIndex);
        const toElement = this.getSquareElement(toIndex);
        
        if (fromElement) fromElement.classList.add('last-move');
        if (toElement) toElement.classList.add('last-move');
    }

    /**
     * Reset the input handler state
     */
    reset() {
        this.deselectSquare();
        this.clearHighlights();
    }

    /**
     * Destroy the input handler and remove event listeners
     */
    destroy() {
        if (this.boardElement) {
            this.boardElement.removeEventListener('click', this.handleSquareClick);
        }
        this.reset();
    }
}