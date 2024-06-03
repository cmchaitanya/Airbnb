const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js")
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");

//to parse file from form
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage})
//uploads is file where img is going to store

// router.route if we have diff request on same path
// like here we have get and post request on same path "/"
// combinig both we can write as
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,
          upload.single('listing[image]'),
          validateListing,
          wrapAsync(listingController.createListing)
        );

//index route
// router.get("/",wrapAsync(listingController.index));
 
//new route
 router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route
  router.get("/:id",wrapAsync(listingController.showListing));

//create route -- used in router.route
//  router.post("/",isLoggedIn,
        //  validateListing,
        //  wrapAsync(listingController.createListing))
 
//edit route
 router.get("/:id/edit",
            isLoggedIn,
            isOwner,
            wrapAsync(listingController.renderEditForm));
 
 //update route
 router.put("/:id",
        isLoggedIn,  // to check user is logged in or not;
        isOwner,       // middleware to check user has permission
        upload.single('listing[image]'),
        validateListing, // middleware to prevent server side error
        wrapAsync(listingController.updateListing));

 //delete route
 router.delete("/:id",
            isLoggedIn,
            isOwner,
            wrapAsync(listingController.destryListing));

 module.exports=router;