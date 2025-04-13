"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTaskCompletion = exports.getTasksByList = exports.updateTask = exports.deleteTask = exports.addTaskToList = exports.getTodoLists = exports.updateTodoList = exports.deleteTodoList = exports.createTodoList = void 0;
const TodoList_1 = __importDefault(require("../models/TodoList"));
const Task_1 = __importDefault(require("../models/Task"));
const mongodb_1 = require("mongodb");
// import { ObjectId } from 'bson';
const mongoose_1 = __importDefault(require("mongoose"));
const createTodoList = async (req, res) => {
    try {
        console.log('creating task');
        const { title } = req.body;
        const list = await TodoList_1.default.create({ title });
        res.status(201).json(list);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create todo list' });
    }
};
exports.createTodoList = createTodoList;
const deleteTodoList = async (req, res) => {
    try {
        const { listId } = req.params;
        await Task_1.default.deleteMany({ todoListId: new mongodb_1.ObjectId(listId) });
        await TodoList_1.default.findByIdAndDelete(new mongodb_1.ObjectId(listId));
        res.status(200).json({ message: 'Todo list and associated tasks deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete todo list' });
    }
};
exports.deleteTodoList = deleteTodoList;
const updateTodoList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title } = req.body;
        const updatedList = await TodoList_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(listId) }, { title: title }, { new: true });
        res.status(200).json(updatedList);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update todo list' });
    }
};
exports.updateTodoList = updateTodoList;
const getTodoLists = async (_req, res) => {
    try {
        const lists = await TodoList_1.default.find();
        const data = await Promise.all(lists.map(async (list) => {
            const tasks = await Task_1.default.find({ todoListId: list._id });
            const completedTasks = tasks.filter(task => task.completed).length;
            return {
                ...list.toObject(),
                totalTasks: tasks.length,
                completedTasks
            };
        }));
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch todo lists' });
    }
};
exports.getTodoLists = getTodoLists;
const addTaskToList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title, description } = req.body;
        const task = await Task_1.default.create({
            title,
            description,
            todoListId: new mongodb_1.ObjectId(listId),
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
};
exports.addTaskToList = addTaskToList;
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await Task_1.default.findByIdAndDelete(new mongodb_1.ObjectId(taskId));
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, completed } = req.body;
        const updatedTask = await Task_1.default.findByIdAndUpdate(new mongodb_1.ObjectId(taskId), { title, description, completed }, { new: true });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};
exports.updateTask = updateTask;
const getTasksByList = async (req, res) => {
    try {
        const { listId } = req.params;
        const tasks = await Task_1.default.find({ todoListId: new mongodb_1.ObjectId(listId) });
        console.log("getTasksByList", listId, tasks);
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getTasksByList = getTasksByList;
const toggleTaskCompletion = async (req, res) => {
    const { taskId } = req.params;
    try {
        const { db } = mongoose_1.default.connection;
        if (db) {
            const task = await Task_1.default.findOne({ _id: new mongodb_1.ObjectId(taskId) });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const updatedTask = await Task_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(taskId) }, { $set: { completed: !task.completed } }, { returnDocument: 'after' });
            console.log('updatedTask', exports.updateTask, task);
            res.status(200).json(updatedTask);
        }
        else {
            return res.status(404).json({ error: 'Task Connection is invalide' });
        }
    }
    catch (error) {
        console.error('Error toggling task completion:', error);
        res.status(500).json({ error: 'Failed to toggle task completion' });
    }
};
exports.toggleTaskCompletion = toggleTaskCompletion;
//# sourceMappingURL=todoController.js.map