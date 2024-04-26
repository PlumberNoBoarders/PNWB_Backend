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
   res.render('Adverts',{adverts:results,link:process.env.SERVER_INTERNAL_URL_LINk});
   console.log(process.env.SERVER_INTERNAL_URL_LINk)
   
})
})
app.get('/Advertisers',isAuthenticated,(req,res)=>{
  User.find({Account_Activated_For_Growth_Program:true}).then((response)=>{
   res.render('Advertisers',{activated_Accounts:response,link:process.env.SERVER_INTERNAL_URL_LINk});
  })
})
app.get('/money',isAuthenticated,(req,res)=>{
 res.render('money');
})
app.get('/proof',isAuthenticated,(req,res)=>{
 Proof.find().then((results)=>{
  res.render('Proof',{proofs:results,link:process.env.SERVER_INTERNAL_URL_LINK});
  console.log(process.env.SERVER_INTERNAL_URL_LINK)
 })
})



module.exports= app;