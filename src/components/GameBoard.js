import React, { useState, useEffect } from "react";
import GameCircle from "./GameCircle";
import '../Game.css';
import Header from "./Header";
import Footer from "./Footer";
import { 
    NUM_ROWS, NUM_COLS, NO_PLAYER, PLAYER_1, PLAYER_2,
    checkWin, getAvailableMoves, makeMove, getBestMove
} from "./GameLogic";

const GameBoard = () => {
    const [gameBoard, setGameBoard] = useState(Array(NUM_ROWS * NUM_COLS).fill(NO_PLAYER));
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(NO_PLAYER);
    const [isDraw, setIsDraw] = useState(false);

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
            } else if (getAvailableMoves(updatedBoard).length === 0) {
                setGameOver(true);
                setIsDraw(true);
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
        setIsDraw(false);
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
            <Header player={currentPlayer} winner={winner} isDraw={isDraw} />
            <div className="gameBoard">
                {initBoard()}
            </div>
            <Footer onNewGameClick={resetGame} />
        </>
    );
};

export default GameBoard;