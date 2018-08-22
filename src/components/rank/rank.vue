<!-- 排行组件 -->
<template>
    <div class="rank-wrapper" ref="rankWrapper">
        <scroll class="rank-song-list" :data="songs" ref="topList">
            <ul class="top-list-wrapper">
                <li class="list-item" v-for="(item, index) in songs" :key="index" @click="selectItem(item)">
                    <div class="pic-wrapper">
                        <img v-lazy="item.picUrl" width="100" height="100" alt="">
                    </div>
                    <ul class="song-list">
                        <h2 class="top-title">{{item.topTitle}}</h2>
                        <li v-for="(itemList, index) in item.songList" :key="index">
                            <span>{{index + 1}} {{itemList.songname}} - {{itemList.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-containers" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script type='text/ecmascript-6'>
    import {getRankSingersData} from 'api/rank'
    import {ERR_OK} from 'api/config'
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import {playListMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'

    export default {
        mixins: [playListMixin],
        data () {
            return {
                songs: []
            }
        },
        created () {
            this._getRankSingersData()
        },
        methods: {
            handlePlayList (playList) {
                const bottom = playList.length > 0 ? '60px' : '0px'
                this.$refs.rankWrapper.style.bottom = bottom
                this.$refs.topList.refresh()
            },
            _getRankSingersData () {
                const result = getRankSingersData()
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = res.data.topList
                    }
                })
            },
            selectItem (item) {
                this.$router.push({
                    path: `/rank/${item.id}`
                })
                this.setTopList(item)
            },
            ...mapMutations({
                setTopList: 'SET_TOP_LIST'
            })
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style lang='less' scoped>
    .rank-wrapper {
        width: 100%;
        position: fixed;
        left: 0;
        top: 9.2rem;
        bottom: 0;
        .rank-song-list {
            height: 100%;
            overflow: hidden;
            background: #222;
            padding: 0 1rem;
            box-sizing: border-box;
            .top-list-wrapper {
                .list-item {
                    padding: 1rem;
                    background: #333;
                    margin-bottom: 1.4rem;
                    display: flex;
                    align-items: center;
                    .pic-wrapper {
                        padding-right: 1.5rem;
                        img {
                            display: block;
                        }
                    }
                    .song-list {
                        .top-title {
                            font-size: 1.4rem;
                            color: #fff;
                            padding-bottom: .6rem;
                        }
                        width: 17.6rem;
                        li {
                            color: rgba(255, 255, 255, 0.6);
                            width: 90%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 1.2rem;
                            &:nth-child(3) {
                                padding: .4rem 0;
                            }
                        }
                    }
                }
            }
            .loading-containers{
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
</style>