import axios from 'axios'

let fetch = function (url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then((res) => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}

export default fetch