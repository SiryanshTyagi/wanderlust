const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  console.log(res.locals.redirectUrl);
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this list");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//function for validation scehma
module.exports.listingValidaton = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // Fix: Use error.details for Joi validation output
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // Fix: Call next() without an error argument if validation passes
    next();
  }
};

//function for reviews validation scehma
module.exports.reviewValidation = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    // Fix: Use error.details for Joi validation output
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // Fix: Call next() without an error argument if validation passes
    next();
  }
};
