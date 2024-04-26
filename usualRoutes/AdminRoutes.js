const  {Router}=require('express');
const User=require('../Skemas/user_Skema');
const Proof=require('../Skemas/proofsAdversts');
const Adverts=require('../Skemas/advertsImage')
const app = Router();
const isAuthenticated=(req,res,next)=>{
 if(req.cookies['ADMIN_KEY']==process.env.ADMIN_KEY){
    next()
 }else{
    res.redirect('/admin')
 };
}

const internal=process.env.SERVER_INTERNAL_URL_LINK
app.get('/',(req,res)=>{
 res.render('login');
})
app.get('/',(req,res)=>{

 res.render('index',);
})
app.get('/authenticated',isAuthenticated,(req,res)=>{
    User.find({Account_Activated_For_Growth_Program:true}).then((response)=>{
        res.render('index',{activated_Accounts:response});})
})
app.get('/Adverts',isAuthenticated,(req,res)=>{
Adverts.find().then((results)=>{
   res.render('Adverts',{adverts:results,link:internal});
})
})
app.get('/Advertisers',isAuthenticated,(req,res)=>{
  User.find({Account_Activated_For_Growth_Program:true}).then((response)=>{
   res.render('Advertisers',{activated_Accounts:response,link:internal});
  })
})
app.get('/money',isAuthenticated,(req,res)=>{
 res.render('money');
})
app.get('/proof',isAuthenticated,(req,res)=>{
 Proof.find().then((results)=>{
  res.render('Proof',{proofs:results,link:internal});
 })
})



module.exports= app;