var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v3");

var campgrounds = [
		{name: "Salmon Creek", image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
		{name: "Granite Hill", image: "https://farm9.staticflickr.com/8161/7360193870_cc7945dfea.jpg"},
		{name: "Mountain Goat's Retreat", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"}
	]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
	secret: "Abba dabba jabba",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/novels/:id/comments",commentRoutes);
app.use("/novels",campgroundRoutes);

app.listen(3000,function(){
	console.log("server has started on port 3000");
});