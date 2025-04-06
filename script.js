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
    const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);
    if(!availableCells.length) return;
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


//this represents the board spaces, the are pushed into the gameboard array this way all the board spaces have the characteristics of this function I think.
function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;
        return {addToken, 
                getValue
            };
}

function GameController(playerOne = createPlayer("Bob", "X"), playerTwo = createPlayer("John", "O")){
    const players = [
        playerOne,
        playerTwo
    ];

    const board = gameboard;

    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
        // console.log(activePlayer)
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
        console.log(activePlayer)
    }

    const playRound = (row, column) => {
        console.log(
            `Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}`
        );
        console.log(activePlayer)
        board.dropToken(row, column, getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    }
    printNewRound();

    return {
        playRound
        // getActivePlayer,
        // getBoard: board.getBoard
    };
}


const game = GameController();

GameController().playRound(0, 0)
