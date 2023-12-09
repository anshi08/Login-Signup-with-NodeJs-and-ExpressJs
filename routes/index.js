const express = require('express')
const router = express.Router();

//Home Page
router.get('/',(req,res)=> res.render('welcome'));

//Dashboard page
router.get('/dashboard',isLoggedIn,(req,res)=>res.render('dashboard'));

//Login Function
function isLoggedIn(req,res,next){
if(req.isAuthenticated()) return next();
req.flash('error_msg','Please log in to view the resource');
res.redirect('/users/login');
}

module.exports = router