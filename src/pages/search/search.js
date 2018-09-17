import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'

let {keyword, id} = qs.parse(location.search.substr(1))

let vm = new Vue({
    el: '#app',
    data: {
        searchLists: null,
        keyword,
        id,
        isShow: false
    },
    created() {
        this.getSearchList()
    },
    methods: {
        getSearchList() {
            axios.post(url.searchLists, {
                keyword,
                id
            }).then((res) => {
                this.searchLists = res.data.lists
            })
        },
        move() {
            if(window.scrollY > 100) {
                this.isShow = true
            } else {
                this.isShow = false
            }
        },
        goToTop() {
            Velocity(document.body,'scroll', { duration: 1000 })
            this.isShow = false
        }
    },
    mixins: [mixin]
})