const Listing=require("../models/listing");
const Review=require("../models/review");
const User=require("../models/user");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newuser=new User({email,username});
        const registeredUser=await User.register(newuser,password);
        // to direct ogin after signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to Wanderlust");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",`${err}`);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out successfully");
        res.redirect("/listings");
    })
};