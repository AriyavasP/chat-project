import { NextFunction, Request, Response } from "express";
import { createUser_ID, loginUser } from "../services/Service_User";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  createUser_ID(username, email, password)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  loginUser(username, password)
    .then((data: any) => {
      res.status(200).json({ data: data });
    })
    .catch((err: any) => {
      res.status(500).json({ err: err.message });
    });
};

export { createUser, login };
