const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){

        // redirect url
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","Login to create Lisitings");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>  {
 if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
 }
 next();
}

module.exports.isOwner = async (req,res,next)=>{
   let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
   if (!req.file) {
    throw new ExpressError("Image is required", 400);
  }
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req,res,next)=>{
   let { reviewId ,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the author of this Review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}