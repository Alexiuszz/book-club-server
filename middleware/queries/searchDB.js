const db = require("../../db");

module.exports = {
  getAuthor: (req, res, next) => {
    var bcId = req.params.authorId;
    db.query(
      "Select * from authors where bc_id = $1",
      [bcId],
      (err, results) => {
        if (err) next(err);
        req.author = results.rows;
        next();
      }
    );
  },
  getBook: (req, res, next) => {
    var bcId = req.params.bookId;
    db.query(
      "Select * from books where bc_id = $1",
      [bcId],
      (err, results) => {
        if (err) next(err);
        req.book = results.rows;
        next();
      }
    );
  },
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
