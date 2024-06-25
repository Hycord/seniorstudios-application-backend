import { Router } from "express";
import { GetUserTasks, GetUsers } from "~controllers/UserControllers";

const router = Router();

router.get("/", GetUsers);
router.get("/:id/tasks", GetUserTasks);

export const UserRouter = router;
