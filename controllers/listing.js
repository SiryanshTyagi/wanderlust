const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.postListing = wrapAsync(async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // Removed 'next' since it's handled by wrapAsync/error handler
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  let url = req.file.secure_url;
  let filename = req.file.display_name;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  // console.log(newListing); // Retained original console log logic
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "Listing added successfully");
  res.redirect("/listings");
});

module.exports.editListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing); // Retained original console log logic

  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalUrl });
});

module.exports.showListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "this listing does not exist");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { listing });
  }
});

module.exports.updateListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.secure_url;
    let filename = req.file.display_name;
    listing.image = { url, filename };
    listing.save();
  }
  // let updatedListing = await Listing.findById(id); // Original commented logic
  // console.log(updatedListing);
  req.flash("success", "Listing updated successfully");

  res.redirect(`/listings/${id}`); // Redirecting to show page after update
});

module.exports.deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
});
