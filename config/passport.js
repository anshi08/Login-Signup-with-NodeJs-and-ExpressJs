const passport = require('passport');
const User =require('../models/User');
const bcrypt =require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    console.log('serializeuser-->'+user); 
    done(null,user.id)}
    );

passport.deserializeUser((id,done)=>{
    console.log('deserializeuser-->'+id);
    User.findById(id,(err,user)=>done(err,user))
})

passport.use('signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(req,email,password,done)=>{
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                return done(null,false,{message:'That email is not registered'});
            }
            
            //Match password
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch)
                return done(null,user);
                else
                return done(null,false,{message:'Password Incorrect'});
            })
        })
        .catch(err=>console.log(err))
}))