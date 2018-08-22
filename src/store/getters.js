// 获取歌手对象singer
export const singer = state => state.singer

// 获取播放状态值playing
export const playing = state => state.playing

// 获取是否开启全屏播放的state值
export const fullScreen = state => state.fullScreen

// 获取播放列表
export const playList = state => state.playList

// 获取顺序播放列表
export const sequenceList = state => state.sequenceList

// 获取播放模式
export const mode = state => state.mode

// 获取当前播放歌曲的index值
export const currentIndex = state => state.currentIndex

// 当前播放歌曲是根据当前播放列表和当前歌曲索引计算而来
export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}

// 获取推荐页面歌单 disc
export const disc = state => state.disc

// 获取排行榜 topList
export const topList = state => state.topList

// 获取搜索历史
export const searchHistory = state => state.searchHistory

// 获取收藏歌单
export const favoriteList = state => state.favoriteList

// 获取播放历史
export const playListHistory = state => state.playListHistory