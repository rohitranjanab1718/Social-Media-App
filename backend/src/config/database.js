const mongoose = require("mongoose");

const connectDB = async () => {
    try{
       await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    }catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;