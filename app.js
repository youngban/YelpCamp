var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var stadiums = [
        {name: "Wembly", image:"https://pixabay.com/get/e83db70821fd033ed1584d05fb1d4e97e07ee3d21cac104491f8c97daeedb3b8_340.jpg"},
        {name: "Camp nou", image:"https://pixabay.com/get/e83db7092ff7093ed1584d05fb1d4e97e07ee3d21cac104491f8c97daeedb3b8_340.jpg"},
        {name: "Friends Arena", image:"https://farm9.staticflickr.com/8293/7751330752_e3f2fa3fb8.jpg"}
    ] 
    
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/stadiums", function(req, res){
    res.render("stadiums", {stadiums:stadiums});
});

app.post("/stadiums", function(req, res){
    // 폼에서 데이터 얻어오기, 스타디움 array 추가
    var name = req.body.name;
    var img = req.body.image;
    var newStadiums = {name:name, img:img}
    stadiums.push(newStadiums);
    //stadiums 페이지로 redirect
    res.redirect("/stadiums");
});

app.get("/stadiums/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});
