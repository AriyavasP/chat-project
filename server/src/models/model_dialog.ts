import mongoose, { Document, Schema } from "mongoose";
import { IDialog } from "../interface/interface_dialog";

interface IDialogModels extends IDialog, Document {}

const DialogSchema: Schema = new Schema(
  {
    id_room: { type: String, required: true },
    sender: { type: String, required: true },
    time_send: { type: Date, required: true },
    message: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IDialogModels>("Dialog", DialogSchema);
