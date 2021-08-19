const express= require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User')
const passport = require('passport');

router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register');
})

// Registration
router.post('/register',(req,res)=>{
    
    const { name,email,password,password2  } =req.body;

    let errors = [];

    // Required fields
    if(!email || !name || !password || !password2){
        errors.push( { msg:"Fill all the fields!!!"  } )
    }

    // Password Validation
    if(password!=password2){
        errors.push( { msg:"Passwords don't match!!" })
    }

    if(errors.length > 0){
        res.render( 'register',{
            errors,
            name,
            email,
            password,
            password2
        } )
    }else{
        // validation passed
        User.findOne( {email:email} )
        .then(user=>{
            if(user){
                // user existes already
                errors.push( {msg:'Email is already registered!!!'} )
                res.render('register',{ //already reg so render the register page
                    errors, name, password, password //show the errors too
                });
            }else{
                const newUser = new User({
                    name,email,password
                });
                // console.log(newUser);
                // res.send("HEy new user");

                // Password Hashing
                bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(newUser.password , salt ,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash; //new hashed password
                    newUser.save() //save the pass in the database
                      .then(user=>{
                          
                        req.flash('success_msg','You are now registered , login now!!')
                        res.redirect('/users/login') }) //after saving redirect to login page
                      .catch( err=>console.log(err) )
                }))


            }
        }  )
    }

})

// Login Handle
router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

// logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Logged Out!!!')
    res.redirect('/users/login')
})


module.exports = router;