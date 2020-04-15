//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10;


app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost/usersDB", { useNewUrlParser: true, useUnifiedTopology: true });

const newUserSchema = new mongoose.Schema({
    email: String,
    password: String
});



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
    const newPassword = req.body.password
    bcrypt.hash(newPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: newEmail,
            password: hash
        })
        newUser.save(function(err){
            if (err){
                res.send(err)
            }else{
                res.render("secrets")
            }
        });

    })
    
});

app.post("/login", function(req, res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email: userEmail}, function(err, foundUser){
        if (!err){
            // Load hash from your password DB.
            bcrypt.compare(userPassword, foundUser.password, function(err, result) {
                if (result == true){
                    res.render("secrets")
                }else{
                    res.send("Incorrect password")
                }
            });
        }


            
    })  
})




app.listen(3000, function(){
    console.log("app is runningon port 3000")
})