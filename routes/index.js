var express = require("express"),
    passport= require("passport");
var router  = express.Router();
var User    = require("../models/user");


//root routes
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser= new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } 
            passport.authenticate("local")(req, res, function(){
                res.redirect("/stadiums");
            });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//login, middleware, callback
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/stadiums",
        failureRedirect:"/login"
    }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/stadiums");
});

module.exports = router;