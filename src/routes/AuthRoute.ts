import { Router } from "express";
import {
  AuthLogin,
  AuthLogout,
  AuthMe,
  AuthRegister,
} from "~controllers/AuthControllers";
import AuthMiddleware from "~middleware/AuthMiddleware";
import { CreateRateLimit } from "~utils/ratelimit";

const router = Router();

router.post("/register", AuthRegister);
router.post("/login", CreateRateLimit("login", 1, 600), AuthLogin);
router.post("/logout", AuthMiddleware, AuthLogout);
router.get("/me", AuthMiddleware, AuthMe);

export const AuthRouter = router;
