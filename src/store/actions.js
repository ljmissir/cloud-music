import * as types from './mutayionTypes'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, clearSearch, deleteOneSearch, saveFavorite, deleteSaveFavorite, playHistory} from 'common/js/cache'

// 一个动作中，多次改变mutation，可以封装一个action，Actions中可以包含任意异步操作

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function ({ commit, state }, {list, index}) {
    // 提交mutation
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAY_LIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAY_LIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
}

// 随机播放
export const randomPlay = function ({commit, state}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, false)
}

// 插入一首歌曲
export const insertSong = function ({commit, state}, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playList[currentIndex]
    // 检查当前列表中是否有待插入的歌曲并返回索引
    let fpIndex = findIndex(playList, song)
    currentIndex++
    // 插入这首歌到当前索引位置,splice()三个参数时，往数组中插入一个或多个元素
    playList.splice(currentIndex, 0, song)
    // 如果已经包含这首歌
    if (fpIndex > -1) {
        // 当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
            playList.splice(fpIndex, 1)
            currentIndex--
        } else {
            playList.splice(fpIndex + 1, 1)
        }
    }
    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }
    // 提交mutation
    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
}

// 搜索历史
export const saveSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 清空搜索历史
export const clearSearchHistory = function ({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除当前搜索历史
export const deleteSelfSearch = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteOneSearch(query))
}

// 收藏喜欢的歌曲到本地
export const saveFavoriteSong = function ({commit}, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 取消收藏
export const deleteFavoriteSong = function ({commit}, song) {
    commit(types.SET_FAVORITE_LIST, deleteSaveFavorite(song))
}

// 播放历史
export const playHistoryList = function ({commit}, song) {
    commit(types.SET_PLAY_HISTORY_LIST, playHistory(song))
}

// 清空播放列表
export const deleteSongList = function ({commit}) {
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAY_LIST, [])
    commit(types.SET_PLAYING_STATE, false)
}

// 删除当前歌曲
export const deleteSong = function ({commit, state}, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playList, song)
    playList.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    // currentIndex > pIndex 表示当前播放歌曲在删除歌曲之后，那删除了歌曲，currentIndex需减1
    if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
    }

    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    if (!playList.length) {
        commit(types.SET_PLAYING_STATE, false)
    } else {
        commit(types.SET_PLAYING_STATE, true)
    }
}