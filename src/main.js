// src/main.js - Entry point for the game

import { Board } from './core/Board.js';
import { BoardRenderer } from './ui/BoardRenderer.js';

const gameBoard = new Board();
const boardRenderer = new BoardRenderer('board');

function initGame() {
    gameBoard.setupInitialBoard();
    boardRenderer.render(gameBoard.squares);
    console.log('Game initialized!');
}

initGame();
