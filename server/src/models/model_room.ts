import mongoose, { Document, Schema } from "mongoose";
import { IRoom } from "../interface/interface_room";

interface IUserModels extends IRoom, Document {}

const RoomSchema: Schema = new Schema(
  {
    user: [
      {
        id_user: { type: String, required: true },
        connect_time: { type: Date, required: true },
        role: { type: String, required: true },
        disconnect_time: { type: Date },
        status: { type: Boolean, required: true },
      },
    ],
    topic: { type: String, required: true },
    created: { type: String, required: true },
    creat_time: { type: Date, required: true },
    status_active: { type: Boolean, required: true },
    status: { type: Boolean, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUserModels>("Room", RoomSchema);
