import Dialog from "../models/model_dialog";

const MessageofRoom = async (room_id: string) => {
  const result = await Dialog.find({ id_room: room_id });

  return result;
};

export { MessageofRoom };
