const uniqid = require("uniqid");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.INSERT_USER = async (req, res) => {
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).json({ response: "Invalid email format" });
    }

    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ response: "Password must be at least 6 characters long" });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        const user = new UserModel({
          id: uniqid(),
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: hash,
          bought_tickets: [],
          money_balance: "",
        });

        await user.save();

        const token = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        const refreshToken = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "24h" }
        );

        res.status(200).json({
          response: "User was saved successfully",
          token: token,
          refreshToken: refreshToken,
        });
      });
    });
  } catch (err) {
    res
      .status(500)
      .json({ response: "User was not saved, please try later" });
  }
};


module.exports.LOGIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ response: "Bad data" });
    }

    bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch) => {
      if (isPasswordMatch) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" },
          {
            algorithm: "RS256",
          }
        );

        const refreshToken = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "24h" }
        );

        return res.status(200).json({ response: "You logged in", jwt: token, refreshToken: refreshToken });
      } else {
        return res.status(401).json({ response: "Bad data" });
      }
    });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.NEW_JWT_TOKEN = async (req, res) => 
{
    try {

        const refreshToken = req.body.refreshToken;

       jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
     
      const newToken = jwt.sign(
        {
          email: decoded.email,
          userId: decoded.userId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" },
        {
          algorithm: "RS256",
        }
      );

      return res.status(200).json({ jwt: newToken, refreshToken: refreshToken });
    });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "You must login again" });
  }
};
