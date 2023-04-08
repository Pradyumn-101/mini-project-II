const express=require('express');
const router=express.Router();
const User=require('../models/User')
const passport=require('passport');

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup',async(req,res)=>{
    try{
    const {username,password,pincode,address}=req.body;
    const user=new User({username,pincode,address});
    await User.register(user,password);
        res.redirect('/signin');
    }
    catch(e){
        res.send(e.message);
    }

})

router.get('/signin',async(req,res)=>{
    res.render('signin');
})

router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin'
  }),(req,res)=>{
    res.redirect('/products');
  });


router.get('/logout',(req,res)=>{
  req.logout();
});

module.exports=router;