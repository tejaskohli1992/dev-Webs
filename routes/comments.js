var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if (err) {
			console.log(err);
		}
		else
		{
			res.render("comments/new",{campground: campground});		
		}
	});
	
});
router.post("/",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
		if (err) {
			console.log(err);
			res.redirect("/novels");
		}
		else
		{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else
				{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log("calledpost");
					res.redirect("/novels/"+campground._id);
				}
			});	
		}
	});
	
});

router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if (err) {
			res.redirect("back");
		}
		else{
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
	
});

router.put("/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if (err) {
			res.redirect("back");
		}
		else{
			console.log("calledput");
			res.redirect("/novels/"+req.params.id);
		}
	});
});

router.delete("/:comment_id",checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if (err) {
			res.redirect("back");
		}
		else
		{
			req.flash("success","Comment successfully removed");
			res.redirect("/novels/"+req.params.id);
		}
	});
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

function checkCommentOwnership(req,res,next){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if (err) {
				res.redirect("back");
			}
			else{
					if(foundComment.author.id.equals(req.user._id)){
						next();
					}
					else{
						res.redirect("back");
						req.flash("error","You need to be logged in to view this page");
					}
			}
		});
	}
}


module.exports = router;