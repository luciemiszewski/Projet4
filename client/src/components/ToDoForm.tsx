import React, { useState, useEffect } from 'react';

function TodoForm({ onSubmit, editingTodo, onUpdate, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingTodo) {
        const success = await onUpdate(editingTodo.id, {
          title,
          description,
          completed: editingTodo.completed
        });
        
        if (success) {
          resetForm();
          onCancelEdit();
        }
      } else {
        const success = await onSubmit({ title, description });
        
        if (success) {
          resetForm();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <div className="todo-form-container">
      <h2>{editingTodo ? 'Modifier la tâche' : 'Ajouter une nouvelle tâche'}</h2>
      
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Que souhaitez-vous faire?"
            className={error ? 'error' : ''}
            disabled={isSubmitting}
          />
          {error && <div className="field-error">{error}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (optionnelle):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajouter des détails si nécessaire"
            disabled={isSubmitting}
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'En cours...' : (editingTodo ? 'Mettre à jour' : 'Ajouter')}
          </button>
          
          {editingTodo && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
