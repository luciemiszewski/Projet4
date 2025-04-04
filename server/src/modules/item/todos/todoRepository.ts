import client from "../../../../database/client"
import type { Result, Rows } from "../../../../database/client";
import { ResultSetHeader } from "mysql2/promise";

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: Date;
};

class TodoRepository {
  // Create
  async create(todo: Omit<Todo, "id" | "created_at" | "completed">) {
    const [result] = await client.query<Result>(
      "INSERT INTO todos (title, description) VALUES (?, ?)",
      [todo.title, todo.description]
    );
    return result.insertId;
  }

  // Read
  async findAll() {
    const [rows] = await client.query("SELECT * FROM todos ORDER BY created_at DESC");
    return rows;
  }

  // Read
  async findById(id: number): Promise<Todo | null> {
    const [rows] = await client.query<Rows>(
      "SELECT * FROM todos WHERE id = ?",
      [id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Todo;
    }

    return null;
  }

  // Update
  async update(id: number, todo: { title?: string; description?: string; completed?: boolean }): Promise<boolean> {
    const [result] = await client.query<Result>(
      "UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?",
      [todo.title, todo.description, todo.completed, id]
    );
    return result.affectedRows > 0;
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const [result] = await client.query<ResultSetHeader>(
      "DELETE FROM todos WHERE id = ?",
      [id]
    );

    return result && 'affectedRows' in result ? result.affectedRows > 0 : false;
  }
}

export default new TodoRepository();
