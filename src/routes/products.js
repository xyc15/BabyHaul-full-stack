
const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
//const locus = require("locus");
const Product = require("../models/product");
const middleware = require("../middleware/middleware");

// router.get("/", (req, res) => {
//   Product.find({}, (err, products) => {
//     if(err){
//       console.log(err);
//     } else {
//       console.log("user is", req.user);
//       res.render("products/home", {products: products, page: "home"});
//     }
//   });
// });

//add pagination and fuzzy search
//for campground search purposes
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", (req, res) => {
  const perPage = Number(process.env.NUMBERPERPAGE);
  const page = req.query.page || 1;//current page number

  //implement fuzzy search
  let searchCondition = null;
  let searchKeywords = null;

  let hasProducts = true;
  if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      searchCondition = { name: regex };
      searchKeywords = req.query.search;
  }
  Product
          .find(searchCondition) //find all campgrounds
          .skip(perPage * page -perPage)
          .limit(perPage)
          .exec((err, products) => {
            if(err) {
              req.flash("error", err.message);
              return res.redirect("back");
            }
            Product.find(searchCondition).countDocuments().exec((err, count) =>{
              if(err) return next(err);
              //eval(locus);
              res.render("products/home", {
                products: products,
                page: "home",
                current: page,
                pages: Math.ceil(count/perPage),
                hasProducts: hasProducts,
                search: searchKeywords
              })
            })
          });
});

router.get("/new",middleware.isLoggedIn, (req, res) => {
  res.render("products/new");
});

router.post("/", middleware.isLoggedIn,(req, res) => {
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const product = {...req.body.product, author: author};
  Product.create(product, (err, product) => {
    if(err){
      console.log(err);
    } else{
      res.redirect("/products")
    }
  });
});
//note: use populate here to get access to all commets
router.get("/:id", (req, res) => {
  Product.findById(req.params.id).populate("comments").exec((err, foundProduct) => {
    if(err || !foundProduct){
      req.flash("error", "Product not found!");
      res.redirect("back");
    } else {
      res.render("products/show", {product: foundProduct})
    }
  });
});

router.get("/:id/edit", middleware.checkProductOwnership, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct)=>{
    if(err){
      req.flash("error", err);
      res.redirect("back");
    } else {
      res.render('products/edit', {product: foundProduct});
    }
  })
});

router.put("/:id", middleware.checkProductOwnership, (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body.product, (err, updatedProduct)=>{
    if(err){
      req.flash("error", err);
      return res.redirect("back"); //Note:
    } else {
      res.redirect("/products/" + updatedProduct._id);
    }
  });
});

router.delete("/:id", middleware.checkProductOwnership, (req, res) => {
  Product.findByIdAndDelete(req.params.id, (err, deletedProduct)=> {
    if(err){
      req.flash("error", err);
      res.redirect("back");
    } else {
      res.redirect("/products/");
    }
  })
});

module.exports = router;
