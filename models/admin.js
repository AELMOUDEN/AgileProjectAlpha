const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Admin = new Schema({
    email: {type: String, required:true, unique:true},
    username : {type: String, unique: true, required:true}
});

Admin.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', Admin);