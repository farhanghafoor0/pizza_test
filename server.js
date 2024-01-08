const express = require('express');
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require('path');

const PORT = process.env.PORT || 3000;


// Assets
app.use(express.static('public'));


// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');



app.get("/", function(req, res, next) {
    res.render("home"); 
});

app.get("/cart", function(req, res, next) {
    res.render("customers/cart"); 
});

app.get("/register", function(req, res, next) {
    res.render("auth/register"); 
});

app.get("/login", function(req, res, next) {
    res.render("auth/login"); 
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
