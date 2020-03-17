const  express = require('express'),
       app = express(),
       bodyParser = require('body-parser'),
       flash = require('connect-flash'),
       mongoose = require('mongoose'),
       passport = require('passport'),
       LocalStrategy = require('passport-local'),
       methodOverride = require('method-override'),
       Product = require('./models/product'),
       Comment = require('./models/comment'),
       User = require('./models/user'),
       seedDB = require('./seed');

const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const commentRoutes = require('./routes/comments');

require('dotenv').config();//get environment variables
//mongoose.connect(process.env.DATABASEURL, {useFindAndModify: false, );
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
//console.log("process.env.DATABASEURL is: ", process.env.DATABASEURL);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//use the following code to serve images, CSS files, and JavaScript files in a directory named public:
//Express looks up the files in which you set the static directory with the express.static middleware function.
// There are two underscres in front of dirname
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//passport configuration
app.use(require("express-session")({
  secret: "James is a wonderful baby",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//the following two allow you to stay logged-in when navigating between different pages within your application
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success  = req.flash("success");
  next();
});

app.locals.moment = require("moment");
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/products/:id/comments', commentRoutes);
//seedDB();

app.get('*', (req, res) => { //if the requested page is not in the public folder, give them back index.html file
  res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('server started!');
});
