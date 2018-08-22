<!--  -->
<template>
    <transition name="slide">
        <div class="user-info-wrapper">
            <div class="top">
                <i @click="back" class="icon iconfont icon-fanhuijiantou"></i>
                <switch-item @changeItem="switchIndex" :currentIndex="currentIndex" :switchList="switchList"></switch-item>
            </div>
            <div class="play-wrapper" ref="playBtn">
                <div class="play-btn" @click.stop="randomPlayList">
                    <i class="icon iconfont icon-bofang"></i>
                    <span>随机播放全部</span>
                </div>
            </div>
            <div class="song-list-wrapper" ref="songListWrapper">
                <!-- 我喜欢的音乐 -->
                <scroll v-if="currentIndex === 0" class="favorite-list-wrapper" :data="favoriteList" ref="favoriteScroll">
                    <song-list :songs="favoriteList" @select="selectItem"></song-list>
                </scroll>
                <!-- 播放历史 -->
                <scroll v-if="currentIndex === 1" class="favorite-list-wrapper" :data="playListHistory" ref="favoriteScroll">
                    <song-list :songs="playListHistory" @select="selectItem"></song-list>
                </scroll>
                <div class="no-result-wrapper" v-show="!noResult">
                    <no-result :title="noResultDesc"></no-result>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type='text/ecmascript-6'>
    import {mapGetters, mapActions} from 'vuex'
    import SongList from 'base/songList/songList'
    import Scroll from 'base/scroll/scroll'
    import {playListMixin} from 'common/js/mixin'
    import Song from 'common/js/songs'
    import NoResult from 'base/no-result/no-result'
    import SwitchItem from 'base/switch-item/switch-item'

    export default {
        mixins: [playListMixin],
        data () {
            return {
                switchList: ['我喜欢的', '最近播放'],
                currentIndex: 0
            }
        },
        computed: {
            ...mapGetters([
                'favoriteList',
                'playListHistory'
            ]),
            noResult () {
                if (this.currentIndex === 0) {
                    return this.favoriteList.length
                } else {
                    return this.playListHistory.length
                }
            },
            noResultDesc () {
                if (this.currentIndex === 0) {
                    return '暂无收藏歌曲，快去收藏吧'
                } else {
                    return '您还没有听过歌曲'
                }
            }
        },
        methods: {
            handlePlayList(list) {
                const bottom = list.length > 0 ? '6rem' : ''
                this.$refs.songListWrapper.style.bottom = bottom
                this.$refs.favoriteScroll.refresh()
            },
            back () {
                this.$router.back()
            },
            switchIndex (index) {
                this.currentIndex = index
            },
            selectItem (item, index) {
                this.insertSong(new Song(item))
            },
            randomPlayList () {
                let list = this.currentIndex === 0 ? this.favoriteList : this.playListHistory
                if (list.length === 0) {
                    return
                }
                list = list.map((item) => {
                    return new Song(item)
                })
                this.randomPlay({
                    list
                })
            },
            ...mapActions([
                'insertSong',
                'randomPlay'
            ])
        },
        components: {
            SongList,
            Scroll,
            NoResult,
            SwitchItem
        }
    }
</script>

<style lang='less' scoped>
    .user-info-wrapper {
        position: fixed;
        top:  0;
        left: 0;
        bottom: 0;
        right: 0;
        background: #222;
        width: 100%;
        z-index: 10;
        &.slide-enter-active, &.slide-leave-active {
            transition: all .4s;
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(100%, 0, 0)
        }
        .top {
            margin: 1rem 0 3rem 0;
            box-sizing: border-box;
            height: 3.6rem;
            position: relative;
            line-height: 3.6rem;
            .icon {
                color: #fff;
                position: absolute;
                left: 2rem;
                font-size: 2rem;
            }
        }
        .play-wrapper {
            text-align: center;
            width: 100%;
            z-index: 20;
            .play-btn {
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid #fff;
                color:  #fff;
                border-radius: 100px;
                .icon {
                    padding-right: .4rem;
                }
                span {
                    font-size: 1.2rem;
                }
            }
        }
        .song-list-wrapper {
            width: 100%;
            position: fixed;
            top: 12.8rem;
            bottom: 0;
            padding: 0 2rem;
            box-sizing: border-box;
            .favorite-list-wrapper {
                height: 100%;
                overflow: hidden;
            }
            .no-result-wrapper {
                width: 100%;
                text-align: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
</style>