const needle = require("needle");
const {
  OPEN_LIB_AUTHORS,
  OPEN_LIB_AUTHOR,
} = require("../../utility/constants");

const searchAuthors = (author) =>
  needle("get", `${OPEN_LIB_AUTHORS}${author}`);
const getAuthor = (authorID) =>
  needle("get", `${OPEN_LIB_AUTHOR}${authorID}.json`);
const getWorks = (authorID) =>
  needle("get", `${OPEN_LIB_AUTHOR}${authorID}/works.json?limit=10`);

module.exports = {
  searchAuthors,
  getAuthor,
  getWorks,
};
