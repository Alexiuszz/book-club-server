const {
  SearchByWork,
  SearchByTitle,
} = require("../utility/bookSearch");
const { pool } = require("../utility/db");
const { generateId } = require("../utility/generateId");

const searchBook = (req, res, next) => {
  var title = req.params.title;
  var docs;
  SearchByTitle(title)
    .then((pool) => {
      // res.json({ books: pool.body.docs });
      docs = pool.body.docs;
      return Promise.all(
        docs.slice(0, 10).map((doc) => {
          var workKey = doc.key.split("/")[2];
          return SearchByWork(workKey);
        })
      );
    })
    .then((booksRes) => {
      var books = booksRes.map((bookRes) => bookRes.body);
      let newBooks = [];
      books.forEach((book, i) => {
        newBooks.push({
          title: book.title,
          authorName: docs[i].author_name,
          published: docs[i].first_publish_year,
          languages: docs[i].language,
          publisher: docs[i].publisher,
          OL_id: docs[i].key.split("/")[2],
          covers: book.covers,
          places: book.subject_places,
          subjects: book.subjects,
          people: book.subject_people,
          description: book.description && book.description,
          links: book.links && book.links,
        });
      });
      req.books = newBooks;
      next();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const addBooks = (req, res, next) => {
  let books = req.books;
  let newBooksCount =0;
  books.forEach((book) => {
    pool.query(
      "SELECT * FROM books WHERE OL_id = $1",
      [book.OL_id],
      (error, results) => {
        if (error) throw error;
        if (!(results.rows.length > 0)) {
          newBooksCount++;
          pool.query("SELECT * FROM books", (error, results) => {
            let BC_id = generateId(book, results.rows.length);
            let published = new Date(book.published.toString());
            pool.query(
              "INSERT INTO books (OL_id,BC_id,title,author_name,description,covers,places,published,people,subjects,links ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING BC_id",
              [
                book.OL_id,
                BC_id,
                book.title,
                book.authorName,
                book.description,
                book.covers,
                book.places,
                published,
                book.people,
                book.subjects,
                book.links,
              ],
              (err, results) => {
                if (err) throw err;
              }
            );
          });
        }
      }
    );
  });
  req.newBooks = newBooksCount; 
  next();
};
module.exports = {
  searchBook,
  addBooks,
};

