import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("name").isString().withMessage("Please enter a valid name"),
  projectController.createProject
);

router.get("/all", authMiddleware.authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authMiddleware.authUser,
  body("projectId").isMongoId().withMessage("Please enter a valid project ID"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Please enter a valid user")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string")),

  projectController.addUser
);

export default router;
