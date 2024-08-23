import React, {useState} from "react";
import GameCircle from "./GameCircle";
import '../Game.css';

const NUMBER_OF_CIRCLES = 42;
const NO_PLAYER = 0;
const PLAYER_1 = 1;
const PLAYER_2 = 2;

const GameBoard = () => {

    const [gameBoard, setGameBoard] = useState(Array(NUMBER_OF_CIRCLES).fill(NO_PLAYER));
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);

    console.log(gameBoard);

    const initBoard = () => {
        const circles = [];
        for (let i = 0; i < NUMBER_OF_CIRCLES; i++) {
            circles.push(renderCircle(i));
        }
        return circles;
    }

    const circleClicked = (id) => {

        setGameBoard(prev => {
            return prev.map((circle, pos) => {
                if (pos === id) return currentPlayer;
                return circle;
            })
        })

        setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);
    }

    const renderCircle = id => {
        return <GameCircle key={id} id={id} className={`player_${gameBoard[id]}`} onCircleClicked={circleClicked}/>
    }

    return <div className="gameBoard">
       {initBoard()}
    </div>
}

export default GameBoard;