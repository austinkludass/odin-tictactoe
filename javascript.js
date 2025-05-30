const createPlayer = (name, marker) => {
    return { name, marker };
}

const Gameboard = (() => {
    let gameArray = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => gameArray;

    const setCell = (index, marker) => {
        if (gameArray[index] === "") {
            gameArray[index] = marker;
            return true;
        }
        return false;
    }

    const resetBoard = () => {
        gameArray = ["", "", "", "", "", "", "", "", ""];
    }

    return { getBoard, setCell, resetBoard };
})();


const DisplayController = (() => {
    const boardEl = document.querySelector("#board");
    const messageEl = document.querySelector("#message");
    
    const renderBoard = () => {
        boardEl.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellEl = document.createElement("div");
            cellEl.classList.add("cell");
            cellEl.textContent = cell;
            cellEl.dataset.marker = cell;
            cellEl.addEventListener("click", () => Game.handleTurn(index));
            boardEl.appendChild(cellEl);
        });
    };

    const renderUsernames = () => {
        boardEl.innerHTML = "";
        boardEl.innerHTML = `
            <div class="usernames-container">
                <div>Player 1 (X)</div>
                <input id="player1In" placeholder="Player 1 name..." type="text" maxlength="14" />
                <div>Player 2 (O)</div>
                <input id="player2In" placeholder="Player 2 name..." type="text" maxlength="14" />
                <button id="start-game">START</button>
            </div>
        `;
    };
    
    const showMessage = (message) => {
        messageEl.textContent = message;
    };
    
    return {renderBoard, showMessage, renderUsernames};
})();

const Game = (() => {
    let player1Name = "Player 1";
    let player2Name = "Player 2";

    const player1 = createPlayer(player1Name, "X");
    const player2 = createPlayer(player2Name, "O");
    let currentPlayer = player1;
    let isGameOver = false;
    
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    const handleTurn = (index) => {
        if (isGameOver) return;
        
        const success = Gameboard.setCell(index, currentPlayer.marker);
        if (!success) return;
        
        DisplayController.renderBoard();
        
        if (checkWinner(currentPlayer.marker)) {
            DisplayController.showMessage(`${currentPlayer.name} wins!`);
            isGameOver = true;
        } else if (Gameboard.getBoard().every(cell => cell !== "")) {
            DisplayController.showMessage("It's a draw!");
            isGameOver = true;
        } else {
            switchPlayer();
            DisplayController.showMessage(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
        }
    }

    const changePlayerNames = (p1, p2) => {
        if (p1.trim() !== "") player1.name = p1;
        if (p2.trim() !== "") player2.name = p2;
    }
    
    const checkWinner = (marker) => {
        return winningCombos.some(combo => combo.every(index => Gameboard.getBoard()[index] === marker));
    }
    
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    
    const restartGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
        DisplayController.renderBoard();
        DisplayController.showMessage(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
    };

    const startGame = () => {
        const p1 = document.querySelector("#player1In").value;
        const p2 = document.querySelector("#player2In").value;
        changePlayerNames(p1, p2);
        DisplayController.renderBoard();
        DisplayController.showMessage(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
        document.querySelector(".btn-container").style.visibility = "visible";
    }
    
    DisplayController.renderUsernames();
    document.getElementById("restart").addEventListener("click", restartGame);
    document.getElementById("start-game").addEventListener("click", startGame);

    return { handleTurn };
})();