const  {Router}=require('express');
const User=require('../Skemas/user_Skema');
const app = Router();

const checkAuthenticated = (req, res, next) => {
    if(req.user){
      res.locals.user = req.user;
      next();
      }else{
      if(req.cookies['12120088709']){
        console.log(req.cookies['12120088709'])
        User.findOne({AuthId:req.cookies['12120088709']}).then((data)=>{
          res.locals.user = data;
          next();
        }).catch((err)=>(err)&&console.error(err))
      }else{res.json({'loginStatus':'not logged In'})}
       
      }
};
app.post('/UpdatePersonalInfo',checkAuthenticated,(req,res)=>{
    if(req.body.userName){
        User.findOneAndUpdate({userName: res.locals.user.userName},{userName:req.body.userName},{new:true}).then((data)=>{
           console.log(`data ${data}`)
        }).catch((err)=>(err)&&console.error(err))
    }
    if(req.body.Email){
        User.findOneAndUpdate({Email:res.locals.user.Email},{Email:res.locals.user.Email},{new:true}).then((data)=>{
            console.log(`data ${data}`)
        }).catch((err)=>(err)&&console.error(err))
    }
    if(req.body.Address){
        User.findOneAndUpdate({Address:res.locals.user.Address},{Email:res.locals.user.Address},{new:true}).then((data)=>{
            console.log(`data ${data}`)
        }).catch((err)=>(err)&&console.error(err))
    }
    if(req.body.Phonenumber){
        User.findOneAndUpdate({Phonenumber:res.locals.user.Phonenumber},{Phonenumber:req.body.Phonenumber},{new:true}).then((data)=>{
            console.log(`data is  ${data}`)
        }).catch((err)=>(err)&&console.error(err))
    }
})

