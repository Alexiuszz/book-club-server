function generateId(book, sN) {
  let key1 = sN.toString().padStart(7, "0");
  let key2 = book.OL_id.slice(-4);
  return `BC${key1}OL${key2}`;
}
exports.generateId = generateId;
