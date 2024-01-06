import mongoose, { Document, Schema } from "mongoose";
import { IAnswer } from "../interface/interface_answer";

interface IAnswerModels extends IAnswer, Document {}

const AnswerSchema: Schema = new Schema(
  {
    id_question: { type: String, required: true },
    message: { type: String, required: true },
    create_time: { type: Date, required: true },
    status: { type: Boolean, require: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IAnswerModels>("answer", AnswerSchema);
