const socket = io();

let didICreateRoom;
let didIRequest;
let myself;
let inroom;
let messBox= document.getElementById("messageBox");

let cookies = document.cookie.split("; ");
if(cookies.includes("iRequestedRoom=true"))didIRequest=true;
if(cookies.includes("iCreatedRoom=true"))didICreateRoom=true;
console.log(cookies);
for(let i=0;i<cookies.length;i++){
    
    let [key,value]=cookies[i].split("=");
    if(key==="room")inroom=value;
    if(key==="");
}

let users_pick = "";
let otherUsersPick = "";

let divNodeList = document.getElementsByClassName("cell");

let customEvent = new CustomEvent("i played");
let waitEndEvent = new CustomEvent("opponent joined");

const customEventTarget = new EventTarget();

customEventTarget.addEventListener("i played",(event)=>{
    for(let i=0;i<divNodeList.length;i++){
        divNodeList[i].removeEventListener("click");
    }
});

customEventTarget.addEventListener("opponent joined",(event)=>{
    document.getElementById("waitAnimation").style.display="none";
    document.getElementById("opponent").innerText=`Playing Against ${event.detail.name}`;
    document.getElementById("opponent").style.display="block";
})

if(didIRequest==="true")socket.emit("joinRoom",inroom,)

socket.on("start game",(turn,userpaasa,opponentpaasa,myself,opponent,room)=>{
    customEventTarget.dispatchEvent(waitEndEvent,{detail:{name:opponent.user.name}});
    users_pick=userpaasa;   
    otherUsersPick=opponentpaasa;
    if(turn==="true")
    {
        divNodeList.forEach(cell => {
            cell.addEventListener("click",(event)=>{
                event.target.innerText = users_pick;
                let index = event.target.getAttribute("data-index");
                let winner = whoWon(index);
                if(winner === users_pick){
                    //play animation that user won and play cheerful song
                    socket.emit("youLoose",inroom);
                }
                else if(winner === otherUsersPick){
                    //play animation of user loosing and play sad song. Jiske aane se mukammal ho gayi yhi zindagi, dastakein khushiyon ne di thi mit gayi thee wo kamee, wo aaye na le jaaye na, haan uski yaadein jo hai yahan, na raasta na kuchh pata main usko dhoondhoonga ab kahan
                    //socket.emit("youWon")
                }
                else{
                    //match continue karo;
                    if(isDraw(htmlCollOfCells))
                    {
                        socket.emit("Match Drawn",inroom);
                        //show animation that match is drawn.
                        //Ask if they would like to play more ie., continue
                    }
                    else{
                        socket.emit("continueMatch",index,inroom);
        
                    }
                    
                }
                customEventTarget.dispatchEvent(customEvent)
            })
        });
    }

})

socket.on("continueMatch",(index,room)=>{
    for(let i=0;i<divNodeList.length;i++)
    {
        if(divNodeList[i].getAttribute("data-index") === index)
        {
            divNodeList[i].innerText = otherUsersPick; 
            break;
        }
    }

    divNodeList.forEach(cell => {
        cell.addEventListener("click",(event)=>{
            event.target.innerText = users_pick;
            let index = event.target.getAttribute("data-index");
            let winner = whoWon(index);
            if(winner === users_pick){
                //play animation that user won and play cheerful song
                socket.emit("youLoose",room);
                messBox.innerText="you won";
                messBox.classList.remove("hide");
            }
            else if(winner === otherUsersPick){
                //play animation of user loosing and play sad song. Jiske aane se mukammal ho gayi yhi zindagi, dastakein khushiyon ne di thi mit gayi thee wo kamee, wo aaye na le jaaye na, haan uski yaadein jo hai yahan, na raasta na kuchh pata main usko dhoondhoonga ab kahan
                //socket.emit("youWon")
            }
            else{
                //match continue karo;
                if(isDraw(htmlCollOfCells))
                {
                    socket.emit("Match Drawn",room);
                    document.getElementById("messageBox").innerText("Match Drawn");
                    messBox.classList.remove("hide");
                    //show animation that match is drawn.
                    //Ask if they would like to play more ie., continue
                }
                else{
                    socket.emit("continueMatch",index,room);
    
                }
                
            }
            customEventTarget.dispatchEvent(customEvent)
        })
    });


});

socket.on("Match Drawn",room=>{
    messBox.innerText("Match Drawn");
    messBox.classList.remove("hide");
});

socket.on("youLoose",room=>{
    messBox.innerText="you Lost"
    messBox.classList.remove("hide");
})

/*divNodeList.forEach(cell => {
    cell.addEventListener("click",(event)=>{
        event.target.innerText = users_pick;
        let index = event.target.getAttribute("data-index");
        let winner = whoWon(index);
        if(winner === users_pick){
            //play animation that user won and play cheerful song
            socket.emit("youLoose");
        }
        else if(winner === otherUsersPick){
            //play animation of user loosing and play sad song. Jiske aane se mukammal ho gayi yhi zindagi, dastakein khushiyon ne di thi mit gayi thee wo kamee, wo aaye na le jaaye na, haan uski yaadein jo hai yahan, na raasta na kuchh pata main usko dhoondhoonga ab kahan
            //socket.emit("youWon")
        }
        else{
            //match continue karo;
            if(isDraw(htmlCollOfCells))
            {
                socket.emit("Match Drawn");
            }
            else{
                socket.emit("continueMatch",index);

            }
            
        }
    })
});

function isDraw(htmlCollOfCells){
    let arrOfCells = Arrays.from(htmlCollOfCells).filter(el=>{
        el.innerText===users_pick;
    });
    for(let i=0;i<arrOfCells.length;i++)
    {
        if(!arrOfCells[i].innerText)return false;
    }
    return true;
}
*/

socket.on("youLoose",()=>{
    //play sad animation
});

socket.on("match drawn",()=>{

});





function whoWon(htmlCollOfCells){

    let winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,5,9],[3,5,7],[1,4,7],[2,5,8],[3,6,9]];
    let arrOfCells = Arrays.from(htmlCollOfCells).filter(el=>{
        el.innerText===users_pick;
    });

    let arrOfIndices = Arrays.from(htmlCollOfCells).map(cells=>{
        cells.getAttribute("data-index");
    })
;
    for(let i=0;i<winningCombinations.length;i++){

        let k = 0;
        let found = true;

        for(let j=0;j<3;j++){
            if(winningCombinations[i][j]!=arrOfIndices[k])found=false;
            k++;
        }
        if(found === true)return arrOfCells[0].innerText;
    }
    return null;

    
}


