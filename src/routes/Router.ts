import { Router } from "express";
import { AuthRouter } from "./AuthRoute";
import { UserRouter } from "./UserRoute";
import { TaskRouter } from "./TaskRoute";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/tasks", TaskRouter);
export default router;
