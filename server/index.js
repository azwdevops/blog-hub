const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const authRoutes = require("#routes/authRoutes.js");
const postRoutes = require("#routes/postRoutes.js");

const app = express();
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(cookieParser());

// routes
app.use("/api/users", authRoutes);
app.use("/api/posts", postRoutes);

// note this comes at the end to ensure it works
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "unable to process your request";
  res.status(statusCode).json({ success: false, statusCode, message });
});

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `db connected and server listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
