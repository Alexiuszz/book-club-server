var express = require("express");
const apicache = require("apicache");
const { searchAuthor } = require("../middleware/authorMiddlewares");
var router = express.Router();

// Init cache
let cache = apicache.middleware;

router.use(cache("1 week"));

router.get("/name/:name", searchAuthor, (req, res) => {
  res.json({ authors: req.authors });
});

module.exports = router;