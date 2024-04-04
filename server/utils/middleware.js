const jwt = require("jsonwebtoken");
const multer = require("multer");

const { errorHandler } = require("./error");

module.exports.verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "unauthorized"));
    }
    req.user = user;
    next();
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // we add a few random characters to the filename to make it unique
    const filename_parts = file.originalname.split(".");
    const new_filename = `${filename_parts[0]}_${Math.random()
      .toString(36)
      .slice(-8)}.${filename_parts[1]}`;
    cb(null, new_filename);
  },
});

module.exports.upload = multer({ storage });
