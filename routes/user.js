const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//using controller
const userController=require("../controllers/user.js");

router.get("/signup",userController.renderSignUpForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLogInForm);

//passport.authenticate() is middle ware to authenticate user
router.post("/login",
            saveRedirectUrl,
            passport.authenticate("local",{
                failureFlash:true,
                failureRedirect:'/login'}),
            wrapAsync(userController.login));

router.get("/logout",userController.logout)
module.exports=router;