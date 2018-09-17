import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import mixin from 'js/mixin.js'
import Volecity from 'velocity-animate'

let vm = new Vue({
    el: '#app',
    data: {
        cartLists: null,
        total: 0,
        editingShop: null,
        editingIndex: -1,
        removePopup: false,
        removeMsg: ''
    },
    created() {
        this.getCartLists()
    },
    computed: {
        allSelected: {
            get() {
                if (this.cartLists && this.cartLists.length) {
                    return this.cartLists.every(shop => {
                        return shop.checked
                    })
                }
                return false
            },
            set(newVal) {
                this.cartLists.forEach(shop => {
                    shop.checked = newVal
                    shop.goodsList.forEach(good => {
                        good.checked = newVal
                    })
                })
            }
        },
        selectLists() {
            if (this.cartLists && this.cartLists.length) {
                let arr = []
                let total = 0
                this.cartLists.forEach(shop => {
                    shop.goodsList.forEach(good => {
                        if (good.checked) {
                            arr.push(good)
                            total += good.price * good.number
                        }
                    })
                })
                this.total = total
                return arr
            }
            return []
        },
        allRemoveSelected: {
            get() {
                if (this.editingShop) {
                    return this.editingShop.removeChecked
                }
                return false
            },
            set(newVal) {
                if (this.editingShop) {
                    this.editingShop.removeChecked = newVal
                    this.editingShop.goodsList.forEach(good => {
                        good.removeChecked = newVal
                    })
                }
            }
        },
        removeLists() {
            if (this.editingShop) {
                let arr = []
                this.editingShop.goodsList.forEach(good => {
                    if (good.removeChecked) {
                        arr.push(good)
                    }
                })
                return arr
            }
            return []
        }

    },
    methods: {
        getCartLists() {
            axios.post(url.cartLists).then((res) => {
                //响应式 先处理后赋值
                let lists = res.data.cartList
                lists.forEach(shop => {
                    shop.checked = true
                    shop.removeChecked = false
                    shop.editing = false
                    shop.editingMsg = '编辑'
                    shop.goodsList.forEach(good => {
                        good.checked = true
                        good.removeChecked = false
                    })
                })
                this.cartLists = lists
            })
        },
        selectGood(shop, good) {
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            good[attr] = !good[attr]
            shop[attr] = shop.goodsList.every((good) => {
                return good[attr]
            })
        },
        selectShop(shop) {
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            shop[attr] = !shop[attr]
            shop.goodsList.forEach(good => {
                good[attr] = shop[attr]
            })
        },
        selectAll() {
            let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected'
            this[attr] = !this[attr]
        },
        edit(shop, shopIndex) {
            shop.editing = !shop.editing
            shop.editingMsg = shop.editing ? '完成' : '编辑'
            this.cartLists.forEach((item, index) => {
                if (index != shopIndex) {
                    item.editing = false
                    item.editingMsg = shop.editing ? '' : '编辑'
                }
            })
            this.editingShop = shop.editing ? shop : null
            this.editingIndex = shop.editing ? shopIndex : -1
        },
        reduce(good) {
            if (good.number === 1) return
            axios.post(url.cartReduce, {
                id: good.id,
                number: 1
            }).then((res) => {
                good.number -= 1
            })
        },
        add(good) {
            axios.post(url.addCart, {
                id: good.id,
                number: 1
            }).then((res) => {
                good.number += 1
            })
        },
        remove(shop, shopIndex, good, goodIndex) {
            this.removePopup = true
            this.removeData = { shop, shopIndex, good, goodIndex }
            this.removeMsg = '确定要删除该商品吗?'
        },
        removeMore() {
            this.removePopup = true
            this.removeMsg = `确定将所选 ${this.removeLists.length} 个商品删除吗`
        },
        removeConfirm() {
            if (this.removeMsg === '确定要删除该商品吗?') {
                let { shop, shopIndex, good, goodIndex } = this.removeData
                axios.post(url.cartRemove, {
                    shop, shopIndex, good, goodIndex
                }).then((res) => {
                    shop.goodsList.splice(goodIndex, 1)
                    if (!shop.goodsList.length) {
                        this.cartLists.splice(shopIndex, 1)
                        this.afterRemoveShop()
                    }
                    this.removePopup = false
                })
            } else {
                let ids = []
                this.removeLists.forEach(good => {
                    ids.push(good.id)
                })
                axios.post(url.cartMremove, {
                    ids
                }).then((res) => {
                    let arr = []
                    this.editingShop.goodsList.forEach(good => {
                        let index = this.removeLists.findIndex(item => {
                            return item.id === good.id
                        })
                        if (index === -1) {
                            arr.push(good)
                        }
                    })
                    if (arr.length) {
                        this.editingShop.goodsList = arr
                    } else {
                        this.cartLists.splice(this.editingIndex, 1)
                        this.afterRemoveShop()
                    }
                    this.removePopup = false
                })
            }
        },
        afterRemoveShop() {
            this.editingShop = null
            this.editingIndex = -1
            this.cartLists.forEach(shop => {
                shop.editing = false
                shop.editingMsg = '编辑'
            })
        },
        start(e, good) {
            good.startX = e.changedTouches[0].clientX
        },
        end(e, shopIndex, good, goodIndex) {
            let endX = e.changedTouches[0].clientX
            let left = '0'
            if (good.startX - endX > 100) {
                left = '-60px'
            }
            if (endX - good.startX > 100) {
                left = '0px'
            }
            Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
                left
            })
        }
    },
    mixins: [mixin]
})