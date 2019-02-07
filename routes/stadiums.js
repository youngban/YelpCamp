var express = require("express");
var router  = express.Router();
var Stadium = require("../models/stadium");
var middleware = require("../middleware");

//INDEX - show all stadiums
router.get("/", function(req, res){
    // Db에서 얻어오기
    Stadium.find({}, function(err, allStadiums){
        if(err){
            console.log(err);
        } else {
            res.render("stadiums/index", {stadiums:allStadiums});
        }
    });
});

//CREATE - add new stadiums
router.post("/", middleware.isLoggedIn, function(req, res){
    // 폼에서 데이터 얻어오기, 스타디움 array 추가
    var name = req.body.name;
    var img = req.body.img;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newStadiums = {name:name, img:img, description:desc, author:author}
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("stadiums/new");
}); 

//SHOW - show info about one stadiums
router.get("/:id", function(req, res) {
    Stadium.findById(req.params.id).populate("comments").exec(function(err, foundStadium){
        if(err){
            console.log(err);
        } else {
            res.render("stadiums/show", {stadium:foundStadium});
        }
    });
});

//EDIT 
router.get("/:id/edit", middleware.checkStadiumOwnership, function(req, res) {
        Stadium.findById(req.params.id, function(err, foundStadium){
            res.render("stadiums/edit", {stadium:foundStadium});
        });
});

//UPDATE
router.put("/:id", middleware.checkStadiumOwnership, function(req, res){
   Stadium.findByIdAndUpdate(req.params.id, req.body.stadium, function(err, updatedStadium){
       if(err){
           res.redirect("/stadiums");
       } else {
           res.redirect("/stadiums/" + req.params.id);    
       }
   });
});

//DESTROY 
router.delete("/:id", middleware.checkStadiumOwnership, function(req, res){
    Stadium.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/stadiums");
        } else {
            res.redirect("/stadiums");
        }
    });
});

module.exports = router;