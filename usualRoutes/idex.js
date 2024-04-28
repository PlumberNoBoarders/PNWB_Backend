const {Router}=require('express')
const bcrypt = require('bcrypt')
const User=require('../Skemas/user_Skema');
const TwoFactorCode=require('../Skemas/2FactorCodes');
const Commissions=require('../Skemas/Commissions');
const Advert=require('../Skemas/advertsImage');
const {sendToMessage,sendToGroup}=require('../WhatsappApi/index')
const app = Router();
const saltRounds = 10;

const checkAuthenticated = (req, res, next) => {
  if(req.user){
    res.locals.user = req.user;
    next();
    }else{
    if(req.body.a121200909!==''){
      User.findOne({AuthId:req.body.a121200909}).then((data)=>{
        res.locals.user = data;
        next();
      }).catch((err)=>(err)&&console.error(err))
    }else{res.json({'loginStatus':'not logged In'})}
     
    }
  };
const checkOtp=(req,res,next)=>{
    TwoFactorCode.findOne({Code:req.body.code}).then((result)=>{
      if(result){
       if(((new Date().getTime()-new Date(result.Date).getTime())/1000)/60 <= 6){
       next()
      }else{
        TwoFactorCode.findByIdAndDelete(result.id).then(()=>{
          res.json({'otp':'outdated'})
        })
      }
    } else {
       res.json({'otp':'invalid'})
      }
    })
  
}
app.post('/user',checkAuthenticated,(req,res)=>{
   res.json(res.locals.user);
})
app.post('/login',(req,res)=>{
  User.findOne({Email:req.body.Email})
  .then((data)=>{
   if(!data){
    res.json({"Message":"no user with this email"})
   }else{
    if(bcrypt.compareSync(req.body.password, data.password)){
      res.json({"Message":"Logged in",'cName':'121200909','cValue':data.AuthId,'days':7});
    }else{
      res.json({"Message":"Wrong password"})
    }
   }
  })
})
app.post('/whatsappTwofactorAuth',(req,res)=>{
  const waPhone=req.body.phone
  const code=Math.random().toString().slice(3,8)
  User.findOne({Email:req.body.email}).then(async(result)=>{
    if(result){
     await User.findByIdAndUpdate(result._id, {phoneNumber:waPhone,paymentNumber:waPhone}, {new: true,upsert: true });
      new TwoFactorCode({
      Code:code,
      Phonenumber:waPhone
     }).save().then((data)=>{
       sendToMessage(waPhone,`Hello , This is plumberswithnoborder.com , Your OTP-code is ${data.Code} . It will last for 6 minutes only ||| Kode yanyu ni ${data.Code} , Iramara iminota 6 Gusa`);
       res.json({'Message':`Code was sent to ${waPhone}`,'Email':'valid'});
     })}else{
      res.json({'Message':`No user with this email exist`});
     }
  })
 

})
app.post('/UpdateGrowthTerms',(req,res)=>{
  User.findById(req.body.Id).then( async (results)=>{
   if(results){
    const p= await User.findByIdAndUpdate(results._id, {Account_Activated_For_Growth_Program:req.body.accepted});
    if(p){
      res.json({'Message':'success'})
    }
   }else{
    res.json({'Message':'Not logged in'})
   }
  })
})
app.post('/UpdateInfo',(req,res)=>{
  User.findById(req.body.Id).then( async (results)=>{
   if(results){
    const p= await User.findByIdAndUpdate(results._id, {userName:req.body.name,Email:req.body.name});
    if(p){
      res.json({'Message':'success'})
    }
   }else{
    res.json({'Message':'Not logged in'})
   }
  })
})
app.get('/getAdvert',(req,res)=>{
  Advert.find().then((resp)=>{
    res.json({adverts:resp})
  })
})
app.post('/schedule',(req,res)=>{
  const clientsName=req.body.name;
  const clientsEmail=req.body.email;
  const clientPhone=req.body.phone;
  const clientsProblem=req.body.problem;
  const MessageToPlumbersWithnoBordersGroup=`Muraho uyu n' Umukiriya uciye kuri website yacu \n Izina rye ni ${clientsName} \n Imeli ye ni ${clientsEmail} \n Telphone yatanze twamuvugishirizaho ni ${clientPhone} \n Ikibazo afite ngo ' ${clientsProblem} '`;
  sendToGroup(MessageToPlumbersWithnoBordersGroup);
  res.json({Message:'success'})
})
app.post('/TangaUbutumwa',(req,res)=>{
  const MessageToPlumbersWithnoBordersGroup=`Iki n'igitekerezo cyumwe muba client bacu, agize ati '${req.body.message}'`;
  sendToGroup(MessageToPlumbersWithnoBordersGroup);
  res.json({Message:'success'})
})
app.post('/UpdateAddress',(req,res)=>{
  User.findById(req.body.Id).then( async (results)=>{
   if(results){
    const p= await User.findByIdAndUpdate(results._id, {Address:{County:'Rwanda',Street:req.body.streetNumber,City:req.body.city,province:req.body.province}});
    if(p){
      res.json({'Message':'success'})
    }
   }else{
    res.json({'Message':'Not logged in'})
   }
  })
})
app.post('/UpdatePaymentNumber',(req,res)=>{
  User.findById(req.body.Id).then( async (results)=>{
   if(results){
    const p= await User.findByIdAndUpdate(results._id, {phoneNumber:req.body.paymentNumber});
    if(p){
      res.json({'Message':'success'})
    }
   }else{
    res.json({'Message':'Not logged in'})
   }
  })
})
app.post('/registerNewUser',(req,res)=>{
User.findOne({phoneNumber:req.body.number})
.then((data)=>{
 if(!data){
 const hash = bcrypt.hashSync(req.body.password, saltRounds);
 new User({
   userName:req.body.name,
   Email:req.body.Email,
   phoneNumber:req.body.phone,
   paymentNumber:req.body.phone,
   password:hash,
   hasPassword:true,
   AuthId:hash
 }).save().then(()=>{
  console.log(hash);
  res.cookie('121200909',hash,{ maxAge: 1000 * 60 * 60 * 24 * 7 , httpOnly: true });
  const waPhone=req.body.phone
  const code=Math.random().toString().slice(3,8)
  new TwoFactorCode({
   Code:code,
   Phonenumber:waPhone
  }).save().then((data)=>{
    sendToMessage(waPhone,`Hello , This is plumberswithnoborder.com , Your OTP-code is ${data.Code} . It will last for 6 minutes only ||| Kode yanyu ni ${data.Code} , Iramara iminota 6 Gusa`);
    res.json({'Message':`Code was sent to ${waPhone}`});
  })
})
 }else{res.json({"UserExistance":"true"})}
})
})
app.post('/resetpassword_1',(req,res)=>{
  User.findOne({phoneNumber:req.body.phone}).then((results)=>{
    const waPhone=results.phoneNumber
    const code=Math.random().toString().slice(3,8)
    if(results){
      new TwoFactorCode({
        Code:code,
        Phonenumber:waPhone
       }).save().then((data)=>{
         sendToMessage(waPhone,`Hello , This is plumberswithnoborder.com , Your OTP-code is ${data.Code} . It will last for 6 minutes only ||| Kode yanyu ni ${data.Code} , Iramara iminota 6 Gusa`);
         res.json({'Message':`Code was sent to ${waPhone}`,'Phone':'valid'});
       })
    }else{
     res.json({Message:'No user with this phonenumber'})
    }
  })
})
app.post('/resetpassword_3',checkOtp, async (req,res)=>{
  const hash = bcrypt.hashSync(req.body.password, saltRounds);
  const result= await User.findOneAndUpdate({phoneNumber:req.body.phone}, {password:hash,AuthId:hash}, { new: true,  upsert: true  })
   if(result){
    res.json({Message:'Reset password successful'})
  }
})
app.post('/NewCommision',(req,res)=>{
   new Commissions({
    UserId:req.body.id,
    CommissionName:req.body.Commission_name,
    CommissionPhoneNumber:req.body.Commision_Phone,
    CommissionServiceDetails:req.body.Commision_Discription
    }).save().then((resp1)=>{
    User.findById(req.body.id).then( async (resp)=>{
      const MessageToPlumbersWithnoBordersGroup=`Iyi ni komisiyo ikozwe na '${resp.userName}' . \n Izina ry'ushaka Serivisi ni ${req.body.Commission_name}  \n Nimero ye ni ${req.body.Commision_Phone} \n Ubusobanuro bwibyo ashaka ${req.body.Commision_Discription}`;
      sendToGroup(MessageToPlumbersWithnoBordersGroup);
        res.json({'Message':'success'})
    })
    }).catch((err)=>{
     if(err){
      console.log(err)
      res.json({'Message':'error while saving'})
     }
    })
})
app.post('/CommisionsCurrentUser',(req,res)=>{
  Commissions.find({UserId:req.body.id}).then((results)=>{
   res.json({'commisions':results});
  })
})
app.post('/checkOtp',checkOtp,(req,res)=>{
  res.json({'otp':'valid'})
})
app.get('/',(req,res)=>{
    res.json({'status':'now server is on'})
})
module.exports= app