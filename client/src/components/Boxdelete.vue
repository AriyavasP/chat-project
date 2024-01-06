<template>
    <div class="modal" :style="{ display: modalstatus ? '' : 'none' }">
        <div class="modal-confirm">
            <span class="title">Ask</span>
            <p class="contents">are u sure for delete question ?</p>
            <div class="footer">
                <button @click="deleteAPI">Confirm</button>
                <button @click="calcel">Cancel</button>
            </div>
        </div>
    </div>
    <div class="contrainer" :style="{ display: modalstatus ? 'none' : '' }">
        <router-link to="/qamanagement">
            BACK
        </router-link>
        <div class="boxdetail">
            <ul>
                <li v-for="(item, index) in dataqa" class="detail"><a>{{ item.Q }}</a><i
                        @click="confirm(item.id_question, item.id_answer, index)"></i></li>
            </ul>
        </div>
    </div>
</template>

<script lang="js">
import axios from 'axios';
export default {
    data() {
        return {
            modalstatus: false,
            dataqa: [],
            token: localStorage.getItem("token"),
            q: "",
            a: "",
            i: "",
        }
    },
    created() {
        var data = '';

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/qa/showallqa',
            headers: {},
            data: data
        };

        axios(config)
            .then((response) => {
                this.dataqa = response.data.data
                console.log(this.dataqa);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        deleteAPI() {
            var data = JSON.stringify({
                "questionid": this.q,
                "answerid": this.a
            });

            var config = {
                method: 'delete',
                maxBodyLength: Infinity,
                url: 'http://localhost:3000/qa/deletedatafaqs',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then((response) => {
                    this.dataqa.splice(this.i, 1)
                    this.modalstatus = false;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        confirm(idq, ida, index) {
            this.modalstatus = true;
            this.q = idq
            this.a = ida
            this.i = index
        },
        calcel() {
            this.modalstatus = false;
            this.q = ""
            this.a = ""
            this.i = ""
        }
    }
}
</script>