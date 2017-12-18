var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
router.get("/",function(req,res){
	
	Campground.find({},function(err,allCampgrounds){
		if(err)
		{
			console.log("Error");
		}
		else
		{
			res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
	
});

router.post("/",isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground,function(err,newlyCreated){
			if(err){
				console.log("Error");
			}
			else
			{
				
				res.redirect("/novels");
			}
	});
	// campgrounds.push(newCampground);
	
});

router.get("/new",isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){

	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log("Throws an Error at line 84");
		}
		else
		{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
		
		Campground.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit",{campground: foundCampground});
		
		});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/novels");
		}
		else{
			
			res.redirect("/novels/"+req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if (err) {
			res.redirect("/novels");
		}
		else{
			res.redirect("/novels");
		}
	});
});

function isLoggedIn(req,res,next){
	if (req.isAuthenticated()) {
		return next();
	}
	else{
		req.flash("error","Please login first!!");
		res.redirect("/login");
	}
}

function checkCampgroundOwnership(req,res,next){
	if (req.isAuthenticated()) {
				Campground.findById(req.params.id,function(err,foundCampground){
			if (err) {
				res.redirect("back");
			}
			else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
				
			}
		});
	}
	else{
		console.log("YOU NEED TO BE LOGGED IN TO DO THAT")
		res.redirect("back");
	}

}

module.exports = router;