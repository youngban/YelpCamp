var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    Stadium    = require("./models/stadium"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds")


mongoose.connect("mongodb://localhost:27017/stadiums", {useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();
    
    
//PASSPORT CONFIGURTION
app.use(require("express-session")({
    secret:"OldTrafford is Field of Dream",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all stadiums
app.get("/stadiums", function(req, res){
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
    res.render("stadiums/new");
}); 

//SHOW - show info about one stadiums
app.get("/stadiums/:id", function(req, res) {
    Stadium.findById(req.params.id).populate("comments").exec(function(err, foundStadium){
        if(err){
            console.log(err);
        } else {
            res.render("stadiums/show", {stadium:foundStadium});
        }
    });
})

// COMMENTS ROUTES
// COMMENTS ROUTES
// COMMENTS ROUTES

app.get("/stadiums/:id/comments/new", isLoggedIn, function(req, res) {
    //find stadium by id
    Stadium.findById(req.params.id, function(err, stadium){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {stadium:stadium});
        }
    })
});

app.post("/stadiums/:id/comments", isLoggedIn, function(req, res){
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
                    //connect new comment to stadium
                    stadium.comments.push(comment);
                    stadium.save();
                    res.redirect("/stadiums/" + stadium._id);
                }
            }); 
        }
    });
});

// AUTH ROUTES
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login");
});

//login, middleware, callback
app.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/stadiums",
        failureRedirect:"/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/stadiums")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});