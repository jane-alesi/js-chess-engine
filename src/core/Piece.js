// src/core/Piece.js

export class Piece {
    constructor(type, color, points, symbol) {
        this.type = type; // 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
        this.color = color; // 'white', 'black'
        this.points = points; // Value for AI evaluation
        this.symbol = symbol; // Unicode character for display
        this.hasMoved = false; // Important for castling and pawn's initial double move
    }

    // Method to get piece color
    getColor() {
        return this.color;
    }

    // Method to get piece type
    getType() {
        return this.type;
    }
}
