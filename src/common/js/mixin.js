import {mapGetters, mapActions, mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// 播放器底部高度自适应通用代码
export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted () {
        this.handlePlayList(this.playList)
    },
    // keep-alive触发时调用activated
    activated () {
        this.handlePlayList(this.playList)
    },
    watch: {
        playList (newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList () {
            throw new Error('compoonent must implement handlePlayList method')
        }
    }
}

// 播放器相关通用代码
export const playerMixin = {
    computed: {
        // 提取出组件共用的mapGetters
        ...mapGetters([
            'mode',
            'currentSong',
            'sequenceList',
            'playList',
            'favoriteList'
        ]),
        // 计算属性，通过vuex state中mode的值，来动态返回对应的class
        modeIcon () {
            return this.mode === playMode.sequence ? 'icon-shunxubofang' : this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-bofangye-caozuolan-suijibofang'
        }
    },
    methods: {
        // 提取出组件共用mapMutations和mapActions
        ...mapMutations({
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayingState: 'SET_PLAYING_STATE'
        }),
        ...mapActions([
            'saveFavoriteSong',
            'deleteFavoriteSong'
        ]),
        // 切换播放模式
        changeMode () {
             // 有三种播放模式，取当前mode值对3取余得到新mode值
            const mode = (this.mode + 1) % 3
            // 要更改state中的mode值，先得在mapMutatios中定义方法，即提交commit，然后再调用
            this.setPlayMode(mode)

            let list = null
            if (this.mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        // 当切换播放模式时，要保证当前播放歌曲不被切换
        resetCurrentIndex (list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        // 检查当前播放歌曲在本地是否已收藏,并返回一个Boolean值,已收藏返回true，否则返回false
        isFavorite (song) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === song.id
            })
            return index > -1
        },
        // 如果该歌曲被收藏则调用这个action deleteFavoriteSong(song) 来提交mutation ,否则调用saveFavoriteSong(song)
        toggleFavorite (song) {
            if (this.isFavorite(song)) {
                this.deleteFavoriteSong(song)
            } else {
                this.saveFavoriteSong(song)
            }
        },
        // 根据当前歌曲是否已被收藏来动态改变收藏图标的class
        getFavoriteIcon (song) {
            if (this.isFavorite(song)) {
                return 'icon-xihuan'
            } else {
                return 'icon-xihuan1'
            }
        }
    }
}

// 搜索部分mixin
export const searchMixin = {
    data () {
        return {
            query: ''
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        // search-box组件向外派发的query事件
        onQueryChange (query) {
            this.query = query
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        saveSearch (item) {
            this.saveSearchHistory(this.query)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSelfSearch'
        ])
    }
}