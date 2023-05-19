//jshint esversion:14.17.0
//require('dotenv').config()
//console.log(process.env);
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const encrypt = require('mongoose-encryption');
// const _ = require('lodash');

const md5 = require('md5');
 
//console.log(md5('Iftikar Alam'));
const app = express();


app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});


//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);


app.route("/")

.get(function(req,res){
	res.render("home");
});

app.route("/login")

.get(function(req,res){
	res.render("login");
})

.post(async function(req, res) {

                const username = req.body.username;
                const password = md5(req.body.password);

                await User.findOne({ "email": username })
                    .then(foundUser => {
                        if (foundUser.password === password)
                            res.render("secrets");
                        else
                            res.send("Incorrect password");
                    })
                });

app.route("/register")

.get(function(req,res){
	res.render("register");
})
.post(function(req,res){
	const newUser = new User({
		email: req.body.username,
		password: md5(req.body.password)
	});
	newUser.save().then(function(){
		res.render("secrets");
	});
});

app.listen(3000, async function(res, req) {
    
    console.log('Server on');
});