import originJsonp from 'jsonp'

// 把jsonp请求封装成Promise对象
export default function jsonp(url, data, option) {
    // jsonp请求只支持get，get请求会把url暴露在地址栏，url拼接时先检查传入url是否有'?'并调用param(data)完成拼接
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

    return new Promise((resolve, reject) => {
        originJsonp(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

// 私有函数不要对外暴露，该函数是把jsonp请求发送的data数据，拼接成&相连的字符串并返回url字符串
function param(data) {
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += '&' + k + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}
