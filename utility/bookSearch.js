const needle = require("needle");
const {
  OPEN_LIB_SEARCH,
  OPEN_LIB_EDITION,
  OPEN_LIB_COVERS,
  OPEN_LIB_WORKS,
} = require("../utility/constants");
const SearchByTitle = (text) => {
  return needle("get", `${OPEN_LIB_SEARCH}?title=${text}`);
};
const SearchByEdition = (edition) => {
  console.log(edition)
  return needle("get", `${OPEN_LIB_EDITION}/${edition}.json`);
};
const SearchByWork = (work) => {
  // console.log(work)
  return needle("get", `${OPEN_LIB_WORKS}/${work}.json`);
};
module.exports = {
  SearchByTitle,
  SearchByEdition,
  SearchByWork,
};
