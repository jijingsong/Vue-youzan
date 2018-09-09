let url = {
    hotLists: '/index/hotLists',
    bannerLists: '/index/banner',
    topLists: '/category/topList',
    rank: '/category/rank',
    subLists: '/category/subList'
}

let host = 'http://rap2api.taobao.org/app/mock/7058'

for (const key in url) {
    if (url.hasOwnProperty(key)) {
        url[key] = host + url[key]
    }
}

export default url