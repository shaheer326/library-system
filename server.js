import mysql from "mysql2";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err);
        return;
    }

    console.log("MySQL connected!");
});

app.get("/api/books", (req, res) => {

    db.query(
        "SELECT * FROM books ORDER BY call_number ASC",
        (err, results) => {

            if (err) {
                console.log(err);
                res.status(500).json({
                    error: "Database error"
                });
                return;
            }

            res.json(results);
        }
    );

});

app.post("/api/books", (req, res) => {

    const {
        title,
        call_number,
        category,
        shelf,
        total_copies,
        available_copies
    } = req.body;

    const sql = `
        INSERT INTO books
        (title, call_number, category, shelf, total_copies, available_copies)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            call_number,
            category,
            shelf,
            total_copies,
            available_copies
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                res.status(500).json({
                    error: "Could not add book"
                });

                return;
            }

            res.json({
                message: "Book added successfully",
                id: result.insertId
            });

        }
    );

});

app.put("/api/books/:id", (req, res) => {

    const id = req.params.id;

    const {
        title,
        call_number,
        category,
        shelf,
        total_copies,
        available_copies
    } = req.body;

    const sql = `
        UPDATE books
        SET
            title = ?,
            call_number = ?,
            category = ?,
            shelf = ?,
            total_copies = ?,
            available_copies = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            title,
            call_number,
            category,
            shelf,
            total_copies,
            available_copies,
            id
        ],
        (err) => {

            if (err) {
                console.log(err);

                res.status(500).json({
                    error: "Could not update book"
                });

                return;
            }

            res.json({
                message: "Book updated successfully"
            });

        }
    );

});

app.put("/api/books/:id/available", async (req, res) => {
    let available = req.body.available_copies;
    const sql = `
    UPDATE books
    SET available_copies = ?
    WHERE id = ?
`;
    db.query(sql, [available, req.params.id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
        res.json({ message: "Available copies updated" });
    });
});

app.delete("/api/books/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM books WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.log(err);

                res.status(500).json({
                    error: "Could not delete book"
                });

                return;
            }

            res.json({
                message: "Book deleted successfully"
            });

        }
    );

});


app.put("/api/books/:id/borrow", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE books
        SET available_copies = available_copies - 1
        WHERE id = ?
        AND available_copies > 0
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            res.status(500).json({
                error: "Could not borrow book"
            });

            return;
        }

        if (result.affectedRows === 0) {

            res.status(400).json({
                error: "Book is not available"
            });

            return;
        }

        res.json({
            message: "Book borrowed successfully"
        });

    });

});

app.put("/api/books/:id/return", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE books
        SET available_copies = available_copies + 1
        WHERE id = ?
        AND available_copies < total_copies
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);

            res.status(500).json({
                error: "Could not return book"
            });

            return;
        }

        if (result.affectedRows === 0) {

            res.status(400).json({
                error: "All copies are already available"
            });

            return;
        }

        res.json({
            message: "Book returned successfully"
        });

    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});