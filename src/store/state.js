import {playMode} from 'common/js/config'
import {loadSearchHistory, loadFavorite, loadPlayHistory} from 'common/js/cache'

// 声明state初始值
const state = {
    // 歌手信息
    singer: {},
    // 播放和暂停状态，默认为false
    playing: false,
    // 是否设为全屏播放，默认为false，即默认为迷你播放器
    fullScreen: false,
    // 默认播放列表，默认设为空
    playList: [],
    // 顺序播放列表，默认设为空
    sequenceList: [],
    // 播放模式,默认设置为顺序播放
    mode: playMode.sequence,
    currentIndex: -1,
    // 推荐页面歌单
    disc: {},
    // 排行榜
    topList: {},
    // 搜索历史
    searchHistory: loadSearchHistory(),
    // 喜欢的歌曲收藏到本地
    favoriteList: loadFavorite(),
    playListHistory: loadPlayHistory()
}

export default state

/*
    Vuex的用法，首先先在state.js中设置一个全局管理的状态
*/