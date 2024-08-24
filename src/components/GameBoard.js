import React, { useState, useEffect } from "react";
import GameCircle from "./GameCircle";
import '../Game.css';
import Header from "./Header";
import Footer from "./Footer";

// Constants
const NUM_ROWS = 6;
const NUM_COLS = 7;
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

    // Function to get available moves
    const getAvailableMoves = (board) => {
        const moves = [];
        for (let col = 0; col < NUM_COLS; col++) {
            if (board[col] === NO_PLAYER) {
                moves.push(col);
            }
        }
        return moves;
    };

    // Function to make a move
    const makeMove = (board, col, player) => {
        const newBoard = [...board];
        for (let row = NUM_ROWS - 1; row >= 0; row--) {
            const index = row * NUM_COLS + col;
            if (newBoard[index] === NO_PLAYER) {
                newBoard[index] = player;
                return newBoard;
            }
        }
        return newBoard;
    };

    // Function to evaluate board state
    const evaluateBoard = (board, player) => {
        const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        let score = 0;

        // Check horizontal, vertical, and diagonal lines
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                if (col <= NUM_COLS - WINNING_LENGTH) {
                    score += evaluateLine(board, row, col, 0, 1, player, opponent);
                }
                if (row <= NUM_ROWS - WINNING_LENGTH) {
                    score += evaluateLine(board, row, col, 1, 0, player, opponent);
                }
                if (row <= NUM_ROWS - WINNING_LENGTH && col <= NUM_COLS - WINNING_LENGTH) {
                    score += evaluateLine(board, row, col, 1, 1, player, opponent);
                }
                if (row <= NUM_ROWS - WINNING_LENGTH && col >= WINNING_LENGTH - 1) {
                    score += evaluateLine(board, row, col, 1, -1, player, opponent);
                }
            }
        }

        return score;
    };

    // Helper function to evaluate a line
    const evaluateLine = (board, row, col, deltaRow, deltaCol, player, opponent) => {
        let playerCount = 0;
        let opponentCount = 0;

        for (let i = 0; i < WINNING_LENGTH; i++) {
            const currentRow = row + i * deltaRow;
            const currentCol = col + i * deltaCol;
            const currentPlayer = board[currentRow * NUM_COLS + currentCol];

            if (currentPlayer === player) playerCount++;
            else if (currentPlayer === opponent) opponentCount++;
        }

        if (playerCount === 4) return 100;
        if (opponentCount === 4) return -100;
        if (playerCount === 3 && opponentCount === 0) return 5;
        if (opponentCount === 3 && playerCount === 0) return -5;
        return playerCount - opponentCount;
    };

    // Function to get the best move for the computer
    const getBestMove = (board, player) => {
        const availableMoves = getAvailableMoves(board);
        let bestMove = -1;
        let bestScore = player === PLAYER_2 ? -Infinity : Infinity;

        for (const move of availableMoves) {
            const newBoard = makeMove(board, move, player);
            const score = evaluateBoard(newBoard, PLAYER_2);

            if (player === PLAYER_2) {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    };

    // Function to handle player moves
    const circleClicked = (id) => {
        if (gameOver || currentPlayer === PLAYER_2) return;

        const col = id % NUM_COLS;
        makePlayerMove(col);
    };

    // Function to make a player move
    const makePlayerMove = (col) => {
        setGameBoard(prev => {
            const updatedBoard = makeMove(prev, col, currentPlayer);
            const winningPlayer = checkWin(updatedBoard);

            if (winningPlayer !== NO_PLAYER) {
                setGameOver(true);
                setWinner(winningPlayer);
            } else {
                setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);
            }

            return updatedBoard;
        });
    };

    // Effect to handle computer moves
    useEffect(() => {
        if (currentPlayer === PLAYER_2 && !gameOver) {
            const timer = setTimeout(() => {
                const bestMove = getBestMove(gameBoard, PLAYER_2);
                if (bestMove !== -1) {
                    makePlayerMove(bestMove);
                }
            }, 500); // Add a small delay for better UX

            return () => clearTimeout(timer);
        }
    }, [currentPlayer, gameOver, gameBoard]);

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