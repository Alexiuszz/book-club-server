const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config("..");

const validateToken = (req, res, next) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    req.verified = verified;
    next();
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
};

const generateToken = (req, res, next) => {
  // Validate User Here
  // Then generate JWT Token
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: req.user.id,
  };
  let config = {
    algorithm: "HS256",
    expiresIn: "1 days",
  };

  jwt.sign(data, jwtSecretKey, config, (err, token) => {
    req.token = token;
    next();
  });
};

module.exports = {
  generateToken,
  validateToken,
};
