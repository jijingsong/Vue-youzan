import 'css/common.css'
import './index.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);

import Foot from 'components/Foot.vue'
import Swipe from 'components/Swipe.vue'

let app = new Vue({
    el: '#app',
    data: {
        lists: null,
        pageNum: 1,
        pageSize: 6,
        loading: false,
        allLoaded: false,
        bannerLists: null
    },
    created() {
        this.getLists()
        this.getBanner()
    },
    methods: {
        getLists() {
            if(this.allLoaded) return
            this.loading = true
            axios.post(url.hotLists, {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then((res) => {
                let curlists = res.data.lists
                if(curlists.length < this.pageSize) {
                    this.allLoaded = true
                }
                if(this.lists) {
                    this.lists = this.lists.concat(curlists)
                } else {
                    this.lists = curlists
                }
                this.loading = false
                this.pageNum++
            })
        },
        getBanner() {
            axios.get(url.bannerLists).then((res) => {
                this.bannerLists = res.data.lists
            })
        }
    },
    components: {
        Foot,
        Swipe
    }
})