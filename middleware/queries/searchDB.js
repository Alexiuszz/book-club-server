const db = require("../../db");

module.exports = {
  searchBooksTitle: (req, res, next) => {
    var searchString = req.params.search.replaceAll("+", "|");
    console.log(searchString);
    db.query(
      "(SELECT bc_id, title, author_name, covers FROM books WHERE textsearchable_index_col @@ to_tsquery($1) LIMIT 10)",
      [searchString],
      (err, results) => {
        if (err) next(err);
        req.books = results.rows;
        next();
      }
    );
  },
  searchAuthorsName: (req, res, next) => {
    var searchString = req.params.search.replaceAll("+", "|");
    console.log(searchString);
    db.query(
      "(SELECT bc_id, name, photos FROM authors WHERE textsearchable_index_col @@ to_tsquery($1) LIMIT 10)",
      [searchString],
      (err, results) => {
        if (err) next(err);
        req.authors = results?.rows || {};
        next();
      }
    );
  },
};
