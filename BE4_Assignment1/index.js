const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");

const Book = require("./models/book.models");

app.use(express.json());

initializeDatabase();

// 1.
// Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. Add the following book:

// {
//   "title": "Lean In",
//   "author": "Sheryl Sandberg",
//   "publishedYear": 2012,
//   "genre": ["Non-Fiction", "Business"],
//   "language": "English",
//   "country": "United States",
//   "rating": 4.1,
//   "summary": "A book about empowering women in the workplace and achieving leadership roles.",
//   "coverImageUrl": "https://example.com/lean_in.jpg"
// };

async function createBook(newBook) {
  try {
    const book = new Book(newBook);

    const saveBook = await book.save();

    return saveBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);

    res
      .status(201)
      .json({ message: "Book added successfully.", book: savedBook });
  } catch (error) {
    // console.log(error);
    // did the above "console.log()" to find the error we had in our code
    res.status(500).json({ error: "Failed to add book." });
  }
});

// 2.
// Run your API and create another book data in the db.

// {
//   "title": "Shoe Dog",
//   "author": "Phil Knight",
//   "publishedYear": 2016,
//   "genre": ["Autobiography", "Business"],
//   "language": "English",
//   "country": "United States",
//   "rating": 4.5,
//   "summary": "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
//   "coverImageUrl": "https://example.com/shoe_dog.jpg"
// };

// 3.
// Create an API to get all the books in the database as response. Make sure to do error handling

async function readAllBooks() {
  try {
    const allBooks = await Book.find();

    return allBooks;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();

    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 4.
// Create an API to get a book's detail by its title. Make sure to do error handling

async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });

    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/:title", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.title);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

// 5.
// Create an API to get details of all the books by an author. Make sure to do error handling

async function readBooksByAuthor(authorName) {
  try {
    const booksByGenre = await Book.find({ author: authorName });

    return booksByGenre;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await readBooksByAuthor(req.params.authorName);

    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 6.
// Create an API to get all the books which are of "Business" genre

async function readBooksByGenre(genreName) {
  try {
    const booksByGenre = await Book.find({ genre: genreName });

    return booksByGenre;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const books = await readBooksByGenre(req.params.genreName);

    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 7.
// Create an API to get all the books which was released in the year 2012

async function readBooksByYear(releaseYear) {
  try {
    const booksByYear = await Book.find({ publishedYear: releaseYear });

    return booksByYear;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/year/:releaseYear", async (req, res) => {
  try {
    const books = await readBooksByYear(req.params.releaseYear);

    if (books.length != 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 8.
// Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book rating: { "rating": 4.5 }

async function updateBookById(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });

    return updatedBook;
  } catch (error) {
    console.log("Error in updating Book data", error);
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);

    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// 9.
// Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }

async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      { new: true }
    );

    return updatedBook;
  } catch (error) {
    console.log("Error in updating Book data", error);
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);

    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// 10.
// Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling

async function deleteBook(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    return deletedBook;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);

    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
