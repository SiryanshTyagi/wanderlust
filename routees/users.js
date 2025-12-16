const express = require("express");
const router = express.Router();

const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");

const UserController = require("../controllers/users.js");

//SignUp
router
  .route("/signup")
  .get(UserController.getSignup)
  .post(UserController.postSignup);

//login
router
  .route("/login")
  .get(UserController.getLogin)
  .post(
    saveRedirectedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.postLogin
  );

//logout
router.get("/logout", UserController.logout);

module.exports = router;
