import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../interface/interface_user";

interface IUserModels extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUserModels>("User", UserSchema);
