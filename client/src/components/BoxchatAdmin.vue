<template>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <div id="container">
        <div>
            <aside class="left">
                <header>MESSAGEBOX <router-link to="/home"> BACK</router-link></header>
                <div class="barhistory">
                    <ul>
                        <div v-for="(list, index) in datastore.viewactivechat">
                            <div v-if="list._id == roomid">
                                <li @click="selectionRoom(list._id)" class="active-chat">
                                    <a>ID: {{ list._id }}</a><i @click="close(list._id, index)"
                                        class="glyphicon glyphicon-remove"></i>
                                </li>
                            </div>
                            <div v-else>
                                <div v-if="list.user.length > 1">
                                    <li @click="selectionRoom(list._id)" style="background-color: red">
                                        <a>{{ list.topic }}</a><i class="glyphicon glyphicon-remove"></i>
                                    </li>
                                </div>
                                <div v-else>
                                    <li @click="selectionRoom(list._id)">
                                        <a>{{ list.topic }}</a><i class="glyphicon glyphicon-remove"></i>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </ul>
                </div>
            </aside>
        </div>
        <div>
            <main class="right" :style="{
                visibility: activechat ? '' : 'hidden',
                transform: activechat ? '' : 'scale(0)',
            }">
                <div class="chatbox-frame">
                    <div class="chatbox" id="app">
                        <div class="chatbox__header">
                            <div class="chatbox__headerText">
                                USER
                                <div class="chatbox__onlineDot"></div>
                            </div>
                            <div class="chatbox__button"></div>
                        </div>
                        <div ref="chat" class="chatbox__messages">
                            <div v-for="(item, index) in datastore.datahistory">
                                <div v-if="item.sender != userid" class="chatbox__messageBox">
                                    <div class="chatbox__message">
                                        {{ item.message }}
                                        <div class="chatbox__tooltip chatbox__tooltip--left">
                                            {{ item.tiem_send }}
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="chatbox__messageBox--primary">
                                    <div class="chatbox__message chatbox__message--primary">
                                        {{ item.message }}
                                        <div class="chatbox__tooltip chatbox__tooltip--left">
                                            {{ item.tiem_send }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chatbox__inputPanel">
                            <input class="chatbox__input" placeholder="Aa" @keyup.enter="sendmessage"
                                v-model="newmessage" />
                            <div class="chatbox__tooltip chatbox__tooltip--bottom">
                                Press enter to send the message
                            </div>
                            <!--.chatbox__button +-->
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import serviceSocket from "../services/service.socket";
import { useDataStore } from "../store/store";

export default {
    setup() {
        const datastore = useDataStore();
        return { datastore };
    },
    data() {
        return {
            userid: localStorage.getItem("userid"),
            token: localStorage.getItem("token"),
            history: [],
            newmessage: "",
            roomid: "",
            activechat: false,
        };
    },
    created() {
        this.datastore.setroom(this.roomid);
        serviceSocket.setupSocketConnectionForadmin();
    },
    beforeUnmount() {
        serviceSocket.disconnect();
    },
    watch: {
        "datastore.datahistory": {
            // This will let Vue know to look inside the array
            deep: true,
            // We have to move our method to a handler field
            handler() {
                this.checkscroll();
            },
        },
    },
    methods: {
        sendmessage() {
            if (
                this.newmessage != undefined ||
                this.newmessage != null ||
                this.newmessage != "" ||
                this.newmessage != "\n"
            ) {
                serviceSocket.sendMessage(this.newmessage);
                this.newmessage = "";
            }
        },
        scrollBottom() {
            setTimeout(() => {
                var container = this.$refs.chat;
                container.scrollTop = container.scrollHeight;
            }, 200);
        },
        checkscroll() {
            const progress =
                (this.$refs.chat.scrollTop /
                    (this.$refs.chat.scrollHeight - this.$refs.chat.clientHeight)) *
                100;

            if (progress >= 80) {
                this.scrollBottom();
            }
        },
        selectionRoom(room) {
            if (room == this.roomid) {
                console.log("YOU CONNECTED");
                this.roomid = "";
                this.datastore.sethistory([]);
                this.activechat = false;
                this.datastore.setroom(this.roomid);
                serviceSocket.disconnect();
                serviceSocket.setupSocketConnectionForadmin();
                return false;
            } else {
                serviceSocket.disconnect();
                this.roomid = room;
                this.datastore.setroom(this.roomid);
                serviceSocket.setupSocketConnectionForadmin();
                this.activechat = true;
            }
        },
        close(roomid, index) {
            this.$toast.success(`SUCCESS`, {
                position: "top",
            });
            this.datastore.removeactivechat(index);
            serviceSocket.closeTap(roomid);
        },
    },
};
</script>
