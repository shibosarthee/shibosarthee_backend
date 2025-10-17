import express from "express";
import {
  getUserbyId,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserbyId);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
