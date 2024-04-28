const { Router } = require("express");
const Readable = require("stream").Readable;
const fileSysteem = require("fs");
const User=require('../Skemas/user_Skema');
const Proof=require('../Skemas/proofsAdversts')
const app = Router();
const { google } = require("googleapis");
const drive = google.drive("v3");
const key = require("../onyx-seeker-412310-092f525e2a0f.json");
const Advert=require("../Skemas/advertsImage")
const grandParantIdGoogleDrive = "1HMXVq-9OnnaLb0HpleWsN98ZQMxAMDOg";
let jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/drive"],
  null
);

jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Authorization accorded");
  }
});
const checkAuthenticated = (req, res, next) => {
  console.log(req.cookies)
  if(req.user){
    res.locals.user = req.user;
    next();
    }else{
    if(req.cookies['121200909']){
      User.findOne({AuthId:req.cookies['121200909']}).then((data)=>{
        res.locals.user = data;
        next();
      }).catch((err)=>(err)&&console.error(err))
    }else{res.json({'loginStatus':'not logged In'})}
     
    }
  };
const createAgoogleFile = (fileMetadata, media) => {
  drive.files.create(
    {
      auth: jwToken,
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    async function (err, origin) {
    }
  );
};


app.post("/gihamya",(req, res) => {
const d = new Date();  
const createAfile= async ()=>{
  try {
    if (!fileSysteem.existsSync(`./public/${req.body.userName}`)) {

      fileSysteem.mkdirSync(`./public/${req.body.userName}`)
    }
  } catch (err) {
    console.error(err);
  }
}

 async function BringData(){
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      const element = req.body[key];
        if (key == "Pic") {
          if (file.includes("data:image/png;base64,")) {
            fileSysteem.writeFile(
              `./public/${req.body.userName}/${key}.avif`,
              element.replace("data:application/octet-stream;base64,", ""),
              "base64",
              function (err) {
                if (err) console.log(err);
              }
            );
          }
          if (file.includes("data:image/jpg;base64,")) {
            fileSysteem.writeFile(
              `./public/${req.body.userName}/${key}.avif`,
              element.replace("data:application/octet-stream;base64,", ""),
              "base64",
              function (err) {
                if (err) console.log(err);
              }
            );
          }
          if (file.includes("data:image/jpeg;base64,")) {
            fileSysteem.writeFile(
              `./public/${req.body.userName}/${key}.avif`,
              element.replace("data:application/octet-stream;base64,", ""),
              "base64",
              function (err) {
                if (err) console.log(err);
              }
            );
          }
        }
    }
  }
  return "finnished"
  }
  
  createAfile().then(()=>{
     BringData().then((data,err)=>{
        if(data=='finnished'){
          User.findOne({userName:req.body.userName}).then((results)=>{
            if(results.Account_Activated_For_Growth_Program==true){
              new Proof({
              fileName:'Video',
               Phonenumber:req.body.phoneNumber,
               AdvertiserName:req.body.userName
              }).save().then((result)=>{ res.json({Message:'proof uplaoded'})})
            }
           })
        }
        if (err) throw err
  })
  })

 
 
});

app.post('/approve',async (req,res)=>{
  if(req.body.approve=='approve'){
    Proof.findById(req.body.id)
    .then(async (results)=>{
      let proofId=results._id
      User.findOne({userName:results.AdvertiserName})
      .then(async (results)=>{
        const result= await User.findByIdAndUpdate(results._id, {Whatsapp:results.Whatsapp+1}, { new: true,  upsert: true  })
         if(results.Whatsapp+1==result.Whatsapp){
          const result= await  Proof.findByIdAndDelete(proofId)
          setTimeout(()=>{
            fileSysteem.rm(`./${req.body.userName}`,{recursive:true}, err => {
              if (err) {
                throw err;
              }
              res.redirect('/admin/proof');
        
            });
          },5000)
        };
      })
    })
  }else{
    const proofId=req.body.id
    Proof.findById(proofId).then( async (resultings)=>{
     const result= await  Proof.findOneAndUpdate({AdvertiserName:resultings.AdvertiserName},{rejectionStatement:[req.body.approve]})
     console.log(result.AdvertiserName)
    })
  }
})

app.post('/uploadAdvert',(req,res)=>{
 const d = new Date(); 
 async function BringData(){
  const file = req.body.data;
  if (file.includes("data:image/avif;base64,")) {
    fileSysteem.writeFile(
      `./public/advertImage/${req.body.imgFolder}.avif`,
      file.replace("data:image/avif;base64,", ""),
      "base64",
      function (err) {
        if (err) console.log(err);
      }
    );
  }
  if (file.includes("data:image/png;base64,")) {
    fileSysteem.writeFile(
      `./public/advertImage/${req.body.imgFolder}.avif`,
      file.replace("data:image/png;base64,", ""),
      "base64",
      function (err) {
        if (err) console.log(err);
      }
    );
  }
  if (file.includes("data:image/jpg;base64,")) {
    fileSysteem.writeFile(
      `./public/advertImage/${req.body.imgFolder}.avif`,
      file.replace("data:image/jpg;base64,", ""),
      "base64",
      function (err) {
        if (err) console.log(err);
      }
    );
  }
  if (file.includes("data:image/jpeg;base64,")) {
    fileSysteem.writeFile(
      `./public/advertImage/${req.body.imgFolder}.avif`,
      file.replace("data:image/jpeg;base64,", ""),
      "base64",
      function (err) {
        if (err) console.log(err);
      }
    );
  }
  return `/public/advertImage/${req.body.imgFolder}.avif`
  }
  BringData().then((data)=>{
    new Advert({
      advertUrl:data
    }).save().then(()=>{
      res.json({url:'saved'})
    });
  });
})
app.post('/approveUser',async (req,res)=>{
 const p= await User.findOneAndUpdate({userName:req.body.userName}, {Alegible_For_Growth_Program:true});
 if(p){
   res.json({'Message':'Approved'})
 }else{
  res.json({'Message':'Disapproved'}) 
 }
})
app.post('/deleteAdvert',(req,res)=>{
   Advert.findOneAndDelete({advertUrl:req.body.deleteUrl})
   .then((results)=>{
    console.log(results)
     fileSysteem.rm(`.${results.advertUrl}`,{recursive:true}, err => {
    if (err) {
      throw err;
    }
    res.json({deleted:'true'});
    });
   })
})
module.exports = app;
