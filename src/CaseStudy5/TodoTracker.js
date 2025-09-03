import React, { useState, useEffect } from 'react';
import './TodoTracker.css';

const TodoTracker = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos from API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        
        const data = await response.json();
        // Get only first 20 todos as specified in the case study
        const first20Todos = data.slice(0, 20);
        setTodos(first20Todos);
        setFilteredTodos(first20Todos);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch todos. Please try again.');
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Filter todos based on selected filter
  useEffect(() => {
    if (filter === 'completed') {
      setFilteredTodos(todos.filter(todo => todo.completed));
    } else if (filter === 'pending') {
      setFilteredTodos(todos.filter(todo => !todo.completed));
    } else {
      setFilteredTodos(todos);
    }
  }, [filter, todos]);

  // Calculate statistics
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Add a new todo
  const addTodo = (title) => {
    const newTodo = {
      id: todos.length + 1,
      title,
      completed: false,
      userId: 1
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.elements.todoTitle.value.trim();
    if (title) {
      addTodo(title);
      e.target.elements.todoTitle.value = '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>Todo Tracker</h1>
        <p>Stay organized and boost your productivity</p>
      </header>

      <div className="todo-stats">
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-info">
            <span className="stat-number">{todos.length}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <div className="stat-info">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="todo-actions">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button 
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-todo-form">
          <input
            type="text"
            name="todoTitle"
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-btn">
            Add Task
          </button>
        </form>
      </div>

      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No tasks found</h3>
            <p>
              {filter === 'completed' 
                ? "You haven't completed any tasks yet." 
                : filter === 'pending'
                ? "You don't have any pending tasks. Great job!"
                : "Your task list is empty. Add a new task to get started!"
              }
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item">
              <label className="todo-checkbox">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="checkmark"></span>
              </label>
              
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.title}
              </span>
              
              <span className={`todo-status ${todo.completed ? 'completed' : 'pending'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="todo-footer">
        <p>
          {filter === 'all' && `Showing all ${todos.length} tasks`}
          {filter === 'completed' && `Showing ${completedCount} completed tasks`}
          {filter === 'pending' && `Showing ${pendingCount} pending tasks`}
        </p>
      </div>
    </div>
  );
};

export default TodoTracker;