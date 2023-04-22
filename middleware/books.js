const {
  SearchByWork,
  SearchByTitle,
} = require("../utility/bookSearch");

const searchBook = (req, res, next) => {
  var title = req.params.title;
  var docs;
  SearchByTitle(title)
    .then((pool) => {
      // res.json({ books: pool.body.docs });
      docs = pool.body.docs;
      return Promise.all(
        docs.slice(0, 10).map((doc, i) => {
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
          people: book.subject_people,
          description: book.description && book.description,
          links: book.links && book.links,
        });
      });
      req.books = newBooks;
      console.log("next");
      next();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  searchBook,
};
