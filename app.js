// // app.js

// // /////////// PHASE - 1 ///////////////

// // STEP 1: Server aur DB setup karna
// // zaruri modules ko require kar rahe hain
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js"); // Custom error class
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const localStrategy = require("passport-local");
// const User = require("./models/user.js");

// // Router file import kiya
// const listingRouter = require("./routees/serve.js");
// const reviewRouter = require("./routees/review.js");
// const userRouter = require("./routees/users.js");

// // --------------------
// // 1. CONFIGURATION (Middleware aur Settings)
// // --------------------

// // ejs-mate ko EJS engine ke taur par set kiya
// app.engine("ejs", ejsMate);
// app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "ejs");
// // POST request data ko parse karne ke liye middleware
// app.use(express.urlencoded({ extended: true }));
// // DELETE aur PUT requests ke liye method-override use kiya
// app.use(methodOverride("_method"));
// // STEP 1.5 - Public folder se static files (CSS, JS) serve karna
// app.use(express.static(path.join(__dirname, "/public")));
// // STEP 2 - Ab page ko CSS se style karenge

// // --------------------
// // 2. DATABASE CONNECTION
// // --------------------

// // connecting to DB wanderlust
// let DB_address = "mongodb://127.0.0.1:27017/wanderlust";
// async function main() {
//   await mongoose.connect(DB_address);
// }
// main()
//   .then(() => {
//     console.log("connected to DB successfully");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // setting the server
// app.listen(8080, () => {
//   console.log("listening to port 8080");
// });

// // root route
// app.get("/", (req, res) => {
//   res.send("root route...");
// });

// //SESSION CONNECTION - COOKIE  AND FLASH
// const sessionOption = {
//   secret: "mycode",
//   resave: false,
//   saveUninitialized: true,
// };

// app.use(session(sessionOption));
// app.use((req, res, next) => {
//   // 1. Set res.locals.msg for access in EJS templates
//   res.locals.success = req.session.success;
//   res.locals.error = req.session.error;

//   // 2. CLEAR the messages after they have been accessed
//   // This makes sure the message only appears once
//   delete req.session.success;
//   delete req.session.error;
//   next();
// });

// //PASSPORT AUTHENTICATION
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new localStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "siryanshtyagi@gmail.com",
//     username: "SiryanshTyagi",
//   });

//   let registeredUser = await User.register(fakeUser, "Tyagi9926");
//   res.send(registeredUser);
// });

// // STEP 2: Listing aur Review Models imports (Models are used by the router)
// // (Original logic moved to serve.js or is implied by imports)

// // STEP 3: Sample data dalne ki process (init folder se)

// // --------------------
// // 3. Joi Validation Middleware (Moved to serve.js)
// // --------------------

// // =========================================================
// // 🏠 STEP 4: ROUTER INTEGRATION
// // =========================================================

// // Listing router ko /listings path par mount kiya
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// // STEP 4 - setting main route which will show all listings
// // Saare Listing routes ab listingRouter handle karega.

// //till now we have done our CRUD operation and created the all the routes and connected them with db
// // now our PHASE-2 starts

// //////////////  PHASE - 2 ///////////////

// //STEP 1: ejs-mate use karke layouts (boilerPlate) set kiya.

// //STEP 1.5: Public folder created.

// //STEP 2: Styling is done.

// // --------------------
// // 4. ERROR HANDLING
// // --------------------

// // CATCH-ALL ROUTE (404 Not Found) - jo bhi route match nahi hua, uske liye
// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// // GENERIC ERROR HANDLER - Saare application errors aur 404 ko handle karega
// app.use((err, req, res, next) => {
//   let { status = 500, message = "Some Error occured" } = err;
//   res.status(status).render("error.ejs", { err });
// });

// app.js

// /////////// PHASE - 1 ///////////////

// STEP 1: Server aur DB setup karna
// zaruri modules ko require kar rahe hain
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // Custom error class
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Router file import kiya
const listingRouter = require("./routees/serve.js");
const reviewRouter = require("./routees/review.js");
const userRouter = require("./routees/users.js");

// --------------------
// 1. CONFIGURATION (Middleware aur Settings)
// --------------------

// ejs-mate ko EJS engine ke taur par set kiya
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
// POST request data ko parse karne ke liye middleware
app.use(express.urlencoded({ extended: true }));
// DELETE aur PUT requests ke liye method-override use kiya
app.use(methodOverride("_method"));
// STEP 1.5 - Public folder se static files (CSS, JS) serve karna
app.use(express.static(path.join(__dirname, "/public")));

// --------------------
// 2. DATABASE CONNECTION
// --------------------

// connecting to DB wanderlust
// let DB_address = "mongodb://127.0.0.1:27017/wanderlust";

const DB_URL = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(DB_URL);
}
main()
  .then(() => {
    console.log("connected to DB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// --------------------
// 3. SESSION, FLASH & PASSPORT CONFIGURATION
// --------------------
// ⚠️ IMPORTANT: Order matters! Session → Flash → Passport

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});
// STEP 1: Session setup (must come FIRST)
const sessionOption = {
  store,
  secret: process.env.SECRET, // Change this to a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevents XSS attacks
  },
};

app.use(session(sessionOption));

// STEP 2: Flash middleware (must come AFTER session)
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// STEP 5: Local variables middleware (makes flash messages and user available in all EJS templates)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Currently logged-in user
  next();
});

// --------------------
// 4. ROUTES
// --------------------

// root route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Demo user route (optional - for testing)
app.get("/demoUser", async (req, res) => {
  let fakeUser = new User({
    email: "devanshtyagi@gmail.com",
    username: "devansh",
  });

  let registeredUser = await User.register(fakeUser, "7773");
  res.send(registeredUser);
});

// =========================================================
// ROUTER INTEGRATION
// =========================================================

// Listing router ko /listings path par mount kiya
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// --------------------
// 5. ERROR HANDLING
// --------------------

// CATCH-ALL ROUTE (404 Not Found) - jo bhi route match nahi hua, uske liye
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// GENERIC ERROR HANDLER - Saare application errors aur 404 ko handle karega
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error occured" } = err;
  res.status(status).render("error.ejs", { err });
});

// --------------------
// 6. START SERVER
// --------------------

app.listen(8080, () => {
  console.log("listening to port 8080");
});

// ## 📁 **Your File Structure:**
// ```;
// project/
// ├── app.js                    (File 3 - Main server file)
// ├── models/
// │   └── user.js              (File 1 - User model)
// ├── routees/
// │   ├── users.js             (File 2 - Authentication routes)
// │   ├── serve.js             (Your listings routes)
// │   └── review.js            (Your review routes)
// └── views/
//     └── users/
//         ├── signup.ejs
//         └── login.ejs
