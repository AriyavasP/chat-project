import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface reqwhithuser extends Request {
  user: { username: string; role: string };
}

const verifytoken: any = (
  req: reqwhithuser,
  res: Response,
  next: NextFunction
) => {
  try {
    const secret_key: string = process.env.ACCESS_TOKEN_SECRET || "";
    const token: string =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(404).json({ massage: "Not Found" });
    }
    const decode: any = jwt.verify(token, secret_key);

    if (decode.role != "Admin") {
      return res.status(403).json({ massage: "Can Not Access token" });
    }

    next();
  } catch (error) {
    throw error;
  }
};

const verifyuser: any = (
  req: reqwhithuser,
  res: Response,
  next: NextFunction
) => {};

export { verifytoken };
