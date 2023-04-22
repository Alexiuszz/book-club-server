const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const validateToken = (req, res) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.send("Successfully Verified");
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
};

const generateToken = (req, res) => {

  // Validate User Here
  // Then generate JWT Token
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: req.body.userId || 12,
  };

  const token = jwt.sign(data, jwtSecretKey);

  res.send(token);
};


module.exports = {
  generateToken, validateToken
}