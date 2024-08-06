require("dotenv").config(); //to get resources from .env file
// express
const express = require("express");
const app = express();

//rest of packages importations

//database
const connectDB = require("./db/connectDB");

//routes importations

//middlewares importations

//middlewares initialization

//route initialization

//errors initialization

//starting the app
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log(`Server is running on port ${port}...`);
  } catch (error) {
    console.log(error.message);
  }
};
start();
