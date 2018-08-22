<!--  -->
<template>
    <transition name="slide-fade">
        <div class="play-list-wrapper" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="operator-wrapper">
                    <div class="random-play">
                        <i 
                            class="icon iconfont"
                            :class="modeIcon"
                            @click="changeMode">
                        </i>
                        <span>{{playModeText}}</span>
                    </div>
                    <div class="remove-wrapper" @click.stop="showConfirm">
                        <i class="icon iconfont icon-shanchu"></i>
                    </div>
                </div>
                <scroll ref="listContent" class="listen-list-wrapper" :data="sequenceList">
                    <!-- vue提供的列表过渡，transition-group，要求li绑定key值 -->
                    <transition-group name="list" ref="listUl" tag="ul" class="ul-group">
                        <li v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
                            <div class="list-operator-wrapper">
                                <i class="icon iconfont" :class="currentPlayingIcon(item)"></i>
                                <span class="song-name">{{item.name}}</span>
                            </div>
                            <div class="list-operator-icon">
                                <i 
                                    @click.stop="toggleFavorite(item)" 
                                    class="icon iconfont icon-love"
                                    :class="getFavoriteIcon(item)">
                                </i>
                                <i class="icon iconfont icon-delete2" @click.stop="deleteSelf(item)"></i>
                            </div>
                        </li>
                    </transition-group>
                </scroll>
                <div class="add-song-wrapper" @click="addSong">
                    <span class="text">添加歌曲到列表</span>
                </div>
                <div class="close-btn" @click="hide">关闭</div>
            </div>
            <confirm ref="confirm" title="确定清空播放列表" @confirm="clearSequenceList"></confirm>
            <add-song ref="addSongs"></add-song>
        </div>
    </transition>
</template>

<script type='text/ecmascript-6'>
    import {mapActions} from 'vuex'
    import Scroll from 'base/scroll/scroll'
    import Confirm from 'base/confirm/confirm'
    import {playMode} from 'common/js/config'
    import {playerMixin} from 'common/js/mixin'
    import AddSong from 'components/add-song/add-song'

    export default {
        mixins: [playerMixin],
        data () {
            return {
                showFlag: false
            }
        },
        computed: {
            // 计算属性，根据vuex中state.mode的值来动态设置对应的文字
            playModeText () {
                return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
            }
        },
        methods: {
            ...mapActions([
                'deleteSongList',
                'deleteSong'
            ]),
            selectItem (item, index) {
                if (this.mode === playMode.random) {
                    index = this.playList.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            currentPlayingIcon (song) {
                if (song.id === this.currentSong.id) {
                    return 'icon-yinlebofang'
                }
            },
            show () {
                this.showFlag = true
                setTimeout(() => {
                    this.$refs.listContent.refresh()
                    this.scrolltoCurrent(this.currentSong)
                }, 20)
            },
            hide () {
                this.showFlag = false
            },
            showConfirm () {
                this.$refs.confirm.show()
            },
            clearSequenceList () {
                this.deleteSongList()
                this.hide()
            },
            scrolltoCurrent (current) {
                const index = this.sequenceList.findIndex((item) => {
                    return current.id === item.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listUl.$el.children[index], 400)
                this.$refs.listContent.refresh()
            },
            deleteSelf (song) {
                if (!this.playList.length) {
                    return
                }
                this.deleteSong(song)
            },
            addSong () {
                this.$refs.addSongs.show()
            }
        },
        components: {
            Scroll,
            Confirm,
            AddSong
        },
        watch: {
            currentSong (newSong, oldSong) {
                if (!this.showFlag || newSong.id === oldSong.id) {
                    return
                }
                setTimeout(() => {
                    this.scrolltoCurrent(newSong)
                }, 20)
            }
        }
    }
</script>

<style lang='less' scoped>
    .play-list-wrapper {
        background: rgba(0, 0, 0, 0.5);
        z-index: 200;
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        &.slide-fade-enter-active, &.slide-fade-leave-active {
            transition: all .4s;
        }
        &.slide-fade-enter, &.slide-fade-leave-to {
            opacity: 0;
            transform: translate3d(0, 100%, 0)
        }
        .list-wrapper {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #333;
            .operator-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2rem 2rem 2rem 1.6rem;
                .icon {
                    color: #fff;
                    font-size: 2rem;
                }
                .random-play {
                    display: flex;
                    align-items: center;
                    .iconfont {
                        font-size: 2.2rem;
                    }
                    span {
                        font-size: 1.4rem;
                        padding-left: 1rem;
                    }
                }
            }
            .listen-list-wrapper {
                max-height: 24rem;
                overflow: hidden;
                .ul-group {
                    li {
                        padding: 0 2rem 0 1.6rem;
                        display: flex;
                        align-items: center;
                        height: 4rem;
                        justify-content: space-between;
                        font-size: 1.4rem;
                        &.list-enter-active, &.list-leave-active {
                            transition: all .1s;
                        }
                        &.list-enter, &.list-leave-to {
                            height: 0;
                            opacity: 0;
                        }
                        .list-operator-wrapper {
                            position: relative;
                            width: 70%;
                            .iconfont {
                                display: inline-block;
                                width: 2rem;
                                font-size: 1.8rem;
                                padding-right: .8rem;
                            }
                        }
                        .list-operator-icon {
                            position: relative;
                            width: 30%;
                            .iconfont {
                                font-size: 2.2rem;
                            }
                            .icon-xihuan {
                                color: #e84639;
                            }
                            .icon-love {
                                position: absolute;
                                right: 3.2rem;
                                top: 50%;
                                transform: translate(0, -50%);
                            }
                            .icon-delete2 {
                                position: absolute;
                                font-size: 1.8rem;
                                right: 0;
                                top: 50%;
                                transform: translate(0, -50%);
                            }
                        }
                    }
                }
            }
            .add-song-wrapper {
                text-align: center;
                padding: 2rem 0;
                .text {
                    display: inline-block;
                    border-radius: 1.4rem;
                    padding: .8rem 1.2rem;
                    border: 1px solid #fff;
                    font-size: 1.2rem;
                }
            }
            .close-btn {
                width: 100%;
                height: 4rem;
                line-height: 4rem;
                text-align: center;
                background: #222;
                color: #e84639;
                font-size: 1.6rem;
            }
        }
    }
</style>