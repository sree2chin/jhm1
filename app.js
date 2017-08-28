var express = require("express");
var app = express();
var request = require("request");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./models/seed.js");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

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

// seedDB(); // seed the database

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
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.get("*", function(req, res) {
	res.send("404");
})

// tell express to listen for requests.
app.listen(app.get('port'), function(){
	console.log("server has started");
});

