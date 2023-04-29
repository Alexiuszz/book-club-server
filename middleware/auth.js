var bcrypt = require("bcryptjs");
const db = require("../db")

const checkEmail = (req, res, next) => {
  const { email } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (err, results) => {
      if (err) throw err;
      !(results.rows.length > 0)
        ? next()
        : res.status(400).json({ acctFound: true });
    }
  );
};

const authenticate = (req, res, next) => {
  const { email, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (err, results) => {
      if (err) throw err;
      if (!results.rows.length > 0) {
        res.status(404).json({ acctFound: false });
      } else {
        bcrypt.compare(
          password,
          results.rows[0].password,
          function (err, response) {
            if (err) throw err;
            if (response) {
              req.user = {
                email: results.rows[0].email,
                username: results.rows[0].username,
                id: results.rows[0].user_id,
                name: results.rows[0].name,
              };
              next();
            } else res.status(404).json({ wrongPassword: true });
          }
        );
      }
    }
  );
};

module.exports = {
  checkEmail,
  authenticate,
};
