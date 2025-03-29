import express from "express";
import { userLogin, userSingUp } from "./Controller.js";
const router = express.Router();
router.get('/login', userLogin);
router.get('/signUp', userSingUp);
export default router;