import mongoose from "mongoose";
import Room from "../models/model_room";
import User from "../models/model_user";

const createRoombyID = async (ID: string, topic: string) => {
  try {
    const room = new Room({
      _id: new mongoose.Types.ObjectId(),
      user: [
        {
          id_user: ID,
          connect_time: new Date(),
          disconnect_time: null,
          role: "User",
          status: true,
        },
      ],
      topic: topic,
      created: ID,
      creat_time: new Date(),
      status_active: false,
      status: true,
    });
    await room.save();

    return room;
  } catch (error) {
    throw error;
  }
};

const showRoomUser = async () => {
  try {
    const result: any = await Room.find({ status_active: true });

    return result;
  } catch (error) {
    throw error;
  }
};

const showRoom = async (userid: string) => {
  try {
    const result: any = await Room.find({ created: userid });

    return result;
  } catch (error) {
    throw error;
  }
};

const updatestatusactiveRoombyID = async (ID: string, status: boolean) => {
  try {
    const result: any = await Room.findById(ID);

    result.status_active = status;
    await result.save();

    return result;
  } catch (error) {
    throw error;
  }
};

const updatestatusRoombyID = async (ID: string, status: boolean) => {
  try {
    const result: any = await Room.findById(ID);

    result.status = status;
    result.status_active = status;
    await result.save();

    return result;
  } catch (error) {
    throw error;
  }
};

const updatestatusRoombyUser = async (userID: string, roomID: string) => {
  try {
    let room: any = await Room.find({ created: userID });
    room = await room.map(async (e: any) => {
      e.status = false;
      await e.save();
      return e;
    });

    const result: any = await Room.findById(roomID);
    result.status = true;
    await result.save();

    return result;
  } catch (error) {
    throw error;
  }
};

const updatestatusUserinRoombyID = async (
  ID: string,
  userid: string,
  status: boolean
) => {
  try {
    let room: any = await Room.findById(ID);

    const result = room.user.map((item: any) => {
      if (item.id_user == userid) {
        item.status = status;
      }
      return item;
    });
    room.user = result;
    await room.save();

    return room;
  } catch (error) {
    throw error;
  }
};

const updateTopicRoombyID = async (ID: string, topic: string) => {
  try {
    const room = await Room.updateOne({ _id: ID }, { $set: { topic: topic } });

    return room;
  } catch (error) {
    throw error;
  }
};

const joinRoombyID = async (roomID: string, userID: string) => {
  try {
    const room: any = await Room.findById(roomID);

    const user: any = await User.findById(userID);

    if (room == null || user == null) {
      throw new Error(`Room or User can't found`);
    }

    if (!validateRoom(room, user)) {
      return room;
    }

    const adminjoin: any = [
      {
        _id: new mongoose.Types.ObjectId(),
        id_user: user._id,
        connect_time: new Date(),
        role: user.role,
        disconnect_time: null,
        status: true,
      },
    ];

    const data = room.user.concat(adminjoin);

    room.user = data;
    room.save();

    return room;
  } catch (error) {
    throw error;
  }
};

const checkActiveBot = async (ID: string) => {
  try {
    const room: any = await Room.findById(ID);

    if (room.status_active) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const validateRoom = (room: any, user: any) => {
  for (const data of room.user) {
    if (data.id_user == user._id) {
      // throw new Error(`user_id: ${data.id_user} has joined`);
      return false;
    }
  }
  return true;
};

export {
  createRoombyID,
  updatestatusRoombyID,
  joinRoombyID,
  showRoomUser,
  showRoom,
  updatestatusRoombyUser,
  updatestatusactiveRoombyID,
  updatestatusUserinRoombyID,
  updateTopicRoombyID,
  checkActiveBot
};
