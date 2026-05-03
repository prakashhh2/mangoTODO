import { useState, useEffect } from 'react'
import { TodoProvider, useTodo } from './contexts'

const API = 'http://localhost:3000/api/todos'

function TodoForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { addTodo } = useTodo()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addTodo(title.trim(), description.trim())
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title..."
        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        rows={2}
        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Todo
      </button>
    </form>
  )
}

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.todo)
  const [editDesc, setEditDesc] = useState(todo.description)
  const { updateTodo, deleteTodo, toggleCompleted } = useTodo()

  const handleUpdate = () => {
    if (!editTitle.trim()) return
    updateTodo(todo._id, editTitle.trim(), editDesc.trim())
    setIsEditing(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleCompleted(todo._id, todo.completed)}
          className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
        />
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
          ) : (
            <div>
              <p className={`font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.todo}
              </p>
              {todo.description && (
                <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                  {todo.description}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              disabled={todo.completed}
              className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors disabled:opacity-40"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => deleteTodo(todo._id)}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTodos(data))
      .finally(() => setLoading(false))
  }, [])

  const addTodo = async (todo, description) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo, description })
    })
    const newTodo = await res.json()
    setTodos([newTodo, ...todos])
  }

  const updateTodo = async (id, newTitle, newDesc) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: newTitle, description: newDesc })
    })
    const updated = await res.json()
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(t => t._id !== id))
  }

  const toggleCompleted = async (id, currentStatus) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    })
    const updated = await res.json()
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleCompleted }}>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Todos</h1>
          <TodoForm />
          {loading ? (
            <p className="text-center text-gray-400 mt-8">Loading...</p>
          ) : todos.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">No todos yet. Add one above!</p>
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {todos.map(todo => (
                <li key={todo._id}>
                  <TodoItem todo={todo} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </TodoProvider>
  )
}

export default App
