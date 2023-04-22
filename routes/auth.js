var express = require("express");
var router = express.Router();
const Pool = require("pg").Pool;
var bcrypt = require("bcryptjs");
const { checkEmail, authenticate } = require("../middleware/auth");
const { generateToken } = require("../middleware/jwt");

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "bookclub",
  password: "password",
  port: 5432,
});

//redirect to login
router.get("/", function (req, res, next) {
  res.redirect("login");
});

//login, authenticate middleware first
router.post("/login", authenticate, generateToken, (req, res) => {
  req.user.token = req.token;
  res.send({ user: req.user });
});

//sign up, check if email already exists through middleware first
router.post("/signup", checkEmail, (req, res) => {
  const { name, email, username, phone, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) throw err;
      pool.query(
        "INSERT INTO users (name, email, username, phone, password) VALUES ($1,$2,$3,$4,$5) RETURNING user_id",
        [name, email, username, phone, hash],
        (err, results) => {
          if (err) throw err;
          res.status(201).json({ id: results.rows[0].user_id });
        }
      );
    });
  });
});
module.exports = router;
