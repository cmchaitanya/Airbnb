const express=require("express");
const router=express.Router({mergeParams:true});

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js")
const wrapAsync=require("../utils/wrapAsync.js")

// middleware to check person is logged in to perform task 
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");

//client server error handling
const {listingSchema,reviewSchema}=require("../schema.js")

//requiring controller
const reviewController=require("../controllers/reviews.js")
// post route for review
router.post("/",
          isLoggedIn,
          validateReview,
          wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewId",
            isLoggedIn,
            isReviewAuthor,
            wrapAsync(reviewController.destroyReview));
module.exports=router;