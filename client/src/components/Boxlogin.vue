<template>
    <div class="box-form">
        <div class="left">
            <div class="overlay">
            </div>
        </div>
        <div class="right">
            <h5>Login</h5>
            <div class="inputs">
                <input v-model="username" type="text" placeholder="username" required>
                <br>
                <input v-model="password" type="password" placeholder="password" required>
            </div>

            <br><br>

            <button @click="login">LOGIN</button>
            <div class="remember-me--forget-password">
            </div>
        </div>
    </div>
</template>

<script lang="js">
import router from '../router';
import axios from 'axios';

export default {
    data() {
        return {
            username: "",
            password: "",
        }
    },
    methods: {
        login() {
            var data = JSON.stringify({
                "username": this.username,
                "password": this.password
            });

            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:3000/user/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then((response) => {
                    localStorage.setItem('token', response.data.data.token)
                    localStorage.setItem('userid', response.data.data.user._id)
                    localStorage.setItem('role', response.data.data.user.role)
                    this.$toast.success(`SUCCESS`, {
                        position: "top"
                    });
                    router.push("/home")
                })
                .catch((error) => {
                    this.$toast.error(`INVALID USER ID OR PASSWORD`,{
                        type: "error",
                        position: "top"
                    });
                    console.log(error.message);
                });
        }
    }

}
</script>