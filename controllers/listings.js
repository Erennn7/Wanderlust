const Listing =require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id) //            this here is called nested populate
    .populate({                                 //      what does this do?
        path:"reviews",                         //          for each review its populating its author
        populate:{                                  ///     i.e storing all the info related to its author 
            path:"author",                          //      which is present in reviews hence nested populate.
        },                                          //
    }

    )
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
         res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    let response =await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
        
    
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry= response.body.features[0].geometry;

    let savedListing= await newListing.save();

    console.log(savedListing);
    req.flash("success","New Listing created !");
    res.redirect("/listings");
    
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originaImagelUrl =listing.image.url;
    originaImagelUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originaImagelUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  
   if(typeof req.file != "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
     await listing.save();
   }

    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
}