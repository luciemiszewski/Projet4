import type { RequestHandler } from "express";
import todoRepository from "./todoRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const todos = await todoRepository.findAll();
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const todoId = Number(req.params.id);
    const todo = await todoRepository.findById(todoId);

    if (todo == null) {
      res.sendStatus(404);
    } else {
      res.json(todo);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({ message: "Le titre est requis" });
      return;
    }

    const insertId = await todoRepository.create({ title, description });

    const todo = await todoRepository.findById(insertId);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const todoId = Number(req.params.id);
    const { title, description, completed } = req.body;
    
    if (title !== undefined && !title.trim()) {
      res.status(400).json({ message: "Le titre ne peut pas être vide" });
      return;
    }
    
    const success = await todoRepository.update(todoId, { title, description, completed });
    
    if (!success) {
      res.sendStatus(404);
    } else {
      const updatedTodo = await todoRepository.findById(todoId);
      res.json(updatedTodo);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const todoId = Number(req.params.id);

    const success = await todoRepository.delete(todoId);

    if (!success) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ message: "Tâche supprimée avec succès" });
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
