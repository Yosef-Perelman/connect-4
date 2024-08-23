import React, { useState } from "react";
import GameCircle from "./GameCircle";
import '../Game.css';
import Header from "./Header";
import Footer from "./Footer";

// Constants
const NUM_ROWS = 6; // Number of rows in the board
const NUM_COLS = 7; // Number of columns in the board
const WINNING_LENGTH = 4;
const NO_PLAYER = 0;
const PLAYER_1 = 1;
const PLAYER_2 = 2;

const GameBoard = () => {
    const [gameBoard, setGameBoard] = useState(Array(NUM_ROWS * NUM_COLS).fill(NO_PLAYER));
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(NO_PLAYER);

    // Function to check for a win
    const checkWin = (board) => {
        const checkLine = (startRow, startCol, deltaRow, deltaCol) => {
            const player = board[startRow * NUM_COLS + startCol];
            if (player === NO_PLAYER) return false;

            for (let i = 1; i < WINNING_LENGTH; i++) {
                const row = startRow + i * deltaRow;
                const col = startCol + i * deltaCol;
                if (row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS || board[row * NUM_COLS + col] !== player) {
                    return false;
                }
            }
            return true;
        };

        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                if (col <= NUM_COLS - WINNING_LENGTH && checkLine(row, col, 0, 1)) {
                    return board[row * NUM_COLS + col];
                }

                if (row <= NUM_ROWS - WINNING_LENGTH && checkLine(row, col, 1, 0)) {
                    return board[row * NUM_COLS + col];
                }

                if (row <= NUM_ROWS - WINNING_LENGTH && col <= NUM_COLS - WINNING_LENGTH && checkLine(row, col, 1, 1)) {
                    return board[row * NUM_COLS + col];
                }

                if (row <= NUM_ROWS - WINNING_LENGTH && col >= WINNING_LENGTH - 1 && checkLine(row, col, 1, -1)) {
                    return board[row * NUM_COLS + col];
                }
            }
        }

        return NO_PLAYER;
    };

    // Place circle in the lowest available cell in the selected column
    const circleClicked = (id) => {
        if (gameOver) return; // Prevent clicking if the game is over

        const col = id % NUM_COLS; // Determine the column
        let placed = false;
        
        setGameBoard(prev => {
            const updatedBoard = [...prev];

            // Find the lowest available cell in the selected column
            for (let row = NUM_ROWS - 1; row >= 0; row--) {
                const index = row * NUM_COLS + col;
                if (updatedBoard[index] === NO_PLAYER) {
                    updatedBoard[index] = currentPlayer;
                    placed = true;
                    break;
                }
            }

            if (placed) {
                // Check if the current player has won
                const winningPlayer = checkWin(updatedBoard);
                if (winningPlayer !== NO_PLAYER) {
                    setGameOver(true);
                    setWinner(winningPlayer);
                }

                // Switch to the other player
                setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);
            }

            return updatedBoard;
        });
    };

    const resetGame = () => {
        setGameBoard(Array(NUM_ROWS * NUM_COLS).fill(NO_PLAYER));
        setCurrentPlayer(PLAYER_1);
        setGameOver(false);
        setWinner(NO_PLAYER);
    };

    const renderCircle = id => {
        return <GameCircle key={id} id={id} className={`player_${gameBoard[id]}`} onCircleClicked={circleClicked} />;
    };

    const initBoard = () => {
        const circles = [];
        for (let i = 0; i < NUM_ROWS * NUM_COLS; i++) {
            circles.push(renderCircle(i));
        }
        return circles;
    };

    return (
        <>
            <Header player={currentPlayer} winner={winner}/>
            <div className="gameBoard">
                {initBoard()}
            </div>
            <Footer onNewGameClick={resetGame} />
        </>
    );
};

export default GameBoard;
