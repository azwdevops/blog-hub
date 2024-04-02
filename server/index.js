const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const authRoutes = require("#routes/authRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", authRoutes);

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
