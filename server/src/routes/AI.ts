import express from "express";
import { API_AI } from "../controllers/Controller_AI";

const router = express.Router();

router.post("/ai", API_AI);

export = router;
