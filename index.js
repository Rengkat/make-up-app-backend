require("dotenv").config(); //to get resources from .env file
// express
const express = require("express");
const app = express();

//rest of packages importations
const morgan = require("morgan");

//database
const connectDB = require("./db/connectDB");

//routes importations
const usersRoute = require("./route/authRoute");
//middlewares importations
const notFoundMiddleware = require("./middleware/note-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
//middlewares initialization
app.use(morgan("tiny")); //to see the hit route in the console
app.use(express.json()); // to get json form of res

//route initialization
app.use("/api/auth", usersRoute);
//errors initialization
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
//starting the app
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}...`));
  } catch (error) {
    console.log(error.message);
  }
};
start();
