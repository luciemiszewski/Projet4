import TodoItem from './TodoItem';

function TodoList({ todos, onDelete, onEdit, onToggleComplete }) {
  if (todos.length === 0) {
    return (
      <div className="no-tasks">
        <p>Aucune tâche ne correspond à ce filtre</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TodoList;
