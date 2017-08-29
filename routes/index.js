var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// sample request
// request("https://www.google.com", function(error, response, body){
//  if(error) {
//      console.log("some thing went wrong", error);
//  } else {
//      if(response.statusCode == 200) {
//          console.log("worked");
//          console.log(body);
//      } else {
//          console.log("failed");
//      }
//  }
// })

// Depricate
// app.get("/dog", function(req, res) {
//  res.send("Hello dog");
// })

router.get("/", function(req, res) {
    res.render("index");
});
//         Auth routes

//show signup form
router.get("/register", function(req, res) {
    res.render("users/register");
});

router.post ("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register"); 
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    });
    // res.send("register post route");
});

// login routes
router.get("/login", function(req, res) {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res) {
        console.log("In login route");
    }
);

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
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

router.get("/dynamic/:dynamic", function(req, res) {
    console.log(req.params);
    res.send("dynamic");
})

module.exports = router;
