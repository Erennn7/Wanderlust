const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);//req.body."review" is a object that we passed in form of objects in show.ejs 
    newReview.author=req.user._id;
    listing.reviews.push(newReview);//reviews = an array that stores listings //mentioned in schemaa(listing.js)
    
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
    }

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);

}