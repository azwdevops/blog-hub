const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("#models/userModel.js");
const { errorHandler } = require("#utils/error.js");

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (password !== confirmPassword) {
      return next(errorHandler(400, "Passwords must match"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = User({ username, email, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: "Signed up successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(errorHandler(400, "invalid login credentials"));
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid login credentials"));
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

    // separate the password from the other fields to avoid sending it back in the json response
    const { password: dbPassword, ...otherUserFields } = existingUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(otherUserFields);
  } catch (error) {
    return next(error);
  }
};
