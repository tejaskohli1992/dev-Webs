var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name:"Rishikesh Camping Spot",
		image: "https://farm3.staticflickr.com/2353/2069978635_2eb8b33cd4.jpg",
		description: "Proin aliquam fringilla elit, in ornare purus auctor eget. Aenean sed hendrerit tortor. Phasellus molestie justo est, ut pulvinar felis mollis sit amet. Suspendisse lacinia porttitor porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras malesuada quam eu sem hendrerit, in hendrerit lacus vestibulum. Morbi pulvinar dolor eu feugiat pulvinar."
	},
	{
		name:"Gulliver Camping Spot",
		image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
		description: "Proin aliquam fringilla elit, in ornare purus auctor eget. Aenean sed hendrerit tortor. Phasellus molestie justo est, ut pulvinar felis mollis sit amet. Suspendisse lacinia porttitor porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras malesuada quam eu sem hendrerit, in hendrerit lacus vestibulum. Morbi pulvinar dolor eu feugiat pulvinar."
	},
	{
		name:"KrishnaNanda Camping Resort",
		image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
		description: "Proin aliquam fringilla elit, in ornare purus auctor eget. Aenean sed hendrerit tortor. Phasellus molestie justo est, ut pulvinar felis mollis sit amet. Suspendisse lacinia porttitor porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras malesuada quam eu sem hendrerit, in hendrerit lacus vestibulum. Morbi pulvinar dolor eu feugiat pulvinar."
	}
];

function seedDB(){
		Campground.remove({},function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			console.log("removed campgrounds");
			data.forEach(function(seed){
				Campground.create(seed,function(err,campground){
					if (err) {
						console.log("There is an error");
					}
					else{
						console.log("Added a campground");
						Comment.create(
							{
								text: "This campground is seriously rocks",
								author: "Mr TSK(Sr)"
							},function(err,comment){
								if(err){
									console.log(err);
									console.log("There is an error in this line");
								}
								else{
									campground.comments.push(comment);
									campground.save();

									console.log("Created a new comment");
								}
							});
					}
				});
			});
			
		}
	});		

}
module.exports = seedDB;