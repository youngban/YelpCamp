var Stadium = require("../models/stadium");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkStadiumOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Stadium.findById(req.params.id, function(err, foundStadium){
         if(err || !foundStadium){
            req.flash("error", "Stadium not found");
            res.redirect("back");
        } else {
            if(foundStadium.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }
      });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id, function(err, foundComment){
         if(err || !foundComment){
            req.flash("error", "Stadium not found");
            res.redirect("back");
        } else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }
      });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;