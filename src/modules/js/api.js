let url = {
    hotLists: '/index/hotLists',
    bannerLists: '/index/banner',
    topLists: '/category/topList',
    rank: '/category/rank',
    subLists: '/category/subList',
    searchLists: '/search/list',
    details: '/goods/details',
    dealLists: '/goods/deal',
    cartLists: '/cart/list',
    addCart: '/cart/add',
    cartReduce: '/cart/reduce',
    cartRemove: '/cart/remove',
    cartMremove: '/cart/mrremove',
    addresLists: '/address/list',
    addressRemove: '/address/remove',
    addressAdd: '/address/add',
    addressUpdate: '/address/update',
    addressSetDefault: '/address/setDefault'
}

let host = 'http://rap2api.taobao.org/app/mock/7058'

for (const key in url) {
    if (url.hasOwnProperty(key)) {
        url[key] = host + url[key]
    }
}

export default url