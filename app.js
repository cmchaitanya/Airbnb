//env file will store credentials of cloudinary (storing images)

if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();

const mongoose=require("mongoose");
const path=require("path");

const ExpressError=require("./utils/ExpressError.js")
const wrapAsync=require("./utils/wrapAsync.js")

//client server error handling
const {listingSchema,reviewSchema}=require("./schema.js")

// to make layout eg. boilerplate
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);

// user authentication setup
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

// convert get,post -> put,delete
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

// requiring models
// const Listing=require("./models/listing.js");
// const Review=require("./models/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//to get and read cookies
const cookieParser=require("cookie-parser");
app.use(cookieParser("anystring")); //any string can be passed in cookieParser it act as sign or stamp

//middlewares
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}

const session=require("express-session");
const MongoStore = require('connect-mongo'); // to store session data
const flash=require("connect-flash");

// storing session info
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{    // to encrypt session code
        secret:process.env.SECRET,
    },
    touchAfter:24*3600 // interval in seconds between session update
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// to implement passport we need sessions, so use passport after middleware of session
app.use(passport.initialize()); // middleware that initiallize middleware
app.use(passport.session()); // ability to identify user as they browse from page to page.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // to store data of user
passport.deserializeUser(User.deserializeUser()); // to store data of user


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


// app.get("/",async(req,res)=>{
//     res.send("server is running");
// })

// app.get("/demouser",async (req,res)=>{
//    let fakeuser= new User({
//     email:"student",
//     username:"delta",
//    });
//    // register saves password and also check it is unique or not
//    let registeredUser=await User.register(fakeuser,"helloo");
//    res.send(registeredUser);
// });

app.use("/",userRouter);
app.use("/listings",listingRouter);

// this wil give error as id remains in file it does not passed to review.js
// app.use("/listings/:id/reviews",reviews);
// to solve this issue mergeParams is used in review.js while declaring router
// /listings/:id/reviews -->parent route
//  route in review.js "/" is child route
app.use("/listings/:id/reviews",reviewRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
   let {status=500,message="something went wrong!"}=err;  
   res.render("./listings/error.ejs",{err});
//    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})