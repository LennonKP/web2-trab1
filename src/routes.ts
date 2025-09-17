import { Router } from "express";
import { UserController } from "./controllers/user";
import { MemoryUsersRepository } from "./repository/memoryUserRepository";
import { UserService } from "./services/userService";

const userRepository = new MemoryUsersRepository()
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.get("/", userController.getAll);
router.get("/user-form", userController.getForm);
router.get("/user-form/:id", userController.getForm);
router.get("/export", userController.exportCsv);
router.post("/user-form", userController.create);
router.post("/user-form/:id", userController.update);
router.delete("/users/:id", userController.delete);

export default router;