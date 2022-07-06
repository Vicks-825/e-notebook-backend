const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/";

const connetToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to Mongo successfully");
    })
}
module.exports = connetToMongo;