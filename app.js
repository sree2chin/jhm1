var express = require("express");
var app = express();
var request = require("request");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./models/seed.js");

mongoose.connect("mongodb://localhost/yelp_camp");

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

app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds",{campgrounds:allCampgrounds});
       }
    });
	// res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

app.post("/campgrounds", function(req, res){
	console.log("==============================");
	console.log(req.body);
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// Depricate
// app.get("/dog", function(req, res) {
// 	res.send("Hello dog");
// })

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

