const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session  = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;

// passport config
require('./config/passport')(passport);

// db config
const db = require('./config/keys').MongoURI;
require('./config/passport');

// mongo connection
mongoose.connect(db,{useNewUrlParser:true , useUnifiedTopology:true})
.then(()=>console.log("Mongodb Connected!!!"))
.catch(err=>console.log(err));

// ejs middlewere
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser
app.use(express.urlencoded({extended:false}));

// Express-Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }))

  // passport middlwere
  app.use(passport.initialize());
  app.use(passport.session());

//   connect-flash
app.use(flash());

// global variables
app.use( (req,res,next)=>{
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.err_msg =  req.flash('err_msg');
    res.locals.error =  req.flash('error');
    next();    
} )




// Routings==>
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(PORT , console.log(`Server Started at port ${PORT}`));