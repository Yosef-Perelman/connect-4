import React from "react";

const Footer = ({ onNewGameClick }) => {
  return (
    <div>
        <button class="new-game-button" onClick={onNewGameClick}>New Game</button>
    </div>
  )
}

export default Footer;