const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ProofStatus = new Schema({
    fileName: {
        type: String,
        required: true
    },
    Phonenumber: {
        type: String,
        required: true
    },
    AdvertiserName: {
        type: String,
        required: true
    },
    rejectionStatement: {
        type: String,
        required: true,
        default:'none'
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now
    }
})
const Proof=mongoose.model('Proof',ProofStatus);
module.exports=Proof

