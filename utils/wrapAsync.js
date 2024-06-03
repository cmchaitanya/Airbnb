// wrapAsync is nothing but try and catch block

module.exports = (fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}