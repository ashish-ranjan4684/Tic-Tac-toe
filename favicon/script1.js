const socket = io();

let didICreateRoom;
let didIRequest;
let myself;
//console.log(myself);
let inroom;
let messBox= document.getElementById("messageBox");

let cookies = document.cookie.split("; ");
console.log(cookies);
console.log(cookies.includes("iRequsetedRoom=true"));
if(cookies.includes("iRequsetedRoom=true"))didIRequest=true;
if(cookies.includes("iCreatedRoom=true"))didICreateRoom=true;
for(let i=0;i<cookies.length;i++){
    
    let [key,value]=cookies[i].split("=");
    if(key==="room")inroom=value;
    if(key==="uid")myself=value;
}

if(didICreateRoom){
    console.log("didIREQUES",didIRequest);
    console.log("DIDiCreate",didICreateRoom);
    socket.emit("createRoom",inroom);
}

if(didIRequest)
{
    console.log("didIREQUES",didIRequest);
    console.log("DIDiCreate",didICreateRoom);
    socket.emit("joinRoom",inroom,myself);
}

console.log(inroom);

let users_pick = "";
let otherUsersPick = "";

let divNodeList = document.getElementsByClassName("cell");

let customEvent = new CustomEvent("i played");
//let waitEndEvent = new CustomEvent("opponent joined");

const customEventTarget = new EventTarget();

function handleClick(event){
        event.target.innerText = users_pick;
        let index = event.target.getAttribute("data-index");
        let winner = whoWon();
        if(winner === users_pick){
            //play animation that user won and play cheerful song
            messBox.innerText="you Won ";
            messBox.classList.remove("hide");
            document.getElementById("congrats").classList.add("animate");
            socket.emit("youLoose",inroom);
            setTimeout(()=>{
                document.getElementById("congrats").classList.remove("animate");
            },5000);

        }
        else if(winner === otherUsersPick){
            //play animation of user loosing and play sad song. Jiske aane se mukammal ho gayi yhi zindagi, dastakein khushiyon ne di thi mit gayi thee wo kamee, wo aaye na le jaaye na, haan uski yaadein jo hai yahan, na raasta na kuchh pata main usko dhoondhoonga ab kahan
            //socket.emit("youWon")
        }
        else{
            //match continue karo;
            if(isDraw())
            {
                socket.emit("Match Drawn",inroom);
                //show animation that match is drawn.
                //Ask if they would like to play more ie., continue
            }
            else{
                socket.emit("continueMatch",index,inroom);

            }
            
        }
        customEventTarget.dispatchEvent(customEvent);
}

customEventTarget.addEventListener("i played",(event)=>{
    console.log("in remove EventListeer");
    let list = document.getElementsByClassName("cell");
    for(let i=0;i<list.length;i++){
        console.log("loop executing");
        list[i].removeEventListener("click",handleClick);
    }
});

/*customEventTarget.addEventListener("opponent joined",(event)=>{
    document.getElementById("waitAnimation").style.display="none";
    console.log(event.detail);
    document.getElementById("opponent").innerText=`Playing Against ${event.detail.name}`;
    document.getElementById("opponent").style.display="block";
})*/



socket.on("start game",(turn,userpaasa,opponentpaasa,myself,opponent,room)=>{
    
    let opponent1 = JSON.parse(opponent);
    let waitEndEvent = new CustomEvent("opponent joined",{detail:{name:opponent1.user.name}});
    customEventTarget.addEventListener("opponent joined",(event)=>{
        document.getElementById("waitAnimation").style.display="none";
        console.log(event.detail);
        document.getElementById("opponent").innerText=`Playing Against ${event.detail.name}`;
        document.getElementById("opponent").style.display="block";
    })
    console.log(opponent1.user.name);
    customEventTarget.dispatchEvent(waitEndEvent);
    users_pick=userpaasa;   
    let pick = document.getElementById("pick");
    pick.innerText=users_pick;
    pick.style.display="block";
    otherUsersPick=opponentpaasa;
    console.log()
    if(turn==="true")
    {
        for(let i=0;i<divNodeList.length;i++)
        {
            let cell = divNodeList[i];
            cell.addEventListener("click",handleClick)
        }
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

        for(let i=0;i<divNodeList.length;i++){
            divNodeList[i].addEventListener("click",handleClick);
    }


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

function isDraw(){
    let htmlCollOfCells = document.getElementsByClassName("cell");

    for(let i=0;i<htmlCollOfCells.length;i++)
    {
        if(htmlCollOfCells[i].innerText==="")return false;
    }
    return true;
}


function whoWon(){

    let winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,5,9],[3,5,7],[1,4,7],[2,5,8],[3,6,9]];
    let htmlCollOfCells = document.getElementsByClassName("cell");
    let combo = [];
    let arrOfIndices=[];

    for(let i=0;i<htmlCollOfCells.length;i++){
        if(htmlCollOfCells[i].innerText===users_pick)combo.push(htmlCollOfCells[i]);
    }

    for(let i=0;i<combo.length;i++)
    {
        arrOfIndices.push(combo[i].getAttribute("data-index"));
    }

    /*let arrOfCells = Array.from(htmlCollOfCells).filter(el=>{
        el.innerText===users_pick;
    });
    console.log(arrOfCells);

    let arrOfIndices = Array.from(htmlCollOfCells).map(cells=>{
        cells.getAttribute("data-index");
    });*/
    console.log(arrOfIndices);
;
    for(let i=0;i<winningCombinations.length;i++){

        let k=3;
        for(let j=0;j<arrOfIndices.length;j++)
        {
            if(winningCombinations[i].includes(Number(arrOfIndices[j])))k--;
        }
        if(k===0)return users_pick

    
    }
    return null;
}


