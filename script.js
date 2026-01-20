//IIFE that creates the gameboard
const gameboard = (function() {
    
const rows = 3;
const columns = 3;
let board = [];

for(let i = 0; i < rows; i++){
    board[i] = [];
    for(let j = 0; j < columns; j++){
        board[i].push(Cell());
    }
}

const dropToken = (row, column, player) => {
    board[row][column].addToken(player);
}

const getBoard = () => board;

const printBoard = () =>{
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
}
return {getBoard, printBoard, dropToken};


})();

//factory that creats players
function createPlayer(name, token){
    return {name, token}
}


//this represents the board spaces, the are pushed into the gameboard array this way all the board spaces have the characteristics of this function.
function Cell() {
    let value = 0;
    // console.log(typeof(value))

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;
        return {addToken, 
                getValue
            };
            
}

function GameController(playerOne = createPlayer("P1", "X"), playerTwo = createPlayer("P2", "O")){
    const players = [
        playerOne,
        playerTwo
    ];

    const board = gameboard;

    let activePlayer = players[0];
    let isGameOver = false;
    let winner = null;

    const winPatterns = [
        [0, 1, 2], // Row 1
        [3, 4, 5], // Row 2
        [6, 7, 8], // Row 3
        [0, 3, 6], // Column 1
        [1, 4, 7], // Column 2
        [2, 5, 8], // Column 3
        [0, 4, 8], // Diagonal 1
        [2, 4, 6]  // Diagonal 2
    ];

    const flattenArray = () => {
        const boardArray = board.getBoard();
        return boardArray.flat().map(cell => cell.getValue());
    };

    const checkWin = () => {
        const tokens = flattenArray();

        for(const pattern of winPatterns){
            const [a, b, c] = pattern;
            if(tokens[a] !==0 && tokens[a] === tokens[b] && tokens[a] === tokens[c]){
                return true;
            }
        }
        return false;
    };

    const checkTie = () => {
        const tokens = flattenArray();

        return tokens.every(token => token !== 0);
    }



    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
        // console.log(activePlayer)
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }


    const playRound = (row, column) => {
        if (isGameOver){
            console.log("Game is over restart");
            return;
        }
        const currentCell = board.getBoard()[row][column];

        if(currentCell.getValue() !== 0 || isGameOver){
            console.log("invalid move");
            return;
        }


        const currentPlayer = getActivePlayer();
        console.log(`Dropping ${currentPlayer.name}'s token into row ${row} column ${column}`); 

        board.dropToken(row, column, getActivePlayer().token);
        if(checkWin()){
            isGameOver = true;
            board.printBoard();
            winner = getActivePlayer().name;
            console.log("winner =", winner) 
        }
        if(checkTie()){
            isGameOver = true;
            board.printBoard();
            console.log("It's a tie");
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getIsGameOver: () => isGameOver,
        getWinner: () => winner
    };
}



// const game = GameController();

// const board = game.getBoard
// game.playRound(0, 0)
// game.playRound(1, 2)
// game.playRound(0, 1)
// game.playRound(1, 0)
// game.playRound(0, 2)
function screenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');


    

    const updateScreen = () =>{
        boardDiv.textContent = "";
        // console.log(boardDiv)

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const isGameOver = game.getIsGameOver();
        const winner = game.getWinner();

        if(isGameOver){
            if(winner){
                playerTurnDiv.textContent = `${winner} Wins!`;
            }else{
                playerTurnDiv.textContent = "It is a tie";
            }
        }else{
            playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
        }

        // playerTurnDiv.textContent = `${activePlayer.name}'s turn`


        board.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // if(isGameOver) cellButton.classList.add("game over");
                cellButton.dataset.row = indexRow
                cellButton.dataset.column = indexColumn
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // if (!selectedColumn) return;

            game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    

    updateScreen();
}

screenController();