// /////////// PHASE - 1 ///////////////

// // STEP 1
// // first step is to setup our server and connect it to db
// //in cmd we first create package.json from "npm init -y" then install express, ejs, mongoose, methodOverride,etc.
// //from line 1-30 we have setted up our server and connected it to DB wanderlust

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema } = require("./Schema.js");

// app.engine("ejs", ejsMate);
// app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));

// //connecting to DB
// let DB_address = "mongodb://127.0.0.1:27017/wanderlust";
// async function main() {
//   await mongoose.connect(DB_address);
// }
// main()
//   .then((res) => {
//     console.log("connected to DB successfully");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// //setting the server
// app.listen("8080", () => {
//   console.log("listening to port 8080");
// });

// //root route
// app.get("/", (req, res) => {
//   res.send("root route...");
// });

// // STEP 2
// //now we will create our first model "listing" i.e. it will contain all the information about a place
// //we will ceate a folder named model where all the models will be in it and then we will export them
// const Listing = require("./models/listing.js");

// // app.get("/listing", (req, res) => {    this was just to test insertion of the data
// //     const list1 = new Listing({
// //         title: "abhi",
// //         description: "sansu",
// //         price: 400,
// //         location: "sironj",
// //         country: "india"
// //     });
// //     list1.save();
// //     res.send("saved");
// // });

// //STEP 3
// // now we will add sample data and then initialize it we will create an init folder inside it data.js which will
// // have all the data and export it and then will create index.js require mongoose and create connection with the db
// //then create an async function init then delete the before data and insert new data

// //STEP 4   setting main route which  will sow all listings
// //we have created views directory and to differntiate easily we have created listings where all ejs templates
// //for listing will be

// //You must define your more specific routes before your more general/dynamic routes.
// //Since /listings/new is a specific, fixed path, it must come before the dynamic /listings/:id route.

// //function for validation scehma
// const listingValidaton = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.detail.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next(err);
//   }
// };

// //DELETE LISTING
// app.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
//   })
// );

// //UPDATE LISTING ROUTE
// app.put(
//   "/listings/:id",
//   listingValidaton,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     // let updatedListing = await Listing.findById(id);
//     // console.log(updatedListing);
//     res.redirect("/listings");
//   })
// );

// //EDIT LISTING ROUTE
// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     console.log(listing);
//     res.render("listings/edit.ejs", { listing });
//   })
// );

// //POST LISTING ROUTE
// app.post(
//   "/listings",
//   listingValidaton,
//   wrapAsync(async (req, res, next) => {
//     let newListing = await new Listing(req.body.listing);
//     console.log(newListing);
//     await newListing.save();
//     res.redirect("/listings");
//   })
// );

// //NEW LISTING ROUTE
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// //SHOW ROUTE
// app.get(
//   "/listings/:id",

//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/show.ejs", { listing });
//   })
// );

// //INDEX ROUTE
// app.get("/listings", async (req, res) => {
//   let allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// });

// // CATCH-ALL ROUTE (MUST be defined before the final app.use error handler)
// app.use((req, res, next) => {
//   next(new ExpressError(400, "Page Not Found!")); // Changed status code to 400s
// });

// // GENERIC ERROR HANDLER (This catches the error passed by the 404 route)
// app.use((err, req, res, next) => {
//   let { status = 500, message = "Some Error occured" } = err;
//   res.status(status).render("error.ejs", { err });
// });

// //till now we have done our CRUD operation and created the all the routes and connected them with db
// // now our PHASE-2 starts

// //////////////  PHASE - 2 ///////////////

// //STEP 1
// //we have installed ejs-mate package which helps us to use layouts i.e. pre-written code
// // header, footer, in layout folder boilerPlate code we can write them once and use it everywhere
// //STEP 1.5
// //we have created public folder where we can save our static file like css, js

// //STEP 2
// // now we will style our page using css

// /////////// PHASE - 1 ///////////////

// STEP 1
// first step is to setup our server and connect it to db
//in cmd we first create package.json from "npm init -y" then install express, ejs, mongoose, methodOverride,etc.
//from line 1-30 we have setted up our server and connected it to DB wanderlust

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");

const listing = require("./routees/serve.js");
// --------------------
// 1. CONFIGURATION (ejs-mate for layouts, middleware, static files)
// --------------------

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
// STEP 1.5 - we have created public folder where we can save our static file like css, js
// STEP 2 - now we will style our page using css

// --------------------
// 2. DATABASE CONNECTION
// --------------------

//connecting to DB
let DB_address = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(DB_address);
}
main()
  .then(() => {
    // Updated syntax for then
    console.log("connected to DB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//setting the server
app.listen("8080", () => {
  console.log("listening to port 8080");
});

//root route
app.get("/", (req, res) => {
  res.send("root route...");
});

// STEP 2
//now we will create our first model "listing" i.e. it will contain all the information about a place
//we will ceate a folder named model where all the models will be in it and then we will export them

// app.get("/listing", (req, res) => {    this was just to test insertion of the data
//     const list1 = new Listing({
//         title: "abhi",
//         description: "sansu",
//         price: 400,
//         location: "sironj",
//         country: "india"
//     });
//     list1.save();
//     res.send("saved");
// });

//STEP 3
// now we will add sample data and then initialize it we will create an init folder inside it data.js which will
// have all the data and export it and then will create index.js require mongoose and create connection with the db
//then create an async function init then delete the before data and insert new data

// --------------------
// 3. Joi Validation Middleware
// --------------------

// =========================================================
// 🏠 STEP 4: LISTING ROUTES (CRUD Operations)
// =========================================================

app.use("/listings", listing);

// STEP 4 - setting main route which  will show all listings
// we have created views directory and to differntiate easily we have created listings where all ejs templates
// for listing will be

//till now we have done our CRUD operation and created the all the routes and connected them with db
// now our PHASE-2 starts

//////////////  PHASE - 2 ///////////////

//STEP 1
//we have installed ejs-mate package which helps us to use layouts i.e. pre-written code
// header, footer, in layout folder boilerPlate code we can write them once and use it everywhere

//STEP 1.5 - (Moved up to CONFIGURATION section for logical grouping)

//STEP 2 - (Moved up to CONFIGURATION section for logical grouping)

// --------------------
// 4. ERROR HANDLING
// --------------------

// CATCH-ALL ROUTE (MUST be defined before the final app.use error handler)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!")); // Changed status code to 404
});

// GENERIC ERROR HANDLER (This catches the error passed by the 404 route and any application errors)
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error occured" } = err;
  res.status(status).render("error.ejs", { err });
});
