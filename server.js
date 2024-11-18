const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });
const mongoose = require("mongoose");

const express = require("express");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
//helmet security
app.use(helmet());

// Middleware to parse JSON  body parser to read data from body in req.body
app.use(express.json({ limit: "10kb" }));
//data sanitization against noSQL query injection
app.use(mongoSanitize());
//data sanitization against XSS attacks
app.use(xss());

//prevent parameter pollution
app.use(hpp({ whitelist: ["duration"] }));
//security for limit requests
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "to many request from this IP please try again in an hour",
});
app.use(limiter);
// Use the user router for routes starting with /user
app.use("/user", userRouter);
app.use("/tour", tourRouter);
app.use("/review", reviewRouter);
const DB =
  "mongodb+srv://khalidmetavizoffice:YpVa7mT1kB8RSN0d@cluster0.dxrtw.mongodb.net/practice?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log("DB connection successful!"));

// const port = process.env.PORT || 3000;
const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
