const express=require("express");
const app=express();
const path=require('path');
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/market',(req,res)=>{
    res.render('market');
})

app.get('/ai',(req,res)=>{
    res.render('ai');
})

app.get('/bio',(req,res)=>{
    res.render('bio');
})

app.get('/news',(req,res)=>{
    res.render('news');
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})