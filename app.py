from flask import Flask, jsonify, render_template, request
import sqlite3
from pathlib import Path

app = Flask(__name__)
DB_PATH = Path(__file__).with_name("coffee_ratings.db")

COFFEES = [
    ("Espresso", "Bold, concentrated and beautifully simple.", "☕"),
    ("Cappuccino", "A smooth balance of espresso, steamed milk and foam.", "🥛"),
    ("Latte", "Creamy, mellow and perfect for a slow morning.", "🤎"),
    ("Americano", "Rich espresso softened with hot water.", "🖤"),
    ("Mocha", "Chocolate meets coffee in one comforting cup.", "🍫"),
    ("Cold Brew", "Slow-steeped, chilled and refreshingly smooth.", "🧊"),
]

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS coffees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT NOT NULL,
                emoji TEXT NOT NULL,
                votes INTEGER NOT NULL DEFAULT 0 CHECK(votes >= 0)
            )
        """)
        conn.executemany(
            "INSERT OR IGNORE INTO coffees (name, description, emoji) VALUES (?, ?, ?)",
            COFFEES
        )

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/api/coffees")
def list_coffees():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, name, description, emoji, votes FROM coffees ORDER BY votes DESC, id ASC"
        ).fetchall()
    return jsonify([dict(row) for row in rows])

@app.post("/api/coffees/<int:coffee_id>/vote")
def vote(coffee_id):
    # A single SQL UPDATE makes each vote atomic, even when requests arrive together.
    with get_db() as conn:
        cursor = conn.execute(
            "UPDATE coffees SET votes = votes + 1 WHERE id = ?", (coffee_id,)
        )
        if cursor.rowcount == 0:
            return jsonify({"error": "Coffee not found"}), 404
        row = conn.execute(
            "SELECT id, name, description, emoji, votes FROM coffees WHERE id = ?",
            (coffee_id,)
        ).fetchone()
    return jsonify(dict(row))

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "database": "connected"})

if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=True)
