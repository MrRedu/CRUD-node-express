import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

// Leer el archivo db.json
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

// Escribir en el archivo db.json
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

app.get("/", (req, res) => {
  res.send("HomePage");
});

// Mostrar todos los libros, en el endpoint /books
app.get("/books", (req, res) => {
  const data = readData();
  const { books } = data;
  res.json(books);
});

// Mostrar un libro por su id, en el endpoint /books/:id
app.get("/books/:id", (req, res) => {
  const data = readData();
  const { books } = data;

  const id = parseInt(req.params.id);
  const book = books.find((book) => book.id === id);
  res.json(book);
});

// Crear un nuevo libro, en el endpoint /books
app.post("/books", (req, res) => {
  const data = readData();
  const { books } = data;
  const body = req.body;

  const newBook = {
    id: data.books.length + 1,
    ...body,
  };
  books.push(newBook);
  writeData(data);
  res.json(newBook);
});

// Actualizar un libro, en el endpoint /books/:id
app.put("/books/:id", (req, res) => {
  const data = readData();
  const { books } = data;
  const body = req.body;
  const id = parseInt(req.params.id);

  const bookIndex = books.findIndex((book) => book.id === id);

  books[bookIndex] = {
    ...books[bookIndex],
    ...body,
  };

  writeData(data);
  res.json({ message: "Book updated successfully" });
});

// Eliminar un libro
app.delete("/books/:id", (req, res) => {
  const data = readData();
  const { books } = data;
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === id);

  books.splice(bookIndex, 1);

  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

app.listen(PORT, () => {
  console.log("🌐 Listening on port 3000");
});
