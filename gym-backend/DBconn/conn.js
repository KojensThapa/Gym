// import dotenv from 'dotenv'
// import mongoose from 'mongoose'
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const URI = process.env.MongoDBURI;

const connectDB = async ()=>{
    try {
       await mongoose.connect(URI);
    //    console.log("Connection establish at: ", URI);
       console.log("Connection sucessfull with DB.");
    } catch (error) {
        console.log("DB connection Failed.")
    }
}
connectDB();
// export default connectDB
