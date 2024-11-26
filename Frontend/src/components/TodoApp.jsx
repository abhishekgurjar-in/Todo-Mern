import  { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch all todos on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  // Handle adding new todo
  const addTodo = () => {
    if (newTodo.trim()) {
      axios.post('http://localhost:5000/todos', { text: newTodo })
        .then(response => {
          setTodos([...todos, response.data]);
          setNewTodo("");
        })
        .catch(error => console.error(error));
    }
  };

  // Handle deleting a todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(error => console.error(error));
  };

  // Handle updating a todo's completed status
  const toggleTodoCompletion = (id, completed) => {
    axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed })
      .then(response => {
        setTodos(todos.map(todo => 
          todo._id === id ? response.data : todo
        ));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-4">Todo App</h1>
      
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo._id} className="flex items-center justify-between">
            <span
              className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
              onClick={() => toggleTodoCompletion(todo._id, todo.completed)}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
