var express = require("express");
var app = express();
var request = require("request");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./models/seed.js");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost/yelp_camp");

// auth setup
app.use(require("express-session")({
    secret: "could be anything",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// auth setup end .. 

// Middleware IMP******
app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    next(); 
});
// Middleware IMP end XXXX

seedDB();

// Campground.create(
// 	{
// 		name: "tinky", 
// 		image: "http://www.photosforclass.com/download/5946330957",
// 		description: "beauty"
// 	},
// 	function(err, campground){
// 		if(err) {
// 			console.log("something went wrong:", err);
// 		} else {
// 			console.log("newly created campground:", campground);
// 		}
// 	}
// );
//schema end

app.set('port', (process.env.PORT || 2000));

app.use(express.static(__dirname + '/public')); 

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


// sample request
// request("https://www.google.com", function(error, response, body){
// 	if(error) {
// 		console.log("some thing went wrong", error);
// 	} else {
// 		if(response.statusCode == 200) {
// 			console.log("worked");
// 			console.log(body);
// 		} else {
// 			console.log("failed");
// 		}
// 	}
// })

app.get("/", function(req, res) {
	res.render("index");
});

app.use(campgroundRoutes);
app.use(commentRoutes);


// Depricate
// app.get("/dog", function(req, res) {
// 	res.send("Hello dog");
// })

//         Auth routes

//show signup form
app.get("/register", function(req, res) {
    res.render("users/register");
});

app.post ("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("register"); 
        } else {
            passport.authenticate("local")(req, res, function(){
                 res.redirect("/campgrounds");
            })
        }
    });
    // res.send("register post route");
});

// login routes
app.get("/login", function(req, res) {
    res.render("users/login");
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res) {
        console.log("In login route");
    }
);

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

//         Auth routes XXX  

app.get("/dynamic/:dynamic", function(req, res) {
	console.log(req.params);
	res.send("dynamic");
})

app.get("*", function(req, res) {
	res.send("404");
})

// tell express to listen for requests.
app.listen(app.get('port'), function(){
	console.log("server has started");
});

// console.log("our exress app");

