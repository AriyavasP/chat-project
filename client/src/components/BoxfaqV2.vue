<template>
    <div>
        <div class="faqs-container">
            <div class="faqs-header">
                <h1>FAQS</h1>
                <p>About...</p>
            </div>
            <div class="faqs-content">
                <div class="faqs-content-box" v-for="(item, index) in dataQA.slice(0, limit)">
                    <div>
                        Q:{{ item.Q }}
                    </div>
                    <div>
                        A:{{ item.A }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import axios from 'axios';

export default {
    data() {
        return {
            dataQA: [],
            limit: 5,
        }
    },
    beforeCreate() {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/qa/showallqa',
            headers: {}
        };
        axios(config)
            .then((response) => {
                this.dataQA = response.data.data
                this.sort();
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        sort() {
            this.dataQA = this.dataQA.sort((a, b) => { return b.count - a.count })
        }
    }
}
</script>