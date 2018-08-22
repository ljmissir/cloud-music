<!--  -->
<template>
    <transition name="slide">
        <div class="add-songs-wrapper" @click.stop v-show="showFlag">
            <div class="search-box-wrapper">
                <i class="icon iconfont icon-fanhuijiantou" @click.stop="hide"></i>
                <search-box ref="searchBox" @query="onQueryChange" :placeholder="placeholder"></search-box>
            </div>
            <div class="query-wrapper" v-show="!query">
                <div class="header">
                    <switch-item 
                        :currentIndex="currentIndex" 
                        :switchList="switchList" 
                        @changeItem="switchIndex">
                    </switch-item>
                </div>
                <div class="playing-song-wrapper">
                    <scroll ref="songList" v-if="currentIndex === 0 && !query" class="list-container" :data="playListHistory">
                        <div class="list-view">
                            <song-list :songs="playListHistory" @select="selectItem"></song-list>
                        </div>
                    </scroll>
                    <scroll ref="searchList" v-if="currentIndex === 1 && !query" class="list-container" :data="searchHistory">
                        <div class="list-view">
                            <search-list :searchs="searchHistory" @delete="deleteSelfSearch" @selectCurrent="addQuery"></search-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="no-result-wrapper" v-show="!noResult">
                <no-result :title="noResultDesc"></no-result>
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" @select="selectSuggest" :showSinger="showSinger"></suggest>
            </div>
            <top-tip ref="topTip">
                <div class="title-wrapper">
                    <i class="icon iconfont icon-xuanze"></i>
                    <span class="title">1首歌曲已添加到播放列表</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>

<script type='text/ecmascript-6'>
    import SwitchItem from 'base/switch-item/switch-item'
    import SearchBox from 'base/search-box/search-box'
    import SearchList from 'base/search-list/search-list'
    import Suggest from 'components/suggest/suggest'
    import SongList from 'base/songList/songList'
    import Scroll from 'base/scroll/scroll'
    import {mapGetters, mapActions} from 'vuex'
    import {searchMixin} from 'common/js/mixin'
    import NoResult from 'base/no-result/no-result'
    import Song from 'common/js/songs'
    import TopTip from 'base/top-tip/top-tip'

    export default {
        mixins: [searchMixin],
        data () {
            return {
                showFlag: false,
                currentIndex: 0,
                switchList: ['最近播放', '搜索历史'],
                placeholder: '搜索歌曲',
                showSinger: false
            }
        },
        computed: {
            ...mapGetters([
                'playListHistory'
            ]),
            noResultDesc () {
                return this.currentIndex === 0 ? '暂无播放历史' : '暂无搜索历史'
            },
            noResult () {
                return this.currentIndex === 0 ? this.playListHistory.length : this.searchHistory.length
            }
        },
        methods: {
            show () {
                this.showFlag = true
                setTimeout(() => {
                    if (this.currentIndex === 0) {
                        this.$refs.songList.refresh()
                    } else {
                        this.$refs.searchList.refresh()
                    }
                }, 20)
            },
            hide () {
                this.showFlag = false
            },
            switchIndex (index) {
                this.currentIndex = index
            },
            selectItem (item, index) {
                if (index !== 0) {
                    this.insertSong(new Song(item))
                    this.$refs.topTip.show()
                }
            },
            selectSuggest () {
                this.$refs.topTip.show()
                this.saveSearch()
            },
            ...mapActions([
                'insertSong'
            ])
        },
        components: {
            SwitchItem,
            SearchBox,
            SearchList,
            Suggest,
            Scroll,
            SongList,
            NoResult,
            TopTip
        }
    }
</script>

<style lang='less' scoped>
    .add-songs-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        background: #222;
        z-index: 200;
        &.slide-enter-active, &.slide-leave-active {
            transition: all .4s;
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(100%, 0, 0);
        }
        .query-wrapper {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .search-box-wrapper {
            margin: 1rem 2rem 2rem 4rem;
            position: relative;
            .icon {
                position: absolute;
                left: -2rem;
                top: 50%;
                transform: translate(0, -50%);
                color: #fff;
                font-size: 2rem;
            }
        }
        .header {
            margin: 1rem 0 3rem 0;
            height: 4.4rem;
            position: relative;
        }
        .playing-song-wrapper {
            position: absolute;
            top: 13rem;
            bottom: 0;
            padding: 0 2rem;
            box-sizing: border-box;
            width: 100%;
            .list-container {
                height: 100%;
                overflow: hidden;
            }
        }
        .no-result-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .search-result {
            position: fixed;
            top: 6rem;
            bottom: 0;
            width: 100%;
        }
        .title-wrapper {
            text-align: center;
            font-size: 1.2rem;
            line-height: 4rem;
            color: rgb(8, 221, 90);
        }
    }
</style>