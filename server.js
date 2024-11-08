require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const app = express();

// Middleware to parse JSON
app.use(express.json());

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
