const express = require("express");
const router = express.Router({mergeParams: true});
//const locus = require('locus');
const Product = require("../models/product");
const Comment = require("../models/comment");
const middleware = require("../middleware/middleware");

router.post("/", middleware.isLoggedIn, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    if(err){
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err){
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          foundProduct.comments.push(comment);
          foundProduct.save();

          res.redirect("/products/" + req.params.id);
        }
      });
    }
  });
});

router.get("/:commentId/edit", middleware.checkCommentOwnership,(req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    if(err || !foundProduct){
      req.flash("error", "Product not found!");
      res.redirect("back");
    } else {
      Comment.findById(req.params.commentId, (err, foundComment) => {
        if(err || !foundComment){
        req.flash("error", "Comment not found!");
        res.redirect("back");
        } else {
          //eval(locus);
          res.render("comments/edit", {product:foundProduct, comment: foundComment});
        }
      });
    }
  })
});

router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, foundComment) => {
    if(err){
      console.log(err);
    } else {
      res.redirect("/products/" + req.params.id);
    }
  })
});

router.delete("/:commentId", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId, (err, deletComment) => {
    if(err){
      console.log(err);
    } else {
      res.redirect("/products/" + req.params.id);
    }
  });
});
module.exports = router;
