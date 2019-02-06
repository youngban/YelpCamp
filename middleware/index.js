var Stadium = require("../models/stadium");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkStadiumOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Stadium.findById(req.params.id, function(err, foundStadium){
         if(err){
            res.redirect("back");
        } else {
            if(foundStadium.author.id.equals(req.user._id)){
                next();
            }else {
                res.redirect("back");
            }
        }
      });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id, function(err, foundComment){
         if(err){
            res.redirect("back");
        } else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else {
                res.redirect("back");
            }
        }
      });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;