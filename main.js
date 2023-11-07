const inputBookTitle = document.getElementById("inputBookTitle");
const inputBookAuthor = document.getElementById("inputBookAuthor");
const inputBookYear = document.getElementById("inputBookYear");
const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const bookSubmit = document.getElementById("bookSubmit");
const searchBookTitle = document.getElementById("searchBookTitle");
const searchSubmit = document.getElementById("searchSubmit");
const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
const completeBookshelfList = document.getElementById("completeBookshelfList");

let books = [];

function addBook() {
  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const year = inputBookYear.value;
  const isComplete = inputBookIsComplete.checked;

  if (title && author && year) {
    const book = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };

    books.push(book);
    saveBooksToLocalStorage();
    renderBooks();
  }

  inputBookTitle.value = "";
  inputBookAuthor.value = "";
  inputBookYear.value = "";
  inputBookIsComplete.checked = false;
}

function saveBooksToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooksFromLocalStorage() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

function renderBooks() {
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const book of books) {
    const bookItem = createBookItem(book);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }
}

function createBookItem(book) {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  const title = document.createElement("h3");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.textContent = `Tahun: ${book.year}`;

  const action = document.createElement("div");
  action.classList.add("action");

  const moveButton = document.createElement("button");
  if (book.isComplete) {
    moveButton.textContent = "Belum selesai di Baca";
    moveButton.classList.add("green");
  } else {
    moveButton.textContent = "Selesai dibaca";
    moveButton.classList.add("green");
  }
  moveButton.addEventListener("click", () => toggleBookCompletion(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus buku";
  deleteButton.classList.add("red");
  deleteButton.addEventListener("click", () => promptDeleteBook(book.id));

  action.appendChild(moveButton);
  action.appendChild(deleteButton);

  bookItem.appendChild(title);
  bookItem.appendChild(author);
  bookItem.appendChild(year);
  bookItem.appendChild(action);

  return bookItem;
}

function toggleBookCompletion(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToLocalStorage();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooksToLocalStorage();
  renderBooks();
}

function promptDeleteBook(bookId) {
  const confirmation = confirm("Yakin untuk menghapus buku?");
  if (confirmation) {
    deleteBook(bookId);
  }
}

function searchBooks() {
  const searchTerm = searchBookTitle.value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookItem = createBookItem(book);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }
}

bookSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  addBook();
});

searchSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  searchBooks();
});

loadBooksFromLocalStorage();
renderBooks();
