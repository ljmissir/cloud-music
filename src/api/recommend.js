import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommendSwiperData() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    // es6 assign方法，可以把多个对象assign成一个对象
    const data = Object.assign({}, commonParams, {
        // 这些参数不是非必须的，可和后台一起定义
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options)
}

// 从qq音乐抓取首页推荐歌单，需要设置referer代理
export function getDiscList(sin, ein) {
    const url = '/api/getDiscList'
    const data = Object.assign({}, commonParams, {
        picmid: 1,
        rnd: Math.random(),
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0,
        categoryId: 136,
        sortId: 5,
        sin: sin,
        ein: ein
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 抓取歌单对应歌曲内容
export function getDiscSongList(dissid) {
    const url = '/api/getDiscSongList'
    const data = Object.assign({}, commonParams, {
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid: dissid,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}
