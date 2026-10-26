# Event Registration Admin Panel

## About the Project

The Event Registration Admin Panel is a web application developed to make event management easier. It provides a dashboard where an administrator can view event details and manage the available events from one place.

The application uses React for the user interface, Express and Node.js for handling server requests, and MongoDB Atlas to store event information.

## What Can This Application Do?

- Display events in a dashboard with their ID, name, date, venue, and registration count.
- Add a new event by entering its name, description, date, and venue.
- Modify the details of an existing event.
- Delete an event that is no longer required.
- Search for events from the dashboard.
- Show event information retrieved from the database.
- Navigate between the dashboard and event forms using React Router.

## Tools and Technologies

| Technology | Purpose in this project |
|---|---|
| React.js | Builds the pages and interactive interface |
| CSS | Styles the dashboard and forms |
| React Router DOM | Handles navigation between pages |
| Node.js | Runs the backend application |
| Express.js | Provides the API endpoints |
| Mongoose | Connects the backend with MongoDB |
| MongoDB Atlas | Stores the event records |
| Vite | Runs the frontend development server |

## Folder Organisation

```text
EventRegistration/
├── public/
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## Running the Application

### Requirements

Make sure Node.js and npm are installed and that you have access to a MongoDB Atlas database.

### 1. Download the project

Clone this repository and enter its folder:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd EventRegistration
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the URL of your GitHub repository.

### 2. Install frontend packages

Run this command from the main project folder:

```bash
npm install
```

### 3. Install backend packages

```bash
cd server
npm install
```

### 4. Set up the database connection

Create a `.env` file inside the `server` folder. Use `.env.example` as a reference and enter your own MongoDB Atlas connection string.

The file should contain:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Use your actual connection string locally. Never upload the real `.env` file or database credentials to GitHub.

### 5. Run the backend

While inside the `server` folder, execute:

```bash
npm run dev
```

The backend should start on port `5000`.

### 6. Run the frontend

Open another terminal in the main project folder and execute:

```bash
npm run dev
```

Open the local address displayed by Vite, usually `http://localhost:5173`.

Keep both terminal sessions running while using the application.

## Backend API

The backend provides the following endpoints for managing event records.

| HTTP method | Endpoint | Operation |
|---|---|---|
| GET | `/api/events` | Fetch all events |
| POST | `/api/events` | Save a new event |
| PUT | `/api/events/:id` | Change an existing event |
| DELETE | `/api/events/:id` | Remove an event |

## Data Storage

Event records are stored in MongoDB Atlas. Each event includes its name, description, date, venue, and number of registrations. The backend uses Mongoose to work with these records.

## Project Purpose

This project demonstrates how a React frontend can communicate with a Node.js and Express backend to perform database operations. It brings common event-management tasks together in a single administrative interface.

## Author

Developed as part of an academic full-stack web development assignment.
