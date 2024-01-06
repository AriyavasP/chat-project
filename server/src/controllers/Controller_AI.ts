import { NextFunction, Request, Response } from "express";
import { RESAIFAQS } from "../services/Service_AI";

const API_AI = async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  RESAIFAQS(message)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

export { API_AI };
