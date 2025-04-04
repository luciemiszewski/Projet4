import { useState } from "react";

interface TodoItemProps {
  todo: {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
  };
  onDelete: (id: number) => Promise<boolean>;
  onEdit: (todo: {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
  }) => void;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
}

function TodoItem({ todo, onDelete, onEdit, onToggleComplete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche?")) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <div className="todo-checkbox">
          <input
            type="checkbox"
            checked={todo.completed || false}
            onChange={() => onToggleComplete(todo.id, todo.completed)}
            id={`todo-${todo.id}`}
          />
          <label htmlFor={`todo-${todo.id}`} className="checkbox-label"></label>
        </div>

        <div className="todo-text">
          <h3>{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="btn btn-edit"
          onClick={() => onEdit(todo)}
          aria-label="Modifier"
          title="Modifier cette tâche"
        >
          Modifier
        </button>

        <button
          className="btn btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Supprimer"
          title="Supprimer cette tâche"
        >
          {isDeleting ? "..." : "Supprimer"}
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
