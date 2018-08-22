<!-- 搜索组件 -->
<template>
    <div class="search-wrapper">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="hot-search-history" ref="hotSearchHistory" v-show="!query">
            <scroll class="scroll-list" ref="scrollList">
                <div>
                    <div class="hot-search-words">
                        <h2 class="title">热门搜索</h2>
                        <ul class="hot-search-list">
                            <li @click="addQuery(item.k)" class="hot-search-item" v-for="(item, index) in hotKey" :key="index">
                                {{item.k}}
                            </li>
                        </ul>
                    </div>
                    <div class="search-history-wrapper" v-show="searchHistory.length && !query">
                        <div class="search-title-info">
                            <span>搜索历史</span>
                            <i class="icon iconfont icon-shanchu" @click="showConfirm"></i>
                        </div>
                        <search-list @selectCurrent="addQuery" @delete="deleteSelfSearch" :searchs="searchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest :query="query" @select="saveSearch" ref="suggest"></suggest>
        </div>
        <confirm ref="confirm" @confirm="clearSearchHistory" title="是否清空所有搜索历史" confirmText="清空"></confirm>
        <router-view></router-view>
    </div>
</template>

<script type='text/ecmascript-6'>
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import SearchBox from 'base/search-box/search-box'
    import Suggest from 'components/suggest/suggest'
    import {playListMixin, searchMixin} from 'common/js/mixin'
    import {mapActions} from 'vuex'
    import SearchList from 'base/search-list/search-list'
    import Scroll from 'base/scroll/scroll'
    import Confirm from 'base/confirm/confirm'

    export default {
        mixins: [playListMixin, searchMixin],
        data () {
            return {
                hotKey: [],
                hotSong: []
            }
        },
        created () {
            this._getHotKey()
        },
        computed: {
            
        },
        methods: {
            // 迷你播放器在底部时，要适配底部的bottom值，设为和迷你播放器一样的高度
            handlePlayList (list) {
                const bottom = list.length > 0 ? '6rem' : ''
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()

                this.$refs.hotSearchHistory.style.bottom = bottom
                this.$refs.scrollList.refresh()
            },
            _getHotKey () {
                const result = getHotKey()
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        // 取前10条数据为热门搜索数据
                        this.hotKey = res.data.hotkey.slice(0, 10)
                    }
                })
            },
            showConfirm () {
                this.$refs.confirm.show()
            },
            ...mapActions([
                'clearSearchHistory'
            ])
        },
        watch: {
            query (newQuery) {
                if (!newQuery) {
                    setTimeout(() => {
                        // 从新计算滚动高度
                        this.$refs.scrollList.refresh()
                    }, 20)
                }
            }
        },
        components: {
            SearchBox,
            Suggest,
            SearchList,
            Scroll,
            Confirm
        }
    }
</script>

<style lang='less' scoped>
    .search-wrapper {
        background: #222;
        position: fixed;
        top: 9.2rem;
        left: 0;
        bottom: 0;
        right: 0;
        .search-box-wrapper {
            margin: 2rem;
        }
        .hot-search-history {
            position: fixed;
            top: 17rem;
            bottom: 0;
            .scroll-list {
                height: 100%;
                overflow: hidden;
                .hot-search-words {
                    margin: 0 2rem;
                    .title {
                        line-height: 3rem;
                        font-size: 1.4rem;
                        color: rgba(255, 255, 255, 0.8);
                    }
                    .hot-search-list {
                        .hot-search-item {
                            display: inline-block;
                            border-radius: .6rem;
                            padding: .4rem .8rem;
                            background: #333;
                            color: rgba(255, 255, 255, 0.8);
                            margin: 1.2rem 1.2rem 0 0;
                            font-size: 1.2rem;
                        }
                    }
                }
                .search-history-wrapper {
                    padding: 0 2rem;
                    width: 100%;
                    box-sizing: border-box;
                    margin: 2rem 0;
                    .search-title-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: #fff;
                        font-size: 1.4rem;
                        line-height: 3rem;
                    }
                }
            }
        }
        .search-result {
            position: fixed;
            width: 100%;
            top: 17rem;
            bottom: 0;
        }
    }
</style>