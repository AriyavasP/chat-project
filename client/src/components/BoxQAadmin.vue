<template>
    <div class="loader" v-if="datastore.loading">
        <div class="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div class="contrainer icon-arrow icon-push" :style="{ display: datastore.loading ? 'none' : '' }">
        <div class="nav" :style="{ display: datastore.loading ? 'none' : '' }">
            <router-link class="nav-controller" to="/home">
                BACK
            </router-link>
            <router-link class="nav-controller" to="/qaupdate">
                UPDATE
            </router-link>
            <router-link class="nav-controller" to="/qadelete">
                DELETE
            </router-link>
        </div>
        <div v-if="questiondata.length != 0" v-for="(item, index) in questiondata">
            <label for="fname">Question : {{ index + 1 }}</label><br>
            <span type="text" id="fname" name="firstname">{{ item }}</span>
            <i class="gg-arrow-bottom-left-o" @click="changeDataout(index)"></i>
        </div>
        <div>
            <label for="fname">Question</label>
            <input v-model="questionmassge" type="text" id="fname" name="firstname" placeholder="Question..">
            <!-- <i class="gg-push-chevron-up-o" @click="pushDatain"></i> -->
        </div>
        <div v-if="answerdata.length != 0" v-for="(item, index) in answerdata">
            <label for="lname">Answer : {{ index + 1 }}</label>
            <span type="text" id="lname" name="lastname">{{ item }}</span>
            <i class="gg-arrow-bottom-left-o" @click="changeDataoutV2(index)"></i>
        </div>
        <div>
            <label for="lname">Answer</label>
            <input v-model="answermassage" type="text" id="lname" name="lastname" placeholder="Answer..">
            <!-- <i class="gg-push-chevron-up-o" @click="pushDatainV2"></i> -->
        </div>
        <div>
            <label for="group">Group</label>
            <input v-model="group" type="text" id="group" list="grouplist" name="group" placeholder="Group...">
            <datalist id="grouplist">
                <option v-for="(item, index) in groupfaq">{{ item.group }}</option>
            </datalist>
        </div>
        <input @click="useAPIsaveData" type="submit">
    </div>
</template>

<script>
import axios from 'axios'
import { useDataStore } from '../store/store'

export default {
    data() {
        return {
            questiondata: [],
            questionmassge: "",
            answerdata: [],
            answermassage: "",
            group: "",
            groupfaq: [],
        }
    },
    setup() {
        const datastore = useDataStore()
        return { datastore }
    },
    beforeCreate() {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/qa/showquestion',
            headers: {},
            data: ""
        };

        axios(config)
            .then((response) => {
                this.groupfaq = response.data.data
                this.groupfaq = [...new Map(this.groupfaq.map(item => [item['group'], item])).values()]
            })
            .catch((error) => {
                console.log(error);
            });
    },
    methods: {
        pushDatain() {
            if (this.questionmassge == "") {
                return false
            }
            this.questiondata.push(this.questionmassge)
            this.questionmassge = ""
        },
        changeDataout(item) {
            this.questiondata.splice(item, 1)
        },
        pushDatainV2() {
            if (this.answermassage == "") {
                return false
            }
            this.answerdata.push(this.answermassage)
            this.answermassage = ""
        },
        changeDataoutV2(item) {
            this.answerdata.splice(item, 1)
        },
        useAPIsaveData() {
            this.datastore.setloading(true)
            const token = localStorage.getItem("token")
            this.pushDatainV2();
            var data = JSON.stringify({
                "questionmassage": this.questionmassge,
                "answermassage": this.answerdata,
                "group": this.group.toUpperCase(),
                "number": 1
            });

            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:3000/qa/addfaqs',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then((response) => {
                    setTimeout(() => {
                        this.datastore.setloading(false)
                    }, 2000);
                    this.questionmassge = "";
                    this.answerdata = [];
                    this.answermassage = "";
                    this.group = "";
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>