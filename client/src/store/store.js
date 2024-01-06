import { defineStore } from "pinia";

export const useDataStore = defineStore({
  id: "data",
  state: () => ({
    data: false,
    datahistory: [],
    roomID: false,
    viewactivechat: [],
    historyroom: [],
    loading: false,
    qamessage: false,
    groupfaqs: [],
    roomactivewithadmin: [],
  }),
  actions: {
    setmessage(message) {
      this.data = message;
    },
    sethistory(history) {
      this.datahistory = history;
    },
    setroom(roomid) {
      this.roomID = roomid;
    },
    addhistory(infomessage) {
      this.datahistory.push(infomessage);
    },
    setactivelist(listuser) {
      this.viewactivechat = listuser.map((item) => {
        var result = item.user
          .map((user) => {
            var arr;
            if (user.status == true) {
              arr = user;
            }
            return arr;
          })
          .filter((item) => {
            return item != undefined;
          });
        item.user = result;
        return item;
      });

      console.log(this.viewactivechat);
    },
    setroomlist(listuser) {
      this.historyroom = listuser;
    },
    setloading(status) {
      this.loading = status;
    },
    setQA(message) {
      this.qamessage = message;
    },
    removeactivechat(index) {
      this.viewactivechat.splice(index, 1);
    },
    setGroupFaqs(group) {
      this.groupfaqs = group;
    },
  },
});
