// GameLogic.js

export const NUM_ROWS = 6;
export const NUM_COLS = 7;
export const WINNING_LENGTH = 4;
export const NO_PLAYER = 0;
export const PLAYER_1 = 1;
export const PLAYER_2 = 2;

export const checkWin = (board) => {
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

export const getAvailableMoves = (board) => {
    const moves = [];
    for (let col = 0; col < NUM_COLS; col++) {
        if (board[col] === NO_PLAYER) {
            moves.push(col);
        }
    }
    return moves;
};

export const makeMove = (board, col, player) => {
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

export const evaluateBoard = (board, player) => {
    const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    let score = 0;

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

export const getBestMove = (board, player) => {
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