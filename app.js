const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./models/db');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//session config
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))

// Passport middleware
app.use(passport.initialize()); // invoke serialize method
app.use(passport.session());  // invoke deserialize method


//connect-flash
app.use(flash())

//Globals variable
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

//Routes
app.use('/',require('./routes/index'))

//Body Parser
app.use(express.urlencoded({extended:false}))

//Users
app.use('/users',require('./routes/users'))
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`Server is running at ${PORT}`))
