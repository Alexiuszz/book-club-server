var express = require("express");
const apicache = require("apicache");
const { searchBook, addBooks } = require("../middleware/books");
var router = express.Router();

//  OL_id varchar(13),
// 	BC_id varchar (12),
// 	title varchar NOT NULL,
// 	author_name varchar,
// 	description varchar,
// 	covers varchar [],
// 	places varchar[],
// 	published date,
// 	people varchar[],
// 	subjects varchar[],
// 	links varchar,

// Init cache
let cache = apicache.middleware;

router.use(cache("1 week"));

//Search title in Open Library
router.get("/OL/title/:title", searchBook, addBooks, (req, res) => {
  res.json({ books: req.newBooks, books: req.books });
});

module.exports = router;
