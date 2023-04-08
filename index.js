const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const engine=require('ejs-mate');
const productRoutes=require('./routes/productRoutes');
const seed=require('./seed');
const session=require('express-session');
const User=require('./models/User');
const authRoutes=require('./routes/authRoutes');
app.use(express.urlencoded({extended:true}));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires:60*60*1000,secure: true }
  }));
const passport=require('passport');
const LocalStrategy=require('passport-local');


// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
passport.session();
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.session());


app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));

mongoose.connect('mongodb://127.0.0.1:27017/signup').then(()=>
{
    seed();
    console.log("DB connected")
} ).catch((e)=>console.log(e));
//Schema
app.use(productRoutes);
app.use(authRoutes);



const sch=new mongoose.Schema({
    username:String,
    password:String,
    pincode:Number,
    address:String
})
const schema=new mongoose.Schema({
    username:String,
    password:String
});
//model
const model=mongoose.model("SigninDetails",schema);
const monmodel=mongoose.model("SignupDetails",sch);
// app.post("/signup",async(req,res)=>
// {
//     const {username,password,pincode,address}=req.body;
//     console.log(username,password,pincode,address);
//     await monmodel.create({username,password,pincode,address});
//     res.send('done');
// })
// app.post("/signin",async(req,res)=>
// {
//     const {username,password}=req.body;
//     console.log(username,password);
//     await monmodel.create({username,password});
//     res.render('seller1');
// })
app.get('/',(req,res)=>{
    res.render('index')
});
//  app.get('/signin.ejs',(req,res)=>{
//      res.render('signin')
//  });
//  app.get('/signup.ejs',(req,res)=>{
//     res.render('signup')
// });

app.listen(5000,()=>
{
    console.log("Server connected");
});
