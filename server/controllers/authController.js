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

module.exports.googleAuth = async (req, res, next) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...otherUserFields } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(otherUserFields);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        email,
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...otherUserFields } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(otherUserFields);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "Permission to update user denied"));
    }
    // username related tests
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    // username related tests
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 characters")
        );
      }
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be all lowercase"));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, "Username can only contain letters and numbers")
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true } // to ensure we get back the updated user
    );
    const { password, ...otherUserFields } = updatedUser._doc;

    return res.status(200).json(otherUserFields);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
