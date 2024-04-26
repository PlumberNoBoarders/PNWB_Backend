const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
    },
    ProfilePhotoUrl: {
        type: String,  
        required: true,
        default:'DEFAULT'
    },
    AuthId: {
        type: String,
        required: true,
        default:'DEFAULT'
    },
    Whatsapp:{
        type:Number,
        required:false,
        default:0
    },
    phoneNumber:{
        type:String,
        required:false,
        default:"0790---"
    },
    folderId: {
        type: String,
    },
    password: {
        type: String,
    },
    hasPassword: {
        type:Boolean,
        required:true,
        default:false
    },
    Account_Activated_For_Growth_Program:{
        type:Boolean,
        required:true,
        default:false
    },
    Alegible_For_Growth_Program:{
        type:Boolean,
        required:true,
        default:false
    },
    Address:{
        type:Object,
        required:true,
        default:{
            County:'Rwanda',
            Street:'none',
            City:'Kigali',
            Province:'Kigali',
            zipCode:'none'
        }
    },
    paymentNumber:{
        type:String,
        required:false,
        default:"0790---"
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('Users',UserSchema);
module.exports=UserModel;