import { NextFunction, Request, Response } from "express";
import { MessageofRoom } from "../services/Service_Message";

const showMessageofRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { room_id } = req.body;
  MessageofRoom(room_id)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

export { showMessageofRoom };
