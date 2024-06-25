import { Router } from "express";
import {
  CreateTask,
  DeleteTask,
  GetTask,
  GetTasks,
  UpdateTask,
} from "~controllers/TaskControllers";
import AuthMiddleware from "~middleware/AuthMiddleware";

const router = Router();

router.get("/", GetTasks);
router.get("/:id", GetTask);
router.post("/", AuthMiddleware, CreateTask);
router.put("/:id", AuthMiddleware, UpdateTask);
router.delete("/:id", AuthMiddleware, DeleteTask);

export const TaskRouter = router;
