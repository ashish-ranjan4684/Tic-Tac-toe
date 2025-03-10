const express = require("express");
const mongodb = require("mongodb");
const path = require("path");
const http = require("http");
require("dotenv").config();
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const db = require("./database/user.json");
const fs = require("fs");
const PORT = process.env.PORT;
console.log(PORT);

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.static(path.join(__dirname+"/favicon")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs")
app.set("views","./views");

let playingusers=[];
let standonusers=[]


io.on("connect",(socket)=>{
    console.log(`A new client connected with id = ${socket.id}`);
    console.log(standonusers);
    socket.on("findFreeUsers",(username)=>{
        standonusers.push({socketid:socket.id,username:username});
        if(standonusers){
            socket.emit("foundFreeUser",standonusers);
            standonusers.forEach(user=>{
                io.to(user.socketid).emit("foundFreeUser",[standonusers[standonusers.length-1]]);
            })
        }
        else{
            socket.emit("NoFreeUserFound");
        }
    });
    
    
    socket.on("selectedOpponent",(opponent,username)=>{
        if(standonusers.includes(opponent))
        {
            io.to(opponent.socketid).emit("requestedToConnect",socket.id,username);
            
        }
    });

    /*socket.on("acceptRequest",(opponentSocketId,opponentUsername,sendersUsername)=>{
        if(standonusers.includes({socketid:opponentSocketId,username:opponentUsername}))
        {
            io.to(opponentSocketId).emit("requestAccepted",socket.id,sendersUsername,opponentSocketId);
            socket.join(opponentSocketId);
            //aopponent.socket.join(opponent.username+username);
            for(let i=0;i<standonusers.length;i++)
            {
                if(standonusers[i] == {socketid:opponentSocketId,username:opponentUsername} || standonusers[i] == {socketid:socket.id,username:sendersUsername})
                {
                    standonusers.splice(i,1);
                    console.log(standonusers);
                }
            }
        }
    });

    socket.on("userPlayed",(cellNo,turn,roomName)=>{
        if(turn == "X")turn = "O";
        else  turn = "X";

        socket.to(roomName).emit("opponentPlayed",cellNo,turn,roomName);

    });

    socket.on("won",(roomName,username)=>{
        socket.to(roomName).emit("opponentWon",username);
    });*/

    socket.on("acceptRequest", (opponentSocketId, opponentUsername, sendersUsername) => {
        const room = `${opponentSocketId}-${socket.id}`;
        io.to(opponentSocketId).emit("requestAccepted", socket.id, sendersUsername, room);
        socket.emit("requestAccepted", opponentSocketId, opponentUsername, room);
        socket.join(room);
        io.sockets.sockets.get(opponentSocketId)?.join(room);
    });
    
    socket.on("userPlayed", (cellNo, turn, roomName) => {
        const newTurn = (turn === "X") ? "O" : "X";
        socket.to(roomName).emit("opponentPlayed", cellNo, newTurn);
    });
    
    socket.on("won", (roomName, username) => {
        io.to(roomName).emit("opponentWon", username);
    });
    

});

io.on("disconnect",(socket)=>{
    console.log(`${socket.id} got disconnected`);
    /*socket.rooms.forEach(room=>{
        socket.leave("room");
        //io.to(room).emit("")
    })*/

})




app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","signup.html"));
})

app.post("/signup",(req,res)=>{
    try{
        let {email,username,name,password} = req.body;
        console.log(`email = ${email}\npassword = ${password}`);
        for(let i=0;i<db.length;i++){
            if(db[i].email == email || db[i].username == username){
                res.redirect("/");
            }
        }
        db.push(req.body);
        fs.writeFileSync(path.join(__dirname,"/database","user.json"),JSON.stringify(db));
        return res.render("game1",{user:req.body});
    }catch(err){
        console.log("error");
        return res.statusCode("502").send("Internal Server Error");
    }
    
})

app.post("/login",(req,res)=>{
    let user = req.body;
    console.log(user);
    console.log(db);
    for(let i=0;i<db.length;i++)
    {
        if(db[i].email==user.email && db[i].password == user.password){
            console.log("found");
            return res.render("game1",{user:db[i]});
        }
    }
    
    return res.redirect("/");
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"/frontend","/login.html"));
})



server.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`)
})