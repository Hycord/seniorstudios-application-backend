import { Router } from "express";
import { GetUserTasks, GetUsers } from "~controllers/UserControllers";
import AuthMiddleware from "~middleware/AuthMiddleware";

const router = Router();

router.get("/", AuthMiddleware, GetUsers);
router.get("/:id/tasks", AuthMiddleware, GetUserTasks);

export const UserRouter = router;
