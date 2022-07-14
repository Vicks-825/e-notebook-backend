//import mongoose from 'mongoose';
//const { Schema } = mongoose;
const mongoose = require('mongoose');

const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);