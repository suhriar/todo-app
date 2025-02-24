import React, { useState } from 'react';

function TodoList({ todos, onSelect, onDelete }) {
  // State untuk melacak ID todo yang detailnya sedang dilihat
  const [expandedId, setExpandedId] = useState(null);
  
  // Memastikan todos selalu berupa array
  const todoArray = todos || [];
  
  // Fungsi untuk memotong teks deskripsi
  const truncateDescription = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };
  
  // Toggle detail todo
  const toggleDetails = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };
  
  if (todoArray.length === 0) {
    return <p>No todos found. Add some!</p>;
  }

  return (
    <ul className="todo-list">
      {todoArray.map((todo) => {
        const todoId = todo.id || todo.ID;
        const isExpanded = expandedId === todoId;
        
        return (
          <li key={todoId} className="todo-item">
            <div className="todo-content">
              <div className="todo-title">{todo.title}</div>
              <div className="todo-description">
                {isExpanded ? todo.description : truncateDescription(todo.description)}
                {todo.description && todo.description.length > 60 && (
                  <button 
                    onClick={() => toggleDetails(todoId)} 
                    className="btn btn-text"
                  >
                    {isExpanded ? 'Sembunyikan' : 'Lihat Detail'}
                  </button>
                )}
              </div>
            </div>
            <div className="todo-actions">
              <button 
                onClick={() => onSelect(todoId)} 
                className="btn btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(todoId)} 
                className="btn btn-delete"
              >
                Hapus
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TodoList;