// script.js
/*const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert(`Player ${currentPlayer} Wins!`);
            gameActive = false;
            return;
        }
    }
    if (!board.includes("")) {
        alert("It's a Draw!");
        gameActive = false;
    }
}

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;

        if (board[index] === "" && gameActive) {
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWinner();
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    });
});

resetButton.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    cells.forEach(cell => cell.textContent = "");
});*/
/*const socket = io();*/
let turn = "X"

let cells  = document.getElementsByClassName("cell");
console.log(typeof cells);

function checkWinner(cells){

    let val0 = cells[0].innerText;
    console.log(typeof val0);
    let val1 = cells[1].innerText;
    let val2 = cells[2].innerText;
    let val3 = cells[3].innerText;
    let val4 = cells[4].innerText;
    let val5 = cells[5].innerText;
    let val6 = cells[6].innerText;
    let val7 = cells[7].innerText;
    let val8 = cells[8].innerText;
    let messageBox = document.getElementById("messageBox");

    if(val0==val1 && val1 == val2 && val2){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val0+" wins"+"🎉";
    }
    if(val3==val4 && val4 == val5 && val5){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val5+" wins"+"🎉";
    }
    if(val6==val7 && val7 == val8 && val8){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val8+" wins"+"🎉";
    }
    if(val0==val3 && val3 == val6 && val6){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val6+" wins"+"🎉";
    }
    if(val4==val1 && val1 == val7 && val7){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val4+" wins"+"🎉";
    }
    if(val2==val5 && val2 == val8 && val2){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val2+" wins"+"🎉";
    }
    if(val0==val4 && val4 == val8 && val0){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val4+" wins"+"🎉";
    }
    if(val2==val4 && val4 == val6 && val6){
        messageBox.classList.toggle("hide");
        messageBox.innerText=val4+" wins"+"🎉";
    }

}

for(let i=0;i<9;i++){
    let cell = cells[i];
    cell.addEventListener("click",(event)=>{
        console.log(event.target.getAttribute("data-index"));
        cell.innerText = turn;
        if(turn === "X") turn = "O"
        else turn = "X"
        checkWinner(cells);
        
    })

}
