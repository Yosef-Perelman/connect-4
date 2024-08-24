import React from "react";

const Header = ({ player, winner, isDraw }) => {
    const getMessage = () => {
        if (isDraw) {
            return "It's a draw!";
        } else if (winner === 0) {
            return `Player ${player}'s turn`;
        } else {
            return `Player ${winner} wins!`;
        }
    };

  return (
    <div className="panel header">
        <div className="header-text">
            {getMessage()}
        </div>
    </div>
  )
}

export default Header;