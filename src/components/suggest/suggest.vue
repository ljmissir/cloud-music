<!--  -->
<template>
    <scroll class="suggest-wrapper" :data="result" :pullup="pullup" @scrollToEnd="loadMoreData" ref="searchScroll">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
                <div class="icon-wrapper">
                    <i class="icon iconfont" :style="getBackground(item)" :class="getIconCls(item)"></i>
                </div>
                <div class="song-name">
                    <p v-html="getDisPlayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title="拼命加载中..." class="load-more"></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script type='text/ecmascript-6'>
    import {getHotSongList} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Loading from 'base/loading/loading'
    import {getSongVkey} from 'api/singer'
    import Scroll from 'base/scroll/scroll'
    import Singer from 'common/js/singer'
    import {mapMutations, mapActions} from 'vuex'
    import NoResult from 'base/no-result/no-result'
    import {createSong} from 'common/js/songs'

    // perpage为每次搜索请求的每页数据条数
    const perpage = 20
    const TYPE_SINGER = 'singer'

    export default {
        props: {
            query: {
                type: String,
                default: ''
            },
            // 是否展示搜索歌手
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                page: 1,
                result: [],
                // 设置一个标志位，判断是否还可以加载更多
                hasMore: true,
                // 是否触发上拉加载事件
                pullup: true
            }
        },
        methods: {
            refresh () {
                this.$refs.searchScroll.refresh()
            },
            // 获取首页数据
            _getHotSongList () {
                this.page = 1
                this.hasMore = true
                const result = getHotSongList(this.query, this.page, this.showSinger, perpage)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this._resolveResult(res.data)
                        this._checkHasMore(res.data)
                    }
                })
            },
            // 上拉加载更多
            loadMoreData () {
                if (!this.hasMore) {
                    return
                }
                this.page++
                const result = getHotSongList(this.query, this.page, this.showSinger, perpage)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this.result.concat(this._resolveResult(res.data))
                        this._checkHasMore(res.data)
                    }
                })
            },
            // 当没有list列表时，或当当前数据加页数*每页的perpage数相加大于或等于song.totalnum时，表示没有更多数据可供加载
            _checkHasMore (data) {
                const song = data.song
                if (!song.list.length || song.curnum / 2 + song.curpage * perpage >= song.totalnum) {
                    this.hasMore = false
                }
            },
            _resolveResult (data) {
                console.log(data)
                let ret = []
                if (data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                }
                if (data.song) {
                    ret = ret.concat(this._normalLizeData(data.song.list))
                }
                return ret
            },
            _normalLizeData (list) {
                let ret = []
                list.forEach((item) => {
                    let {musicData} = item
                    getSongVkey(musicData.songmid).then((res) => {
                        const vkey = res.data.items[0].vkey;
                        if (musicData.songid && musicData.albummid) {
                            ret.push(createSong(musicData, vkey))
                        }
                    })
                })
                return ret
            },
            getIconCls (item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-singer'
                } else {
                    return 'icon-music'
                }
            },
            getBackground (item) {
                if (item.type === TYPE_SINGER) {
                    return `background: url(https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.jpg?max_age=2592000) center center`
                }
            },
            getDisPlayName (item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                } else {
                    return `${item.name} - ${item.singer}`
                }
            },
            selectItem (item) {
                // 如果搜索的是歌手，点击的是歌手，则进入歌手搜索页面
                if (item.type === TYPE_SINGER) {
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    })
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    this.setSinger(singer)
                } else {
                    this.insertSong(item)
                }
                this.$emit('select', item)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        },
        watch: {
            query () {
                this._getHotSongList()
            }
        },
        components: {
            Scroll,
            Loading,
            NoResult
        }
    }
</script>

<style lang='less' scoped>
    .suggest-wrapper {
        height: 100%;
        overflow: hidden;
        padding: 0 2rem;
        position: relative;
        .suggest-list {
            .suggest-item {
                display: flex;
                align-items: center;
                padding-bottom: 2rem;
                font-size: 1.4rem;
                color: rgba(255, 255, 255, 0.8);
                .icon-wrapper {
                    width: 3rem;
                    height: 3rem;
                    display: flex;
                    align-items: center;
                    margin-right: .6rem;
                    .icon-singer {
                        border-radius: 50%;
                        display: inline-block;
                        width: 3rem;
                        height: 3rem;
                        background-size: 100% 100% !important;
                    }
                }
                .song-name {
                    flex: 1;
                }
            }
            .load-more {
                padding-bottom: 2rem;
            }
        }
        .no-result-wrapper {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%)
        }
    }
</style>