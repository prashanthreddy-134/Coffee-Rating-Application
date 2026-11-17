# BeanVote — Coffee Rating Application (task3)

A full-stack coffee voting application built with **Python Flask**, **SQLite**, HTML, CSS and JavaScript.

## Features
- Displays six coffee options in a responsive card layout.
- Users can vote for any coffee with one click.
- Every vote is saved in a SQLite database.
- Vote counts update immediately and the list is ranked by votes.
- Atomic SQL increment (`votes = votes + 1`) prevents lost updates from concurrent votes.
- JSON API endpoints and a health-check endpoint.

## Requirements
- Python 3.9+
- pip

## Run on Windows PowerShell

```powershell
# 1. Open this project folder in PowerShell
cd path\to\Coffee-Rating-Application-task3

# 2. Create a virtual environment
py -m venv .venv

# 3. Activate it
.\.venv\Scripts\Activate.ps1

# 4. Install dependencies
python -m pip install -r requirements.txt

# 5. Start the application
python app.py
```

Open **http://127.0.0.1:5000** in your browser.

The SQLite database (`coffee_ratings.db`) is created automatically on first run. The coffee options are seeded automatically; existing vote counts are preserved when the app restarts.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/coffees` | Get all coffees and vote counts |
| POST | `/api/coffees/<id>/vote` | Add one vote to a coffee |
| GET | `/api/health` | Check server/database status |

### Example

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/coffees
Invoke-RestMethod -Method Post http://127.0.0.1:5000/api/coffees/1/vote
Invoke-RestMethod http://127.0.0.1:5000/api/health
```

## Project structure

```text
Coffee-Rating-Application-task3/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
│   └── index.html
└── static/
    ├── app.js
    └── style.css
```

## Internship task
**Task ID:** task3  
**Task:** Coffee Rating Application  
**Concepts:** POST requests, REST API, database updates, SQLite persistence, frontend/backend communication.
