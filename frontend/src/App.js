import React, { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoEditModal from './components/TodoEditModal';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8080';

  // Fetch all todos
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      console.log("Fetched todos:", data); // Debugging
      setTodos(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err.message);
      setTodos([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single todo
  const fetchTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todo');
      }
      const data = await response.json();
      setSelectedTodo(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add todo
  const addTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update todo
  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updated = await response.json();
      setTodos(todos.map(todo => {
        const currentId = todo.id || todo.ID;
        return currentId === parseInt(id) ? updated : todo;
      }));
      setIsModalOpen(false);
      setSelectedTodo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      // Handle both lowercase and uppercase ID
      setTodos(todos.filter(todo => {
        const todoId = todo.id || todo.ID;
        return todoId !== parseInt(id);
      }));
      if (selectedTodo) {
        const selectedId = selectedTodo.id || selectedTodo.ID;
        if (selectedId === parseInt(id)) {
          setSelectedTodo(null);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSelectTodo = (id) => {
    fetchTodo(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="app-content">
        <div className="todo-list-container">
          <h2>Add New Todo</h2>
          <TodoForm onSubmit={addTodo} />
          
          <h2>Todo List</h2>
          {isLoading ? (
            <p className="loading">Loading todos...</p>
          ) : (
            <TodoList 
              todos={todos} 
              onSelect={handleSelectTodo}
              onDelete={deleteTodo}
            />
          )}
        </div>
      </div>

      {/* Modal for editing */}
      {isModalOpen && selectedTodo && (
        <TodoEditModal
          todo={selectedTodo}
          onUpdate={updateTodo}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;