import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods.transition.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import mixin from 'js/mixin.js'
import Swipe from 'components/Swipe.vue'

let { id } = qs.parse(location.search.substr(1))

let tabLists = ['商品详情', '本店成交']

let vm = new Vue({
    el: '#app',
    data: {
        id,
        details: null,
        tabLists,
        tabIndex: 0,
        showTab: false,
        dealLists: null,
        bannerLists: null,
        skuType: 1,
        showSku: false,
        skuNum: 1,
        isAddCart: false,
        successMsg: false
    },
    created() {
        this.getDetailLists()
    },
    methods: {
        getDetailLists() {
            axios.post(url.details, { id }).then((res) => {
                this.details = res.data.data
                this.bannerLists = []
                this.details.imgs.forEach(item => {
                    this.bannerLists.push({
                        clickUrl:'',
                        img: item
                    })
                })
            })
        },
        changeTab(index) {
            this.tabIndex = index
            if(index) {
                this.getDealLists()
            }
        },
        getDealLists() {
            axios.post(url.dealLists).then((res)=> {
                this.dealLists = res.data.data.lists
            })
        },
        selectSku(type) {
            this.skuType = type
            this.showSku = true
        },
        changeSkuNum(num) {
            if(num < 0 && this.skuNum === 1) return
            this.skuNum += num
        },
        addCart() {
            axios.post(url.addCart, {
                id,
                number: this.skuNum
            }).then((res) => {
                if(res.data.status === 200) {
                    this.showSku = false
                    this.isAddCart = true
                    this.successMsg = true
                    setTimeout(() => {
                        this.successMsg = false
                    }, 1500);
                }
            })
        }
    },
    components: {
        Swipe
    },
    watch: {
        showSku(val, oldVal) {
            document.body.style.overflow = val ? 'hidden' : 'auto'
            document.querySelector('html').style.overflow = val ? 'hidden' : 'auto'
            document.body.style.height = val ? '100%' : 'auto'
            document.querySelector('html').style.height = val ? '100%' : 'auto'
        }
    },
    mixins: [mixin]
})
