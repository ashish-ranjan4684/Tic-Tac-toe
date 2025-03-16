const express = require("express");
const mongodb = require("mongodb");
const path = require("path");
const http = require("http");
require("dotenv").config();
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const db = require("./database/user.json");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const secret = process.env.SECRET;
console.log(PORT);

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.static(path.join(__dirname+"/favicon")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set("view engine","ejs");
app.set("views","./views");

let createdUnjoinedRooms = new Map();




io.on("connect",(socket)=>{

    socket.on("createRoom",(room,user)=>{
        socket.join(room);
        //createdUnjoinedRooms.set(room,[user]);
        console.log("A room got created: ",room);
        console.log(createdUnjoinedRooms);
    });
    
    
    socket.on("joinRoom",(room,userDetail)=>{
        try{
            console.log("joinRoom requested");
            let payload = jwt.verify(userDetail,secret);
            if(createdUnjoinedRooms.has(room)){
                socket.join(room);
                createdUnjoinedRooms.get(room).push(payload);
                console.log(`${createdUnjoinedRooms.toString()} after joining`)
                let paasaJoiner="";
                let paasaCreator="";
                let joinerTurn;
                let creatorTurn;
                let randomGoti = Math.random()*10;
                let randomTurn = Math.random()*10;
                if(randomGoti<=5)
                {    
                    paasaJoiner = "X";
                    paasaCreator = "O";
                }
                else{
                    paasaJoiner = "O";
                    paasaCreator = "X";
                }
                if(randomTurn>5){
                    joinerTurn = "true";
                    creatorTurn="false";
                }
                else{
                    joinerTurn="false";
                    creatorTurn="true";
                }

                socket.emit("start game",joinerTurn,paasaJoiner,paasaCreator,JSON.stringify(createdUnjoinedRooms.get(room)[1]),JSON.stringify(createdUnjoinedRooms.get(room)[0]),room);
                socket.to(room).emit("start game",creatorTurn,paasaCreator,paasaJoiner,JSON.stringify(createdUnjoinedRooms.get(room)[0]),JSON.stringify(createdUnjoinedRooms.get(room)[1]),room);
            }
        }catch(err){
            socket.emit("not authorized");
        }

    });

    socket.on("continueMatch",(index,room)=>{
        socket.to(room).emit("continueMatch",index,room);
    })

    socket.on("youLoose",(room)=>{
        socket.to(room).emit("youLoose",room);
    })

    socket.on("Match Drawn",(room)=>{
        socket.to(room).emit("Match Drawn",room);
    })
    
});




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
        let payload = {user:req.body};
        let token = jwt.sign(payload,secret);
        res.cookie("uid",token);
        return res.render("homepage",{user:req.body});
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
            let payload = {user:db[i]};
            console.log(payload);
            let token = jwt.sign(payload,secret);
            console.log(token);
            res.cookie("uid",token);
            return res.render("homepage",{user:db[i]});
        }
    }
    
    return res.redirect("/");
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"/frontend","/login.html"));
})

app.post("/join",(req,res)=>{

    try{
        let room = req.body.room;
        console.log(room);
        let token = req.cookies.uid;
        let payload = jwt.verify(token,secret);
        res.cookie("iRequsetedRoom","true");
        res.cookie("iCreatedRoom","false")
        res.cookie("room",room);
        res.cookie("uid",token);
        res.render("multiplayerGame",{payload});
    }catch(err)
    {
        console.log("error: ",err);
    }
})

app.post("/game",(req,res)=>{
    try{
        let room =req.query.room;
        console.log(req);
        console.log(req.cookies.room);
        let token = req.cookies.uid;
        let payload = jwt.verify(token,secret);
        console.log(payload);
        createdUnjoinedRooms.set(room,[payload]);
        res.cookie("room",room);
        res.cookie("iCreatedRoom","true");
        res.cookie("iRequsetedRoom","false");
        res.cookie("uid",JSON.stringify(payload));
        res.render("multiplayerGame",{payload})
    }catch(error){
        console.log("error: ",error);
    }

        
})


server.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`)
})