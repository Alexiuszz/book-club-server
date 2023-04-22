const express = require("express");
const app = express();
const db = require("./queries");
const port = 3000;
const auth = require("../auth/jwt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ app: "app" });
});


app.post("/auth/generateToken", auth.generateToken);
app.get("/auth/validateToken", auth.validateToken);

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


