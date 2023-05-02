var express = require("express");

const apicache = require("apicache");
const queries = require("../middleware/queries");
var router = express.Router();
// Init cache
let cache = apicache.middleware;

router.use(cache("1 week"));

// Search String in Book Club DB
router.get(
  "/:search",
  queries.searchBooksTitle,
  queries.searchAuthorsName,
  (req, res) => {
    res.json({ books: req.books, authors: req.authors });
  }
);
// Search book title in Book Club DB
router.get("/title/:search", queries.searchBooksTitle, (req, res) => {
  res.json({ books: req.books });
});
// Search author in Book Club DB
router.get(
  "/author/:search",
  queries.searchAuthorsName,
  (req, res) => {
    res.json({ authors: req.authors });
  }
);

module.exports = router;
