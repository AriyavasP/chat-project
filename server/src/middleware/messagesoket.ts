import Dialog from "../models/model_dialog";
import mongoose from "mongoose";

const messaging = async (roomID: string, userID: string, message: string) => {
  try {
    const dialog = new Dialog({
      _id: new mongoose.Types.ObjectId(),
      id_room: roomID,
      sender: userID,
      time_send: new Date(),
      message: message,
    });
    dialog.save();

    return dialog;
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
};

export { messaging };
