import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const MAX_SEARCH_LEN = 50

const FAVORITE_KEY = '__favorite__'
const MAX_FAVORITE_LEN = 200

const PLAY_HISTORY_KEY = '__play_history__'
const MAX_PLAY_HISTORY_LEN = 200

// 往数组中插入一个新元素
function insertArray(arr, val, compare, maxlen) {
    let index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    // 在数组顶部插入新元素
    arr.unshift(val)
    if (maxlen && arr.length >= maxlen) {
        // 从数组末尾删除最后一个元素
        arr.pop()
    }
}

// 删除当前选中的搜索历史
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// 保存搜索历史到本地localstorage中
export function saveSearch(query) {
    let searchs = storage.get(SEARCH_KEY, [])
    insertArray(searchs, query, (item) => {
        return item === query
    }, MAX_SEARCH_LEN)
    storage.set(SEARCH_KEY, searchs)
    return searchs
}

// 从localStorage中删除当前选中选项
export function deleteOneSearch(query) {
    let searchs = storage.get(SEARCH_KEY, [])
    deleteFromArray(searchs, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searchs)
    return searchs
}

// 从本地localstorage中清空保存的搜索历史
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

// 把喜欢的歌曲收藏到本地
export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, MAX_FAVORITE_LEN)
    storage.set(FAVORITE_KEY, songs)
    return songs
}

// 取消收藏当前已收藏的歌曲
export function deleteSaveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    deleteFromArray(songs, (item) => {
        return item.id === song.id
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}

// 本地播放历史
export function playHistory(song) {
    let songs = storage.get(PLAY_HISTORY_KEY, [])
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, MAX_PLAY_HISTORY_LEN)
    storage.set(PLAY_HISTORY_KEY, songs)
    return songs
}

// 当检查本地有误搜索历史缓存时而提交mutations时，先调用storage.get(SEARCH_KEY, [])
export function loadSearchHistory() {
    return storage.get(SEARCH_KEY, [])
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}

export function loadPlayHistory() {
    return storage.get(PLAY_HISTORY_KEY, [])
}