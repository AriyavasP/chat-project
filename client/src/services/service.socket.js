import { io } from "socket.io-client";
import { useDataStore } from "../store/store";

class SocketioService {
  socket;

  setupSocketConnection() {
    let reqdata = { user_id: localStorage.getItem("userid") };
    const usedatafromstore = useDataStore();

    this.socket = io("http://localhost:3000", {
      query: reqdata,
    });
    // <-- connect room -->
    this.socket.on("room", (data) => {
      const usedatafromstore = useDataStore();
      console.log("room", data);
      usedatafromstore.setroom(data);
    });
    // <-- connect message -->
    this.socket.on("message", (data) => {
      const usedatafromstore = useDataStore();
      usedatafromstore.setmessage(data.message);
      usedatafromstore.addhistory(data.infodialog);
    });
    // <-- connect history -->
    this.socket.on("history", (data) => {
      const usedatafromstore = useDataStore();
      usedatafromstore.sethistory(data);
    });
    //<-- connect room_active -->
    this.socket.on("room_active", (data) => {
      usedatafromstore.setactivelist(data);
    });
    //<-- connect room_history -->
    this.socket.on("room_history", (data) => {
      usedatafromstore.setroomlist(data);
    });
    //<-- connect group-faqs -->
    this.socket.on("group-faqs", (data) => {
      usedatafromstore.setGroupFaqs(data);
    });
    // <-- connect disconnect -->
    this.socket.on("disconnect", (data) => {
      usedatafromstore.sethistory([]);
      usedatafromstore.setroomlist([]);
      console.log("disconnect", data);
    });
  }

  setupSocketConnectionForadmin() {
    const usedatafromstore = useDataStore();
    const reqdata = {
      user_id: localStorage.getItem("userid"),
      room_id: usedatafromstore.roomID,
    };

    this.socket = io("http://localhost:3000", {
      query: reqdata,
    });
    // <-- connect room -->
    this.socket.on("room", (data) => {
      // console.log("room", data);
      usedatafromstore.setroom(data);
    });
    // <-- connect message -->
    this.socket.on("message", (data) => {
      usedatafromstore.setmessage(data.message);
      usedatafromstore.addhistory(data.infodialog);
    });
    // <-- connect history -->
    this.socket.on("history", (data) => {
      usedatafromstore.sethistory(data);
    });
    //<-- connect room_active -->
    this.socket.on("room_active", (data) => {
      usedatafromstore.setactivelist(data);
    });
    // <-- connect disconnect -->
    this.socket.on("disconnect", (data) => {
      console.log(data);
    });
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.emit("message", message);
    }
  }

  sendMessageToBot(message) {
    if (this.socket) {
      this.socket.emit("aks-bot", message);
    }
  }

  sendGroupFaqs(group) {
    if (this.socket) {
      this.socket.emit("group-faqs", group);
    }
  }

  closeTap(roomid) {
    if (this.socket) {
      this.socket.emit("success_faqs", roomid);
      this.socket.disconnect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
