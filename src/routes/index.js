const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
//const locus = require("locus");

router.get("/", (req, res)=>{
    res.render("index/landing");
});

router.get("/register", (req, res) => {
  res.render('index/register', {page: "register"});
});

router.post("/register", (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      req.flash("error", err.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to BabyHaul " + req.user.username);
      res.redirect("/products");
    })
  });
});

router.get("/login", (req, res) => {
  res.render('index/login', {page: "login"});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/products",
  failureRedirect: "/login",
  successFlash: "Welcome to BabyHaul",
  failureFlash: "Username or Password Invalid"
}), (req, res) => {
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success","You've successfully logged out!");
  res.redirect("/");
});

module.exports = router;
