const {
  searchAuthors,
  getAuthor,
} = require("../utility/authorSearch");
const { pool } = require("../utility/db");

const searchAuthor = (req, res, next) => {
  const author = req.params.name;
  //   let authorData = {},
  var docs;
  searchAuthors(author)
    .then((pool) => {
      //     res.json({ authors: pool.body.docs });
      docs = pool.body.docs;
      return Promise.all(
        docs.slice(0, 5).map((doc) => {
          var key = doc.key;
          console.log(key);
          return getAuthor(key);
        })
      );
    })
    .then((authorsRes) => {
      var authors = authorsRes.map((authorRes) => authorRes.body);
      //       res.json({ authors: authors });

      let newAuthors = [];
      authors.forEach((author, i) => {
        newAuthors.push({
          name: docs[i].name,
          OL_id: docs[i].key,
          birth_day: docs[i].birth_date,
          top_work: docs[i].top_work,
          work_count: docs[i].work_count,
          bio: author.bio,
          photos: author.photos,
          links: [author.links].concat({
            wikipedia: author.wikipedia && author.wikipedia,
          }).flat(),
        });
      });

      req.authors = newAuthors;
      next();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  searchAuthor,
};
