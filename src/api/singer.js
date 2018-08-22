import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

// 获取歌手列表信息
export function getSingerList(page, pagesize) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        pagesize: pagesize,
        key: 'all_all_all',
        pagenum: page,
        needNewCode: 0,
        platform: 'yqq',
        loginUin: 0,
        hostUin: 0
    })
    return jsonp(url, data, options)
}

// 获取歌手歌曲信息
export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 200,
        songstatus: 1,
        singermid: singerId
    })
    return jsonp(url, data, options)
}

// 获取歌曲歌词
export function getSongLyrics(songId) {
    const url = '/api/lyrics'
    const data = Object.assign({}, commonParams, {
        songmid: songId,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}