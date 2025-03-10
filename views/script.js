const socket = io();
let turn = "";

socket.emit("")

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