const {
  searchAuthors,
  getAuthor,
} = require("../pg/open-lib-queries/authorSearch");
const { generateId } = require("../utility/generateId");
const db = require("../db");

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
          birth_date: docs[i].birth_date,
          top_work: docs[i].top_work,
          work_count: docs[i].work_count,
          bio: author.bio,
          photos: author.photos,
          links: [author.links]
            .concat({
              wikipedia: author.wikipedia && author.wikipedia,
            })
            .flat(),
        });
      });

      req.authors = newAuthors;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

const addAuthors = (req, res, next) => {
  let authors = req.authors;
  let newAuthors = [];
  next();
  authors.forEach((author) => {
    db.query(
      "SELECT * FROM authors WHERE OL_id = $1",
      [author.OL_id],
      (error, results) => {
        if (error) throw error;
        if (!(results.rows.length > 0)) {
          db.query(
            "SELECT count(BC_id) as length FROM authors",
            (error, results) => {
              let BC_id = generateId(author, results.rows[0].length);
              let birth_date =
                author.birth_date &&
                new Date(author.birth_date.toString());
              db.query(
                "INSERT INTO authors (OL_id,BC_id,name,works_count,bio,photo,top_work,birth_date,links ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING BC_id",
                [
                  author.OL_id,
                  BC_id,
                  author.name,
                  author.work_count,
                  author.bio,
                  author.photos,
                  author.top_work,
                  birth_date,
                  author.links,
                ],
                (err, results) => {
                  if (err) throw next(err);
                  newAuthors.push(results.rows[0].BC_id);
                }
              );
            }
          );
        }
      }
    );
  });
  console.log(newAuthors.length);
  req.newAuthors = newAuthors.length;
};

module.exports = {
  searchAuthor,
  addAuthors,
};
