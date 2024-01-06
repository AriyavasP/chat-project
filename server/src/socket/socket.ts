import {
  createRoombyID,
  joinRoombyID,
  showRoomUser,
  showRoom,
  updatestatusRoombyID,
  updatestatusactiveRoombyID,
  updatestatusUserinRoombyID,
  updateTopicRoombyID,
  checkActiveBot,
} from "../services/Service_Room";
import { MessageofRoom } from "../services/Service_Message";
import { RESAIFAQS } from "../services/Service_AI";

import User from "../models/model_user";
import Room from "../models/model_room";

import { messaging } from "../middleware/messagesoket";
import {
  addQatoDatabase,
  searchgroup,
  searchkeyword,
  sentQuestion,
} from "../services/Service_Qa";

const socketStart = (io: any) => {
  io.on("connection", async (socket: any) => {
    try {
      console.log(`Connected with socket_id : ${socket.id}`);
      const socket_data = socket.request._query;

      if (
        !socket_data ||
        !socket_data.user_id ||
        socket_data.user_id == undefined
      ) {
        socket.disconnect();
        return;
      }
      let roomid: string = "";
      let messagedetail: any;
      let listdataroom: any;
      let historyroom: any;
      const groupfaqs = await sentQuestion();
      if (socket_data.room_id == undefined) {
        // <== USER ==>
        const roomdata = await finddatafromDB(socket_data.user_id, "R");

        if (roomdata != null && roomdata.status == true) {
          // <-- USER HAS ROOM -->
          roomid = roomdata._id.toString();

          messagedetail = await MessageofRoom(roomid);
          await saveconnectedtimeDB(roomid, socket_data.user_id);
          historyroom = await showRoom(socket_data.user_id);

          socket.join(roomid);
          socket.emit("room_history", historyroom);
          io.to(roomid).emit("room", roomdata);
          socket.emit("group-faqs", groupfaqs);
          socket.emit("history", messagedetail);
        } else {
          // <-- CREATE ROOM -->
          const room = await createRoombyID(socket_data.user_id, "none");

          roomid = room._id.toString();

          await saveconnectedtimeDB(roomid, socket_data.user_id);
          historyroom = await showRoom(socket_data.user_id);

          socket.join(roomid);
          socket.emit("room_history", historyroom);
          socket.emit("group-faqs", groupfaqs);
          roomid = room._id.toString();
          io.to(roomid).emit("room", room);
        }
      } else {
        // <== ADMIN ==>
        roomid = socket_data.room_id;

        if (roomid == undefined || roomid == "") {
          listdataroom = await showRoomUser();
          socket.emit("room_active", listdataroom);
        } else {
          messagedetail = await MessageofRoom(roomid);
          await saveconnectedtimeDB(roomid, socket_data.user_id);
          const joinroom = await joinRoombyID(roomid, socket_data.user_id);
          await updatestatusUserinRoombyID(roomid, socket_data.user_id, true);

          listdataroom = await showRoomUser();

          socket.join(roomid);
          io.emit("room_active", listdataroom);
          socket.emit("history", messagedetail);
          io.to(roomid).emit("room", joinroom);
        }
      }

      socket.on("room", function (text: any) {
        socket.emit("room", text);
      });

      socket.on("message", async function (text: any) {
        if (text == undefined || text == null || text == "") {
          return console.log(`not found message`);
        }
        const infodialog = await messaging(roomid, socket_data.user_id, text);

        io.to(roomid).emit("message", {
          infodialog,
        });
      });

      socket.on("group-faqs", async function (text: any) {
        if (text == undefined || text == null || text == "") {
          return console.log(`not found group`);
        }
        const groupqa = await searchgroup(text);

        io.to(roomid).emit("group-faqs", {
          groupqa,
        });
      });

      socket.on("aks-bot", async function (text: any) {
        if (text == undefined || text == null || text == "") {
          return console.log(`not found group`);
        }
        const infodialog = await messaging(roomid, socket_data.user_id, text);
        const checkBotActive: any = await checkActiveBot(roomid);

        if (!checkBotActive) {
          const key: any = await searchkeyword(text);
          const botid: string = "63dcb9fc398eabe2233e181c";
          if (key != false) {
            const infodialog = await messaging(roomid, botid, key.message);
            setTimeout(() => {
              io.to(roomid).emit("message", { infodialog });
            }, 500);
          } else {
            const message: any = await RESAIFAQS(text);
            const alertword: string =
              "I don't understand the question please wait for the experts coming in.";

            if (message == alertword) {
              await updateTopicRoombyID(roomid, text);
              await updatestatusactiveRoombyID(roomid, true);

              listdataroom = await showRoomUser();
              io.emit("room_active", listdataroom);
            }

            const infodialog = await messaging(roomid, botid, message);
            const g = "waiting update to server"
            await addQatoDatabase(text, [message], g, 1)

            setTimeout(() => {
              io.to(roomid).emit("message", { infodialog });
            }, 500);
          }
        }

        io.to(roomid).emit("message", { infodialog });
      });

      socket.on("success_faqs", async function (roomid: any) {
        if (roomid == undefined) {
          return null;
        }
        const infostatus = await updatestatusRoombyID(roomid, false);

        socket.to(roomid).emit("success_faqs", {
          infostatus,
        });
      });

      socket.on("disconnect", async function () {
        let search: string = socket_data.room_id;
        let finduserroombyiduser: any;

        if (search == undefined || search == "") {
          return null;
        } else {
          if (search == undefined) {
            search = socket_data.user_id;
            finduserroombyiduser = await finddatafromDB(search, "R");
            await updatestatusUserinRoombyID(
              roomid,
              socket_data.user_id,
              false
            );
            await savedisconnectDB(finduserroombyiduser, socket_data.user_id);
          } else {
            finduserroombyiduser = await finddatafromDB(search, "RID");
            await updatestatusUserinRoombyID(
              roomid,
              socket_data.user_id,
              false
            );
            await savedisconnectDB(finduserroombyiduser, socket_data.user_id);
          }
        }
        listdataroom = await showRoomUser();
        io.emit("room_active", listdataroom);
        console.log(`Disconnected with socket_id : ${socket.id}`);
      });
    } catch (error: any) {
      socket.disconnect();
      console.log(error.message);
    }
  });
};

const finddatafromDB = async (search: any, column: string) => {
  try {
    let result: any;

    if (search == "empty") {
      return null;
    }

    if (column == "U") {
      result = await User.findById(search);
    } else if (column == "R") {
      result = await Room.findOne({ created: search, status: true });
    } else if (column == "RID") {
      result = await Room.findById(search);
    }

    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

const savedisconnectDB = async (data: any, user_id: string) => {
  try {
    let result: any;
    result = data;

    if (data == null) {
      return null;
    }

    result.user = result.user.map((data: any) => {
      if (user_id == data.id_user) {
        data.disconnect_time = new Date();
      }
      return data;
    });

    await result.save();

    return result;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Can't save disconnect_time`);
  }
};

const saveconnectedtimeDB = async (room_id: string, user_id: string) => {
  try {
    const roomdata = await Room.findById(room_id);

    let result: any = roomdata;

    result.user = result.user.map((user: any) => {
      if (user.id_user == user_id) {
        user.connect_time = new Date();
      }
      return user;
    });

    await result.save();

    return result;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Can't save connected_time`);
  }
};

export default socketStart;
