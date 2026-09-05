import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyClEatbNjcmYC-ejxpjFIwmk1Ix3TX_oOU",
    authDomain: "school-library-4b6ed.firebaseapp.com",
    projectId: "school-library-4b6ed",
    storageBucket: "school-library-4b6ed.firebasestorage.app",
    messagingSenderId: "72188981445",
    appId: "1:72188981445:web:7ff83a2501e22a920fc0ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const book = document.getElementById("book-title");
const ddc = document.getElementById("ddc-number");
const form = document.getElementById("add-book-form");
const bookTable = document.getElementById("book-table");

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let bookvalue = book.value;
        let ddcvalue = ddc.value;

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

        await addDoc(collection(db, "books"), {
            title: bookvalue,
            ddc: ddcvalue,
            category: category
        });
    });
}

const bookQuery = query(collection(db, "books"), orderBy("ddc"))

const booksSnapshot = await getDocs(bookQuery);

console.log("Number of books:", booksSnapshot.size);

const books = [];

if (bookTable) {

    function displayBooks(booksToDisplay) {

        bookTable.querySelectorAll("tr:not(:first-child)").forEach((row) => {
            row.remove();
        });

        booksToDisplay.forEach((data) => {

            let row = document.createElement("tr")

            let bookcell = document.createElement("td")
            bookcell.textContent = data.title;

            let ddccell = document.createElement("td")
            ddccell.textContent = data.ddc;

            let categorycell = document.createElement("td")
            categorycell.textContent = data.category;

            let actioncell = document.createElement("td")

            let deletebutton = document.createElement("button");
            deletebutton.innerHTML = "Delete";
            deletebutton.addEventListener("click", async function () {
                await deleteDoc(doc(db, "books", data.id));
                row.remove()
            });

            row.appendChild(bookcell);
            row.appendChild(ddccell);
            row.appendChild(categorycell);
            row.appendChild(actioncell);
            actioncell.appendChild(deletebutton);
            bookTable.appendChild(row);
        });

    }

    booksSnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
    });

    displayBooks(books);

    const input = document.getElementById("search-input")
    const button = document.getElementById("search-button")

    button.addEventListener("click", (event) => {
        let inputvalue = input.value.toLowerCase()
        const filteredBooks = books.filter((book) => {
            return book.title.toLowerCase().includes(inputvalue) ||
                book.ddc.toLowerCase().includes(inputvalue) ||
                book.category.toLowerCase().includes(inputvalue)
        })
        displayBooks(filteredBooks);
    })

}