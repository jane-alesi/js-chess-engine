// src/ui/BoardRenderer.js

export class BoardRenderer {
    constructor(boardElementId) {
        this.boardElement = document.getElementById(boardElementId);
        if (!this.boardElement) {
            console.error(`Board element with ID '${boardElementId}' not found.`);
            return;
        }
        this.createBoardSquares();
    }

    createBoardSquares() {
        for (let i = 0; i < 64; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            const row = Math.floor(i / 8);
            const col = i % 8;
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            square.dataset.index = i; // Store index for easy access
            this.boardElement.appendChild(square);
        }
    }

    render(squares) {
        const boardSquares = this.boardElement.children;
        for (let i = 0; i < 64; i++) {
            const squareElement = boardSquares[i];
            squareElement.innerHTML = ''; // Clear previous piece
            if (squares[i]) {
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                pieceElement.textContent = squares[i].symbol;
                pieceElement.style.color = squares[i].color === 'white' ? 'white' : 'black'; // Basic styling
                squareElement.appendChild(pieceElement);
            }
        }
    }
}
