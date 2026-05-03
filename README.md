# Todo App — Full Stack Learning Project

A simple Todo app built to learn full stack development with React, Express, and MongoDB.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Build Tool | Vite |

---

## Concepts Learned

### React
- **useState** — managing local component state (todos, form inputs, edit mode)
- **useEffect** — fetching todos from the server when the app loads
- **Context API** — sharing `todos`, `addTodo`, `deleteTodo`, `toggleCompleted` across components without prop drilling
- **Props** — passing individual `todo` object down to `TodoItem`
- **Controlled inputs** — form inputs driven by React state

### Express
- **Routing** — `GET`, `POST`, `PUT`, `DELETE` routes under `/api/todos`
- **Middleware** — `express.json()` to parse request body, `cors()` to allow React to call the API
- **`req.body`** — reading data sent from the frontend
- **`res.json()`** — sending JSON back to the frontend

### MongoDB + Mongoose
- **Schema** — defining the shape of a todo (`todo`, `description`, `completed`, `timestamps`)
- **Model** — `Todo.find()`, `Todo.create()`, `Todo.findByIdAndUpdate()`, `Todo.findByIdAndDelete()`
- **`_id`** — MongoDB auto-generates a unique ID for every document
- **Atlas** — cloud-hosted MongoDB, connected via connection string in `.env`

### Full Stack Concepts
- **REST API** — frontend and backend communicate over HTTP using JSON
- **Environment variables** — storing secrets like `MONGO_URI` in `.env`, never in code
- **CORS** — allowing the React dev server (`localhost:5173`) to call the Express server (`localhost:3000`)
- **Data persistence** — todos survive page refresh because they are stored in MongoDB, not just in React state

---

## Data Flow

```
User types todo
     ↓
React (useState + Context)
     ↓  fetch POST /api/todos
Express (routes/todos.js)
     ↓  Todo.create()
MongoDB Atlas
     ↓  returns saved todo with _id
React updates UI
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update title, description, or completed |
| DELETE | `/api/todos/:id` | Delete a todo |

---

## Project Structure

```
propLearn/
├── src/
│   ├── App.jsx          # React app — state, context, UI
│   ├── contexts/        # TodoContext and useTodo hook
│   └── index.css        # Tailwind CSS
├── server/
│   ├── index.js         # Express entry point, MongoDB connection
│   ├── models/Todo.js   # Mongoose schema and model
│   ├── routes/todos.js  # CRUD API routes
│   └── .env             # MONGO_URI and PORT (never commit this)
└── index.html
```

---

## Running the App

**Terminal 1 — Backend:**
```bash
cd server && npm install && npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm install && npm run dev
```

Then open `http://localhost:5173`
