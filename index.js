require("dotenv").config(); //to get resources from .env file
// express
const express = require("express");
const app = express();

//rest of packages importations
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const xss = require("xss-clean");

//database
const connectDB = require("./db/connectDB");

//routes importations
const authRoute = require("./route/authRoute");
const userRoute = require("./route/userRoute");
const appointmentRoute = require("./route/appointmentRouter");
const categoryRoute = require("./route/categoryRoute");
const productRoute = require("./route/productRoute");
const reviewRoute = require("./route/reviewRoute");
const wishlistRoute = require("./route/wishlistRoute");
const cartRoute = require("./route/cartRouter");
//middlewares importations
const notFoundMiddleware = require("./middleware/note-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
//middlewares initialization
app.use(morgan("tiny")); //to see the hit route in the console
app.use(express.json()); // to get json form of res
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload()); //to upload image
app.use(express.static("./public"));
app.use(xss());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend port
    credentials: true, // Allows cookies to be sent with requests
  })
);

//route initialization
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/cart", cartRoute);

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
    process.exit(1);
  }
};
start();
// e163fc84
// 7047064866;
//08079353851
// sunday@ocsf.org.ng
