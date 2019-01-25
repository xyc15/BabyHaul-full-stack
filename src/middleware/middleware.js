const Product = require("../models/product");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkProductOwnership = (req, res, next) => {
    if(req.isAuthenticated) {
      Product.findById(req.params.id, (err, foundProduct) => {
        if(err || !foundProduct){
          req.flash("error", "Product not found!");
          res.redirect("back");
        }
        else {
            if(foundProduct.author.id.equals(req.user._id)) {
            next();
            } else {
              res.redirect("back");
            }
        }
      })
    } else {
      req.flash("error", "User authentication failed!");
      res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = (req, res, next) => {
  if(req.isAuthenticated()){
    Comment.findById(req.params.commentId, (err, foundComment) => {
      if(err || !foundComment){
        req.flash("error", "Comment not found!");
        res.redirect("back")
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    })
  } else {
    req.flash("error", "User authentication failed!");
    res.redirect("back");
  }
}
middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
      next();
  } else {
    req.flash("error", "You need to Login!");
    res.redirect("/login");
  }
}

module.exports = middlewareObj;
