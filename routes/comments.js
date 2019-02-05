var express = require("express");
var router  = express.Router({mergeParams:true});
var Comment = require("../models/comment");
var Stadium = require("../models/stadium");

//Comments New
router.get("/new",isLoggedIn, function(req, res) {
    //find stadium by id
    Stadium.findById(req.params.id, function(err, stadium){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {stadium:stadium});
        }
    })
});

//Comments Create
router.post("/", isLoggedIn, function(req, res){
    //lookup stadiums using Id
    Stadium.findById(req.params.id, function(err, stadium) {
        if(err){
            console.log(err);
            res.redirect("/stadiums");
        } else {
            //create new comment - comment[text], [author]
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username= req.user.username;
                    //save comment
                    comment.save();
                    stadium.comments.push(comment);
                    stadium.save();
                    res.redirect("/stadiums/" + stadium._id);
                }
            }); 
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;