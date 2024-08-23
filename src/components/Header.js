import React from "react";

const Header = ({ player, winner }) => {
    const getMessage = () => {
        if (winner === 0) {
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