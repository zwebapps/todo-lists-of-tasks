import { Request, Response } from 'express';
import TodoList from '../models/TodoList';
import Task from '../models/Task';
import { ObjectId } from 'mongodb';
// import { ObjectId } from 'bson';
import mongoose from 'mongoose';
import { connectDB, dbConnection } from '../db';

export const createTodoList = async (req: Request, res: Response) => {
  try {
    console.log('creating task')
    const { title } = req.body;
    const list = await TodoList.create({ title });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo list' });
  }
};

export const deleteTodoList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    await Task.deleteMany({ todoListId: new ObjectId(listId) });
    await TodoList.findByIdAndDelete(new ObjectId(listId));
    res.status(200).json({ message: 'Todo list and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo list' });
  }
};
export const updateTodoList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;
    const updatedList = await TodoList.findOneAndUpdate(
      { _id: new ObjectId(listId)},
      { title: title },
      { new: true }
    );
    res.status(200).json(updatedList);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update todo list' });
  }
};

export const getTodoLists = async (_req: Request, res: Response) => {
  try {
    const lists = await TodoList.find();
    const data = await Promise.all(lists.map(async list => {
      const tasks = await Task.find({ todoListId: list._id });
      const completedTasks = tasks.filter(task => task.completed).length;
      return {
        ...list.toObject(),
        totalTasks: tasks.length,
        completedTasks
      };
    }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo lists' });
  }
};

export const addTaskToList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const { title, description } = req.body;
    const task = await Task.create({
      title,
      description,
      todoListId: new ObjectId(listId),
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(new ObjectId(taskId));
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};


export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      new ObjectId(taskId),
      { title, description, completed },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const getTasksByList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const tasks = await Task.find({ todoListId: new ObjectId(listId) });
    console.log("getTasksByList", listId, tasks)
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};


export const toggleTaskCompletion = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const { db } = mongoose.connection;
    if(db) {
      const task = await Task.findOne({ _id: new ObjectId(taskId) });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });      }

      const updatedTask = await Task.findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        { $set: { completed: !task.completed } },
        { returnDocument: 'after' }
      );
      console.log('updatedTask', updateTask, task)
      res.status(200).json(updatedTask);
    } else {
      return res.status(404).json({ error: 'Task Connection is invalide' });
    }
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
};

