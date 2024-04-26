const mongoose = require('mongoose');
const Schema = mongoose.Schema

const twoFactorSchema = new Schema({
    "expireAt": { type: Date,  expires: 1000*60*6 }, // for 1 day
    Code: {
        type: Number,
        required: true
    },
    Phonenumber: {
        type: Number,
        required: true
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now
    }

})

const TwoFactorSchema=mongoose.model('Twofactor',twoFactorSchema);
module.exports=TwoFactorSchema;