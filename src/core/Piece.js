// src/core/Piece.js

/**
 * Represents a chess piece with type, color, value, and movement tracking.
 * Implements ES2022 class fields syntax for modern JavaScript standards.
 * 
 * @class Piece
 * @author Jane Alesi Chess Engine
 * @version 1.0.0
 */
export class Piece {
    // ES2022 class fields with proper validation
    static VALID_TYPES = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
    static VALID_COLORS = ['white', 'black'];

    // Private fields for internal state management
    #type;
    #color;
    #points;
    #symbol;
    #hasMoved = false;

    /**
     * Creates a new chess piece instance.
     * 
     * @param {string} type - The piece type ('pawn', 'rook', 'knight', 'bishop', 'queen', 'king')
     * @param {string} color - The piece color ('white', 'black')
     * @param {number} points - The piece value for AI evaluation
     * @param {string} symbol - Unicode character for display
     * @throws {Error} If invalid parameters are provided
     */
    constructor(type, color, points, symbol) {
        // Validate input parameters
        if (!type || typeof type !== 'string') {
            throw new Error('Piece type must be a non-empty string');
        }
        if (!Piece.VALID_TYPES.includes(type.toLowerCase())) {
            throw new Error(`Invalid piece type: ${type}. Must be one of: ${Piece.VALID_TYPES.join(', ')}`);
        }
        if (!color || typeof color !== 'string') {
            throw new Error('Piece color must be a non-empty string');
        }
        if (!Piece.VALID_COLORS.includes(color.toLowerCase())) {
            throw new Error(`Invalid piece color: ${color}. Must be one of: ${Piece.VALID_COLORS.join(', ')}`);
        }
        if (typeof points !== 'number' || points < 0) {
            throw new Error('Piece points must be a non-negative number');
        }
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Piece symbol must be a non-empty string');
        }

        // Set validated properties
        this.#type = type.toLowerCase();
        this.#color = color.toLowerCase();
        this.#points = points;
        this.#symbol = symbol;
    }

    /**
     * Gets the piece type.
     * 
     * @returns {string} The piece type
     */
    getType() {
        return this.#type;
    }

    /**
     * Gets the piece color.
     * 
     * @returns {string} The piece color
     */
    getColor() {
        return this.#color;
    }

    /**
     * Gets the piece point value for AI evaluation.
     * 
     * @returns {number} The piece point value
     */
    getPoints() {
        return this.#points;
    }

    /**
     * Gets the piece Unicode symbol for display.
     * 
     * @returns {string} The piece symbol
     */
    getSymbol() {
        return this.#symbol;
    }

    /**
     * Checks if the piece has moved (important for castling and pawn initial moves).
     * 
     * @returns {boolean} True if the piece has moved, false otherwise
     */
    getHasMoved() {
        return this.#hasMoved;
    }

    /**
     * Marks the piece as having moved.
     * This is crucial for chess rules like castling and pawn double moves.
     * 
     * @throws {Error} If piece has already moved
     */
    markAsMoved() {
        if (this.#hasMoved) {
            throw new Error(`${this.#color} ${this.#type} has already been marked as moved`);
        }
        this.#hasMoved = true;
    }

    /**
     * Resets the piece's moved status (useful for undo operations).
     * 
     * @throws {Error} If piece hasn't moved yet
     */
    resetMovedStatus() {
        if (!this.#hasMoved) {
            throw new Error(`${this.#color} ${this.#type} hasn't moved yet`);
        }
        this.#hasMoved = false;
    }

    /**
     * Checks if this piece is an opponent of another piece.
     * 
     * @param {Piece} otherPiece - The piece to compare against
     * @returns {boolean} True if pieces are opponents, false otherwise
     * @throws {Error} If otherPiece is not a valid Piece instance
     */
    isOpponent(otherPiece) {
        if (!(otherPiece instanceof Piece)) {
            throw new Error('Parameter must be a Piece instance');
        }
        return this.#color !== otherPiece.getColor();
    }

    /**
     * Checks if this piece is an ally of another piece.
     * 
     * @param {Piece} otherPiece - The piece to compare against
     * @returns {boolean} True if pieces are allies, false otherwise
     * @throws {Error} If otherPiece is not a valid Piece instance
     */
    isAlly(otherPiece) {
        if (!(otherPiece instanceof Piece)) {
            throw new Error('Parameter must be a Piece instance');
        }
        return this.#color === otherPiece.getColor();
    }

    /**
     * Creates a deep copy of the piece.
     * 
     * @returns {Piece} A new Piece instance with the same properties
     */
    clone() {
        const clonedPiece = new Piece(this.#type, this.#color, this.#points, this.#symbol);
        if (this.#hasMoved) {
            clonedPiece.markAsMoved();
        }
        return clonedPiece;
    }

    /**
     * Returns a string representation of the piece.
     * 
     * @returns {string} String representation for debugging
     */
    toString() {
        return `${this.#color} ${this.#type} (${this.#symbol}) - ${this.#points} points${this.#hasMoved ? ' [moved]' : ''}`;
    }

    /**
     * Returns a JSON representation of the piece.
     * 
     * @returns {Object} JSON object with piece properties
     */
    toJSON() {
        return {
            type: this.#type,
            color: this.#color,
            points: this.#points,
            symbol: this.#symbol,
            hasMoved: this.#hasMoved
        };
    }
}