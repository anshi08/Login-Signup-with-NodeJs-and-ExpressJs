const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport')
const User = require('../models/User');

//Login Page
router.get('/login',NotLoggedIn,(req,res)=> res.render('login'));


//Register Page
router.get('/register',(req,res)=> res.render('register'));

//Register Handle
router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:"Please Fill all the fields"});
    }
    
    //Check password match
    if(password !== password2){
        errors.push({msg:'Password do not match'});
    }

    //Check password length
    if(password.length<6){
        errors.push({msg:"Password length must be more than 6 character"});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //Validation passed
        User.findOne({email:email})
            .then(user =>{
                if(user){
                    //User exists
                    errors.push({msg:'Email Already registered'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    //Hash password
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;
                            //Set password to hash
                            newUser.password = hash
                            newUser.save()
                            .then(()=>{
                                req.flash('success_msg','You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err=>console.log(err))
                        })
                    })  
                }
            })

    
    }

})

//Login Handle
router.post('/login',passport.authenticate('signin',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
}))

// Logout Handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out!!!');
    res.redirect('/users/login');
})

function NotLoggedIn(req,res,next){
    if(!req.isAuthenticated()) return next();
    req.flash('error_msg','You are already Login');
    res.redirect('/dashboard');
    }
module.exports = router