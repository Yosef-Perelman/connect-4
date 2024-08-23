import React from "react";
import GameCircle from "./GameCircle";
import '../Game.css';

const GameBoard = () => {
    return <div className="gameBoard">
        <GameCircle id={1}/>
    </div>
}

export default GameBoard;