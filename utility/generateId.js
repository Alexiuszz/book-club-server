function generateId(book, sN) {
  let key1 = sN.toString().padStart(5, "0");
  let key2 = book.OL_id.slice(-3);
  return `BC${key1}OL${key2}`;
}
exports.generateId = generateId;
