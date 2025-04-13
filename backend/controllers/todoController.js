"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const createTodoList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('creating task');
        const { title } = req.body;
        const list = yield TodoList_1.default.create({ title });
        res.status(201).json(list);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create todo list' });
    }
});
exports.createTodoList = createTodoList;
const deleteTodoList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        yield Task_1.default.deleteMany({ todoListId: new mongodb_1.ObjectId(listId) });
        yield TodoList_1.default.findByIdAndDelete(new mongodb_1.ObjectId(listId));
        res.status(200).json({ message: 'Todo list and associated tasks deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete todo list' });
    }
});
exports.deleteTodoList = deleteTodoList;
const updateTodoList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const { title } = req.body;
        const updatedList = yield TodoList_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(listId) }, { title: title }, { new: true });
        res.status(200).json(updatedList);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update todo list' });
    }
});
exports.updateTodoList = updateTodoList;
const getTodoLists = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lists = yield TodoList_1.default.find();
        const data = yield Promise.all(lists.map((list) => __awaiter(void 0, void 0, void 0, function* () {
            const tasks = yield Task_1.default.find({ todoListId: list._id });
            const completedTasks = tasks.filter(task => task.completed).length;
            return Object.assign(Object.assign({}, list.toObject()), { totalTasks: tasks.length, completedTasks });
        })));
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch todo lists' });
    }
});
exports.getTodoLists = getTodoLists;
const addTaskToList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const { title, description } = req.body;
        const task = yield Task_1.default.create({
            title,
            description,
            todoListId: new mongodb_1.ObjectId(listId),
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
});
exports.addTaskToList = addTaskToList;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        yield Task_1.default.findByIdAndDelete(new mongodb_1.ObjectId(taskId));
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});
exports.deleteTask = deleteTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { title, description, completed } = req.body;
        const updatedTask = yield Task_1.default.findByIdAndUpdate(new mongodb_1.ObjectId(taskId), { title, description, completed }, { new: true });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});
exports.updateTask = updateTask;
const getTasksByList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const tasks = yield Task_1.default.find({ todoListId: new mongodb_1.ObjectId(listId) });
        console.log("getTasksByList", listId, tasks);
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
exports.getTasksByList = getTasksByList;
const toggleTaskCompletion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const { db } = mongoose_1.default.connection;
        if (db) {
            const task = yield Task_1.default.findOne({ _id: new mongodb_1.ObjectId(taskId) });
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            const updatedTask = yield Task_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(taskId) }, { $set: { completed: !task.completed } }, { returnDocument: 'after' });
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
});
exports.toggleTaskCompletion = toggleTaskCompletion;
