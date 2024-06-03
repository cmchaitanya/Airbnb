const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const { init } = require("../models/review.js");

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async()=>{
    await Listing.deleteMany({});
    //adding owner to listings
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"665c4e81964f691eb64ce80c",
    }))
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
}
initDB();