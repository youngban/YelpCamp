var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Stadium    = require("./models/stadium"),
    seedDB     = require("./seeds")


mongoose.connect("mongodb://localhost:27017/stadiums", {useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();
    
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all stadiums
app.get("/stadiums", function(req, res){
    // Db에서 얻어오기
    Stadium.find({}, function(err, allstadiums){
        if(err){
            console.log(err);
        } else {
            res.render("index", {stadiums:allstadiums});
        }
    })
});

//CREATE - add new stadiums
app.post("/stadiums", function(req, res){
    // 폼에서 데이터 얻어오기, 스타디움 array 추가
    var name = req.body.name;
    var img = req.body.img;
    var desc = req.body.description;
    var newStadiums = {name:name, img:img, description:desc}
    // 새로운 스타디움 Db에 저장
    Stadium.create(newStadiums, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            res.redirect("/stadiums");
        }
    });
});

//NEW - show form to create new stadiums
app.get("/stadiums/new", function(req, res) {
    res.render("new");
}); 

//SHOW - show info about one stadiums
app.get("/stadiums/:id", function(req, res) {
    Stadium.findById(req.params.id).populate("comments").exec(function(err, foundStadium){
        if(err){
            console.log(err);
        } else {
            res.render("show", {stadiums:foundStadium});
        }
    });
})
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});
