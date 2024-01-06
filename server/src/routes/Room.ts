import express from "express";
import {
  createRoom,
  updateRoom,
  joinRoom,
  showroom,
  roomofuser,
  updateRoomfromUser,
  setAdminactiveinroom,
} from "../controllers/Controller_Room";
import { verifytoken } from "../middleware/validateJWTtoken";

const router = express.Router();

router.get("/showuser", verifytoken, showroom);
router.post("/create/:user_id", verifytoken, createRoom);
router.put("/updatestatus/:room_id", verifytoken, updateRoom);
router.put("/joinroom/:room_id", verifytoken, joinRoom);

router.post("/roomhistory", roomofuser);
router.post("/updatestatusbyuser", updateRoomfromUser);

router.post("/test", setAdminactiveinroom);

export = router;
