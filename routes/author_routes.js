var express = require("express");
const apicache = require("apicache");
const {
  searchAuthor,
  addAuthors,
} = require("../middleware/authorMiddlewares");
var router = express.Router();

// Init cache
let cache = apicache.middleware;

router.use(cache("1 week"));

/* 
	OL_id varchar(13),
	BC_id varchar (12),
	name varchar(50) NOT NULL,
	works_count SMALLINT CHECK (works_count > 0),
	bio varchar,
	photo varchar [],
	birth_date date,
	links json [],
	top_work varchar,
        */
router.get("/OL/name/:name", searchAuthor, addAuthors, (req, res) => {
  res.json({ authors: req.authors });
});

module.exports = router;
