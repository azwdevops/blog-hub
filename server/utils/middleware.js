const jwt = require("jsonwebtoken");

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
