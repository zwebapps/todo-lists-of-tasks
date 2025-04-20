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
  todoHome,
} from '../controllers/todoController';

const router = express.Router();

router.get('/', todoHome);

router.get('/lists', getTodoLists);
router.post('/lists', createTodoList);
router.post('/lists/:listId/tasks', addTaskToList);
router.delete('/lists/:listId', deleteTodoList);
router.put('/lists/:listId', updateTodoList);
router.delete('/tasks/:taskId', deleteTask);
router.put('/tasks/:taskId', updateTask);
router.get('/lists/:listId/tasks', getTasksByList);
router.patch('/tasks/:taskId/toggle', async (req, res) => {
  try {
    await toggleTaskCompletion(req, res);
  } catch (error) {
    console.error('Error in toggleTaskCompletion route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
