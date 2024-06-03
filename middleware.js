const Listing=require("./models/listing");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // get path where client is trying to reach
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

//to store the path where user want to go before login
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// to check whether is owner
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
     }
     next();
};

// to prevent server side error
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

// to prevent server side error
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

// to check whether is same author is accessing
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the auhtor of the review");
        return res.redirect(`/listings/${id}`);
     }
     next();
};