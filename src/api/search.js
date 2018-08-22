import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

// 热门搜索关键词接口
export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        _: +new Date()
    })
    return jsonp(url, data, options)
}

// 热门搜索列表，通过关键词触发,这里做分页请求，实现上拉刷新加载更多
export function getHotSongList(keyWord, page, zhida, perpage) {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        w: keyWord,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: perpage,
        n: perpage,
        p: page,
        remoteplace: 'txt.mqq.all',
        _: +new Date()
    })
    return jsonp(url, data, options)
}