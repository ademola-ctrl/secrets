//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost/usersDB", { useNewUrlParser: true, useUnifiedTopology: true });

const newUserSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET
newUserSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", newUserSchema);


app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){
    const newEmail = req.body.username;
    const newPassword = req.body.password;
    const newUser = new User({
        email: newEmail,
        password: newPassword
    })
    newUser.save(function(err){
        if (err){
            res.send(err)
        }else{
            res.render("secrets")
        }
    });
});

app.post("/login", function(req, res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email: userEmail}, function(err, foundUser){
        if (!err){
            if (foundUser.password === userPassword){
                res.render("secrets")
            }else{
                res.send("Incorrect password")
            }
        }else{
            console.log(err)
        }
    })  
})




app.listen(3000, function(){
    console.log("app is runningon port 3000")
})