const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://vk82562425:KuUlXrAymE9h92Qd@e-notebook-cluster.ohqjkog.mongodb.net/?retryWrites=true&w=majority&appName=e-notebook-cluster";

const connetToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to Mongo successfully");
    })
}
module.exports = connetToMongo;