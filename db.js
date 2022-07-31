const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://vicks-825:pass1234pass@e-notebook.w7ro1.mongodb.net/e-notebook?retryWrites=true&w=majority";

const connetToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to Mongo successfully");
    })
}
module.exports = connetToMongo;