import express from "express";
import { addEmployee, getEmployees, searchEmployees } from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all employee routes

router.post("/", addEmployee);
router.get("/", getEmployees);
router.get("/search", searchEmployees);

export default router;
