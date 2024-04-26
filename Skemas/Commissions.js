const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Commission = new Schema({
    UserId: {
        type: String,
        required: true
    },
    CommissionStatus: {
        type: String,
        required: true,
        default:'InProgress'
    },
    CommissionName: {
        type: String,
    },
    CommissionPhoneNumber: {
        type: String,
    },
    CommissionServiceDetails: {
        type: String,
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now
    }

})

const Commissions=mongoose.model('Commissions', Commission);
module.exports=Commissions