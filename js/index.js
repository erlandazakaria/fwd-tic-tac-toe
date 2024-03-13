// JavaScript Document

let board_size = 3;
let diagonal_LR_win_condition = [];
let diagonal_RL_win_condition = [];

let score = {
    o: 0,
    x: 0
}

let total_move = 0;

let moves = {
    o: {
        horizontal: {},
        vertical: {},
        diagonalLR: 0,
        diagonalRL: 0
    },
    x: {
        horizontal: {},
        vertical: {},
        diagonalLR: 0,
        diagonalRL: 0
    }
}

let checkWin = (player) => {
    if (moves[player].diagonalLR === board_size || moves[player].diagonalRL === board_size) {
        return true;
    }

    if (Object.keys(moves[player].horizontal).find(key => moves[player].horizontal[key] === board_size)) {
        return true;
    }
    
    if (Object.keys(moves[player].vertical).find(key => moves[player].vertical[key] === board_size)) {
        return true;
    }

    return false;
}

let calculateWinningCondition = () => {
    for ( let i = 1; i <= board_size; i++ ) {
        diagonal_LR_win_condition.push(`${i}-${i}`);
        diagonal_RL_win_condition.push(`${i}-${board_size - (i - 1)}`);
    }
}

let resetBoard = (numberOfBoard) => {
    board_size = numberOfBoard;
    diagonal_LR_win_condition = [];
    diagonal_RL_win_condition = [];
    
    // Reset Board
    let cols = document.getElementsByClassName("board-col");
    while(cols.length > 0){
        cols[0].parentNode.removeChild(cols[0]);
    }
    let rows = document.getElementsByClassName("board-row");
    while(rows.length > 0){
        rows[0].parentNode.removeChild(rows[0]);
    }
}

let addBoard = () => {
    for(let i=1; i <= board_size; i++) {

        $("#board-container").append(
            $("<div></div>")
                .attr("id", `board-row-${i}`)
                .addClass("board-row")
        );

        for(let j=1; j <= board_size; j++) {

            $(`#board-row-${i}`).append(
                $("<div></div>")
                    .attr("id", `${i}-${j}`)
                    .addClass("board-col btn span1")
                    .text("+")
                    .click(() => addMove(i,j))
            );
        }
    }
}

let resetMove = () => {
    // Reset Turn
    total_move = 0;
    moves = {
        o: {
            horizontal: {},
            vertical: {},
            diagonalLR: 0,
            diagonalRL: 0
        },
        x: {
            horizontal: {},
            vertical: {},
            diagonalLR: 0,
            diagonalRL: 0
        }
    }
}

let saveMove = (player, row, col) => {
    if (Object.hasOwn(moves[player].horizontal, row)) {
        moves[player].horizontal[row] = moves[player].horizontal[row] + 1;
    } else {
        moves[player].horizontal[row] = 1;
    }

    if (Object.hasOwn(moves[player].vertical, col)) {
        moves[player].vertical[col] = moves[player].vertical[col] + 1;
    } else {
        moves[player].vertical[col] = 1;
    }

    if (diagonal_LR_win_condition.includes(`${row}-${col}`)) {
        moves[player].diagonalLR = moves[player].diagonalLR + 1;
    }
    
    if (diagonal_RL_win_condition.includes(`${row}-${col}`)) {
        moves[player].diagonalRL = moves[player].diagonalRL + 1;
    } 
}

let addMove = (row, col) => {
    let player = total_move % 2 === 0 ? "o" : "x";
    
    // Check Duplicate
    if ($(`#${row}-${col}`).hasClass('disable')) {
        alert('Already selected');
        return;
    }

    // AddMove
    $(`#${row}-${col}`)
        .addClass(`disable ${player} ${player === "o" ? "btn-primary" : "btn-info"}`)
        .text(player.toUpperCase());
    saveMove(player, row, col);

    total_move += 1;

    setTimeout( () => {
        // Check Winning Condition
        let isWin = checkWin( player );
        if (isWin) {
            startGame();
            score[player] = score[player] + 1;
            $(`#${player}_win`).text(score[player])
            alert(`${player.toUpperCase()} has won the game. Start a new game`);
        // Check Tie
        } else if ( total_move === ( board_size * board_size ) ) {
            alert('Its a tie. It will restart.');
            startGame();
        }
    }, 10)
}

let startGame = () => {
    let numberOfBoard = parseInt(document.getElementById("board-number-input").value, 10);
    if(numberOfBoard < 3) {
        alert("Number of Board minimum 3");
        return;
    } 
    resetMove();
    resetBoard(numberOfBoard);
    addBoard();
    calculateWinningCondition();
}

$(document).ready(function() {

    $("#start").click(() => startGame());
});
    