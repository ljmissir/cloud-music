// 获取在指定区间的一个随机整数
function getRandomNum(min, max) {
    // Math.floor()向下舍入，不是四舍五入
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌函数，打乱数组排序
export function shuffle (arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomNum(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}

// 节流函数，输入框，当输入值改变时会连续触发请求后台接口，浪费带宽
export function deRequest(func, delay) {
    let timer = null
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            return func.apply(this, args)
        }, delay)
    }
}