var express = require("express");
var router  = express.Router({mergeParams:true});
var Comment = require("../models/comment");
var Stadium = require("../models/stadium");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup stadiums using Id
    Stadium.findById(req.params.id, function(err, stadium) {
        if(err){
            console.log(err);
            res.redirect("/stadiums");
        } else {
            //create new comment - comment[text], [author]
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username= req.user.username;
                    //save comment
                    comment.save();
                    stadium.comments.push(comment);
                    stadium.save();
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/stadiums/" + stadium._id);
                }
            }); 
        }
    });
});

//COMMENT EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {stadium_id:req.params.id, comment:foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/stadiums/" + req.params.id); 
       }
    });
});

//COMMENT REMOVE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/stadiums/" + req.params.id);
        }
    });
});

module.exports = router;