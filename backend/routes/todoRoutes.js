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
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controllers/todoController");
const router = express_1.default.Router();
router.get('/lists', todoController_1.getTodoLists);
router.post('/lists', todoController_1.createTodoList);
router.post('/lists/:listId/tasks', todoController_1.addTaskToList);
router.delete('/lists/:listId', todoController_1.deleteTodoList);
router.put('/lists/:listId', todoController_1.updateTodoList);
router.delete('/tasks/:taskId', todoController_1.deleteTask);
router.put('/tasks/:taskId', todoController_1.updateTask);
router.get('/lists/:listId/tasks', todoController_1.getTasksByList);
router.patch('/tasks/:taskId/toggle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, todoController_1.toggleTaskCompletion)(req, res);
    }
    catch (error) {
        console.error('Error in toggleTaskCompletion route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
