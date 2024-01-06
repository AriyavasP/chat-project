import mongoose from "mongoose";
import User from "../models/model_user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createUser_ID = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      password,
      username,
      email,
      role: "User",
    });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (username: string, password: string) => {
  try {
    if (username.length <= 0) {
      throw new Error(`username is notfound !`);
    }

    const user: any = await User.findOne({ username: username });

    if (!user) {
      throw new Error(`Player Not found !`);
    }

    if (user.password != password) {
      throw new Error(`username or password Invalid !`);
    }

    console.log(user.username, user.role);

    let name: string = user.username;
    let role: string = user.role;
    const token = createJwtToken(name, role);
    const result = { user, token };

    return result;
  } catch (error) {
    throw error;
  }
};

const createJwtToken = (username: string, role: string) => {
  const secret_key: string = process.env.ACCESS_TOKEN_SECRET || "";
  if (secret_key.length <= 0) {
    throw new Error(`key is null || undefind`);
  }
  const token = jwt.sign({ name: username, role: role }, secret_key, {
    expiresIn: "30m",
    algorithm: "HS256",
  });

  return token;
};

const refreshJwtToken = (username: string, role: string) => {
  const secret_key: string = process.env.REFRESH_TOKEN_SECRET || "";
  if (secret_key.length <= 0) {
    throw new Error(`key is null || undefind`);
  }
  const token = jwt.sign({ name: username, role: role }, secret_key, {
    expiresIn: "2h",
    algorithm: "HS256",
  });

  return token;
};

export { createUser_ID, loginUser };
