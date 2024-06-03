const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 };

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
     res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
            populate:{
                path:"author"
            },
        })
    .populate("owner");
            // flash
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
    // const {title,description,image,price,location,country}=req.body;
    // let Listing1=new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // })
        // -------- alternative -----
   
        // wrapAsync is used instead of try and catch block
    // try{
        // customized error
        // if(!req.body.listing){
        //     throw new ExpressError(400,"send valid data for listing");
        // };
        let url=req.file.path;
        let filename=req.file.filename;
        const Listing1=new Listing(req.body.listing);
        Listing1.owner=req.user._id;
        Listing1.image={url,filename};
        await Listing1.save();
        req.flash("success","New Listing Is Created");
        res.redirect("/listings");
    // }catch(err){}
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for does not exist!")
       res.redirect("/listings");
   }
   let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    };

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Is Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destryListing=async(req,res)=>{
    let {id}=req.params;
   // await Listing.deleteMany({}); it will celar all data
   await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Is Deleted");
   res.redirect("/listings");
};