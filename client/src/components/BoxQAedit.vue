<template>
  <div class="loader" v-if="datastore.loading">
    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  <div class="form" :style="{ display: datastore.loading ? 'none' : '' }">
    <div class="nav">
      <router-link class="nav-controller" to="/qamanagement">
        BACK
      </router-link>
    </div>
    <div class="form-group">
      <!-- TEST -->
      <label for="group">Search Question</label>
      <input v-model="questionuid" type="text" id="group" list="grouplist" name="group" placeholder="Group..." @change="answercallAPI()" style="width: 300px;">
      <datalist id="grouplist">
        <option v-for="question in dataquestion" :value="question._id">{{ question.message }}</option>
      </datalist>
      <!-- end -->
      <label for="my-select">Question :</label>
      <select id="my-select" name="my-select" v-model="questionuid" @click="answercallAPI()" disabled>
        <option v-for="question in dataquestion" :value="question._id">
          {{ question.message }}
        </option>
      </select>
    </div>
    <div class="form-group" v-if="questionuid != ''">
      <label for="group">Group :</label>
      <div v-for="group in dataquestion">
        <input v-if="questionuid == group._id" type="text" id="group" name="group" v-model="groupupdate"
          :placeholder="group.group" />
      </div>
    </div>
    <div class="form-group" v-if="questionuid != ''">
      <label for="ans">Answer :</label>
      <div>
        <input v-if="questionuid == dataanswer.id_question" type="text" id="ans" name="ans" v-model="answerupdate"
          :placeholder="dataanswer.message" />
      </div>
    </div>
    <div class="form-group">
      <button type="submit" @click="updateAnswerAPI">Submit</button>
    </div>
  </div>
</template>

<script lang="js">
import axios from 'axios';
import { useDataStore } from '../store/store'

export default {
  data() {
    return {
      dataquestion: [],
      dataanswer: [],
      questionuid: "",
      answerupdate: "",
      groupupdate: "",
      token: localStorage.getItem('token'),
    }
  },
  setup() {
    const datastore = useDataStore()
    return { datastore }
  },
  created() {
    var data = '';
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/qa/showquestion',
      headers: {},
      data: data
    };
    axios(config)
      .then((response) => {
        if (response.data.data.length != 0) {
          this.dataquestion = response.data.data
        } else {
          this.dataquestion = [{ message: "Not found question !" }]
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    updateAnswerAPI() {
      this.datastore.setloading(true)
      var data = JSON.stringify({
        "questionid": this.questionuid,
        "answer": this.answerupdate,
        "group": this.groupupdate,
      });

      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/qa/ansupdate',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios(config)
        .then((response) => {
          setTimeout(() => {
            this.datastore.setloading(false)
            this.$toast.success(`SUCCESS`, {
              position: "top",
            });
          }, 2000);
          this.questionuid = ""
          this.answerupdate = ""
          this.groupupdate = ""
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    answercallAPI() {
      if (this.questionuid != "") {
        let data = JSON.stringify({
          "questionid": this.questionuid
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/qa/showansbyuserid',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          data: data
        };

        axios.request(config)
          .then((response) => {
            this.dataanswer = response.data.data
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  }
}
</script>
