import express from 'express';
import {
  createTodoList,
  getTodoLists,
  addTaskToList,
  getTasksByList,
  toggleTaskCompletion,
  deleteTask,
  deleteTodoList,
  updateTask,
  updateTodoList,
} from '../controllers/todoController';

const router = express.Router();

router.get('/lists', getTodoLists);
router.post('/lists', createTodoList);
router.post('/lists/:listId/tasks', addTaskToList);
router.delete('/lists/:listId', deleteTodoList);
router.put('/lists/:listId', updateTodoList);
router.delete('/tasks/:taskId', deleteTask);
router.put('/tasks/:taskId', updateTask);
router.get('/lists/:listId/tasks', getTasksByList);
router.patch('/tasks/:taskId/toggle', async (req, res) => {
  await toggleTaskCompletion(req, res);
});

export default router;
