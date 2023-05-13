const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    fullName: String,
    city: String,
    phoneNumber: String,
    shippingAddress: String,
    orderedProduct: String
})


module.exports = mongoose.model('Client', clientSchema)