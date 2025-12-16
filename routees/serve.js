if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const { isLoggedIn, isOwner, listingValidaton } = require("../middleware.js");
const router = express.Router({ mergeParams: true });
const ListingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });
router
  .route("/")
  .get(ListingController.index) /// router.get
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    listingValidaton,
    ListingController.postListing
  ); /// router.post

// NEW LISTING ROUTE - Must be before /listings/:id
router.get("/new", isLoggedIn, ListingController.newListing);

// EDIT LISTING ROUTE - Must be before /listings/:id
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.editListing);

router
  .route("/:id")
  .get(ListingController.showListing)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    listingValidaton,
    ListingController.updateListing
  );

// DELETE LISTING
router.delete("/:id", isLoggedIn, isOwner, ListingController.deleteListing);

module.exports = router;
