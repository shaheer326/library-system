console.log("NEW APP.JS LOADED");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyClEatbNjcmYC-ejxpjFIwmk1Ix3TX_oOU",
    authDomain: "school-library-4b6ed.firebaseapp.com",
    projectId: "school-library-4b6ed",
    storageBucket: "school-library-4b6ed.firebasestorage.app",
    messagingSenderId: "72188981445",
    appId: "1:72188981445:web:7ff83a2501e22a920fc0ac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_URL = "https://library-system-production-ca66.up.railway.app";

const book = document.getElementById("book-title");
const ddc = document.getElementById("ddc-number");
const shelf = document.getElementById("book-shelf");
const totalCopies = document.getElementById("total-copies");
const availableCopies = document.getElementById("available-copies");
const form = document.getElementById("add-book-form");
const bookTable = document.getElementById("book-table");
const recentbooks = document.getElementById("recent-books");

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let bookvalue = book.value;
        let ddcvalue = ddc.value;
        let shelfvalue = shelf.value;
        let totalvalue = totalCopies.value;
        let availablevalue = availableCopies.value;

        console.log(bookvalue);
        console.log(ddcvalue);

        let category = "";

        if (ddcvalue >= 0 && ddcvalue <= 99) {
            category = "General Works";
        }

        if (ddcvalue >= 100 && ddcvalue <= 199) {
            category = "Philosophy and Psychology";
        }

        if (ddcvalue >= 200 && ddcvalue <= 299) {
            category = "Religion";
        }

        if (ddcvalue >= 300 && ddcvalue <= 399) {
            category = "Social Sciences";
        }

        if (ddcvalue >= 400 && ddcvalue <= 499) {
            category = "Language";
        }

        if (ddcvalue >= 500 && ddcvalue <= 599) {
            category = "Science";
        }

        if (ddcvalue >= 600 && ddcvalue <= 699) {
            category = "Technology";
        }

        if (ddcvalue >= 700 && ddcvalue <= 799) {
            category = "Arts and Recreation";
        }

        if (ddcvalue >= 800 && ddcvalue <= 899) {
            category = "Literature";
        }

        if (ddcvalue >= 900 && ddcvalue <= 999) {
            category = "History & Geography";
        }

        console.log(category);

        await fetch(API_URL + "/api/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: bookvalue,
                call_number: ddcvalue,
                shelf: shelfvalue,
                total_copies: totalvalue,
                available_copies: availablevalue
            })
        });

        form.reset();
    });
}

console.log("Reached auth section");

const response = await fetch(API_URL + "/api/books");
const books = await response.json();
books.sort((a, b) => {
    const numA = parseFloat(a.call_number);
    const numB = parseFloat(b.call_number);

    return numA - numB;
});

const totalbooks = document.getElementById("total-books");

console.log("Number of books:", books.length);

if (totalbooks) {
    totalbooks.textContent = books.length;
}

function displayBooks(booksToDisplay) {

    bookTable.querySelectorAll("tr:not(:first-child)").forEach((row) => {
        row.remove();
    });

    booksToDisplay.forEach((data) => {

        console.log("Displaying:", data);

        let row = document.createElement("tr");

        let bookcell = document.createElement("td");
        bookcell.textContent = data.title;

        let ddccell = document.createElement("td");
        ddccell.textContent = data.call_number;

        let categorycell = document.createElement("td");
        categorycell.textContent = data.category;

        let shelfcell = document.createElement("td");
        shelfcell.textContent = data.shelf;

        let totalcell = document.createElement("td");
        totalcell.textContent = data.total_copies;

        let availablecell = document.createElement("td");
        availablecell.textContent = data.available_copies;

        let actioncell = document.createElement("td");

        if (isAdmin) {

            let deletebutton = document.createElement("button");
            deletebutton.innerHTML = "Delete";

            deletebutton.addEventListener("click", async function () {
                await fetch(API_URL + "/api/books/" + data.id, {
                    method: "DELETE"
                });

                row.remove();
            });

            let editbutton = document.createElement("button");
            editbutton.innerHTML = "Edit";

            editbutton.addEventListener("click", async function () {

                let newTitle = prompt("Enter new title:", data.title);
                let newCallNumber = prompt("Enter new call number:", data.call_number);
                let newCategory = prompt("Enter new category:", data.category);
                let newShelf = prompt("Enter new shelf:", data.shelf);
                let newTotal = prompt("Enter total copies:", data.total_copies);
                let newAvailable = prompt("Enter available copies:", data.available_copies);

                await fetch(
                    API_URL + "/api/books/" + data.id,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: newTitle,
                            call_number: newCallNumber,
                            category: newCategory,
                            shelf: newShelf,
                            total_copies: newTotal,
                            available_copies: newAvailable
                        })
                    }
                );

                data.title = newTitle;
                data.category = newCategory;
                data.call_number = newCallNumber;
                data.shelf = newShelf;
                data.total_copies = newTotal;
                data.available_copies = newAvailable;

                displayBooks(books);
            });

            let copiesbutton = document.createElement("button");
            copiesbutton.textContent = "Update Copies";

            copiesbutton.addEventListener("click", async function () {

                let newAvailable = prompt(
                    "Enter available copies:",
                    data.available_copies
                );

                await fetch(
                    API_URL + "/api/books/" + data.id + "/available",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            available_copies: newAvailable
                        })
                    }
                );

                data.available_copies = newAvailable;
                displayBooks(books);
            });

            actioncell.appendChild(copiesbutton);
            actioncell.appendChild(editbutton);
            actioncell.appendChild(deletebutton);
        }

        row.appendChild(bookcell);
        row.appendChild(ddccell);
        row.appendChild(categorycell);
        row.appendChild(shelfcell);
        row.appendChild(totalcell);
        row.appendChild(availablecell);
        row.appendChild(actioncell);
        bookTable.appendChild(row);
    });
}

if (bookTable) {

    console.log("Book table found:", bookTable);

    const input = document.getElementById("search-input");
    const button = document.getElementById("search-button");

    button.addEventListener("click", (event) => {

        let inputvalue = input.value.toLowerCase();

        const filteredBooks = books.filter((book) => {
            return book.title.toLowerCase().includes(inputvalue) ||
                book.call_number.toLowerCase().includes(inputvalue) ||
                book.category.toLowerCase().includes(inputvalue);
        });

        displayBooks(filteredBooks);
    });
}

console.log("About to start auth listener");

let isAdmin = false;

onAuthStateChanged(auth, async (user) => {

    if (user) {
        const token = await user.getIdTokenResult();
        isAdmin = token.claims.admin === true;
        console.log("Admin:", isAdmin);
    }

    const addBookLink = document.getElementById("add-book-link");

    if (addBookLink && isAdmin) {
        addBookLink.style.display = "block";
    }

    if (bookTable) {
        displayBooks(books);
    }
});

console.log("Auth listener registered");

if (recentbooks) {
    books.slice(0, 5).forEach((data) => {

        let recentrow = document.createElement("tr");

        let recenttitle = document.createElement("td");
        recenttitle.textContent = data.title;

        let recentddc = document.createElement("td");
        recentddc.textContent = data.call_number;

        let recentcategory = document.createElement("td");
        recentcategory.textContent = data.category;

        recentrow.appendChild(recenttitle);
        recentrow.appendChild(recentddc);
        recentrow.appendChild(recentcategory);

        recentbooks.appendChild(recentrow);
    });
}