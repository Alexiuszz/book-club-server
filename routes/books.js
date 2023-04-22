var express = require("express");
const apicache = require("apicache");
const {
  SearchByTitle,
  SearchByEdition,
  SearchByWork,
} = require("../utility/bookSearch");
const { searchBook } = require("../middleware/books");
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

router.get("/title/:title", cache("1 week"), searchBook, (req, res) => {
  res.json({books:req.books})
});

module.exports = router;
