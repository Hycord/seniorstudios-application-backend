import { Router } from "express";
import {
  AuthLogin,
  AuthLogout,
  AuthMe,
  AuthRegister,
} from "~controllers/AuthControllers";
import AuthMiddleware from "~middleware/AuthMiddleware";

const router = Router();

router.post("/register", AuthRegister);
router.post("/login", AuthLogin);
router.post("/logout", AuthMiddleware, AuthLogout);
router.get("/me", AuthMiddleware, AuthMe);

export const AuthRouter = router;
