var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.render("landing");
});



// AUTHORIZATION ROUTES
router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if (err) {
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome: "+user.username);
			res.redirect("/novels");
		});
	});
});

router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",
	{
		successRedirect: "/novels",
		failureRedirect: "/login"
	}),function(req,res){
	console.log("Asdada");
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out");
	res.redirect("/novels");
});

function isLoggedIn(req,res,next){
	if (req.isAuthenticated()) {
		return next();
	}
	else{
		req.flash("error","You need to be logged in to view this page");
		res.redirect("/login");
	}
}

module.exports = router;