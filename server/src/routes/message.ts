import express from "express";
import { verifytoken } from "../middleware/validateJWTtoken";
import { showMessageofRoom } from "../controllers/Controller_Message";

const router = express.Router();

router.post("/message", verifytoken, showMessageofRoom);

export = router;
