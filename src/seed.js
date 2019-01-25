const mongoose = require('mongoose');
const Product = require('./models/product');
const Comment = require('./models/comment')
const data = [
  {
    name: "diaper",
    price: 29,
    image: "https://www.allegromedical.com/images/productImages/9F/18/huggies-snug-and-dry-diapers-563178-MEDIUM_0.jpg",
    description: "works good",
    date: Date.now()
  },
  {
    name: "wipes",
    price: 19.8,
    image: "https://img.tesco.com/Groceries/pi/966/4015400621966/IDShot_540x540.jpg",
    description: "works OK",
    date: Date.now()
  },
  {
    name: "dinning chair booster",
    price: 70,
    image: "http://midcoastfamilyrentals.com/wp-content/uploads/2016/02/fpboosterhighchair.jpg",
    description: "have not tried yet",
    date:Date.now()
  },
  {
    name: "white noise machine",
    price: 37,
    image: "http://midcoastfamilyrentals.com/wp-content/uploads/2016/02/fpboosterhighchair.jpg",
    description: "have not tried yet",
    date: Date.now()
  }
]

const seedDB = () => {
  Product.remove({}, (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("removed Products");

      data.forEach((seed) => {
        Product.create(seed, (err, product) => {
          if(err) {
            console.log(err);
          } else {
            console.log("Add a new product!");
            Comment.create({
              text: "It is a very good purchase",
              date: Date.now()
            }, (err, comment) => {
              if(err) {
                console.log(err);
              } else {
                product.comments.push(comment);
                product.save();
              }
            });
          }
        });
      });

    }
  });
};

module.exports = seedDB;
