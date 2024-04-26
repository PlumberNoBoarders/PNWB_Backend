const mongoose = require('mongoose');
const Schema = mongoose.Schema

const advert = new Schema({
    advertUrl: {
        type: String,
        required: true
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now
    }

})

const Advert=mongoose.model('advert',advert);
module.exports=Advert;