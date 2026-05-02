import { useState, useEffect } from 'react'
import { TodoProvider, useTodo } from './contexts'

const API = 'http://localhost:3000/api/todos'

function TodoForm() {
  const [input, setInput] = useState('')
  const { addTodo } = useTodo()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    addTodo(input.trim())
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a todo..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  )
}

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editInput, setEditInput] = useState(todo.todo)
  const { updateTodo, deleteTodo, toggleCompleted } = useTodo()

  const handleUpdate = () => {
    if (!editInput.trim()) return
    updateTodo(todo._id, editInput.trim())
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo._id, todo.completed)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      {isEditing ? (
        <input
          type="text"
          value={editInput}
          onChange={(e) => setEditInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400"
          autoFocus
        />
      ) : (
        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {todo.todo}
        </span>
      )}
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

  const addTodo = async (todo) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo })
    })
    const newTodo = await res.json()
    setTodos([newTodo, ...todos])
  }

  const updateTodo = async (id, newText) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: newText })
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
