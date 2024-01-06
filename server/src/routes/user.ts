import express from "express";
import { createUser, login } from "../controllers/Controller_User";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);

export = router;
