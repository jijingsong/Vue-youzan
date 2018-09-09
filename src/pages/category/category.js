import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import Foot from 'components/Foot.vue'

let app = new Vue({
    el: '#app',
    data: {
        topLists: null,
        topIndex: 0,
        rankData: null,
        subData: null
    },
    created() {
        this.getTopLists()
        this.getSubList(0)
    },
    methods: {
        getTopLists() {
            axios.post(url.topLists).then((res) => {
                this.topLists = res.data.lists
            })
        },
        getSubList(index, id) {
            this.topIndex = index
            if (index === 0) {
                this.getRank()
            } else {
                axios.post(url.subLists, {
                    id
                }).then((res) => {
                    this.subData = res.data.data
                })
            }
        },
        getRank() {
            axios.post(url.rank).then((res) => {
                this.rankData = res.data.data
            })
        }
    },
    components: {
        Foot
    },
    filters: {
        xx: function (value) {
            var f = parseFloat(value);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(value * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return s;
        }
    }
})