import { useState } from 'react'
import { useTodo } from '../contexts'

function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editInput, setEditInput] = useState(todo.todo)
  const { updateTodo, deleteTodo, toggleCompleted } = useTodo()

  const handleUpdate = () => {
    if (!editInput.trim()) return
    updateTodo(todo.id, editInput.trim())
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleCompleted(todo.id)}
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
        onClick={() => deleteTodo(todo.id)}
        className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  )
}

export default TodoItem
