const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

// passport local by default saves username and password so no ndeed to define in schema
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    }

});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);