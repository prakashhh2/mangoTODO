import { useState } from 'react'
import { TodoProvider } from "./contexts";
import './App.css'

function App() {
  const [todos, setTodos] = useState([
    { 
        id:1,
        todo : "Learn React",
        completed : false
    }
]);

  return (
    <TodoProvider>
    <div className="App">
      <div className="bg-gray-100 min-h-screen flex items-center justify-center"> 
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">You clicked {count} times</h1>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </header>
      </div>
    </div>
    </TodoProvider>
  )
}

export default App