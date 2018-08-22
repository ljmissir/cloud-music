import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getRankSingersData() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url, data, options)
}

export function getRankListSongs(id) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const data = Object.assign({}, commonParams, {
        patform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: id,
        _: +new Date()
    })
    return jsonp(url, data, options)
}