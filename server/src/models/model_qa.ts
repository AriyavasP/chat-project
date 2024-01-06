import mongoose, { Document, Schema } from "mongoose";
import { IQadialog } from "../interface/interface_qa";

interface IUserModels extends IQadialog, Document {}

const Questionschema: Schema = new Schema(
  {
    option: [
      {
        id_question: { type: String },
        number: { type: Number },
        message: { type: String },
        status: { type: Boolean },
      },
    ],
    group: { type: String, required: true },
    number: { type: Number, required: true },
    message: { type: String, required: true },
    create_time: { type: Date, required: true },
    status: { type: Boolean, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUserModels>("Question", Questionschema);
