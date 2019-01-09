<!-- 播放器内核 -->
<template>
    <div class="player-containers" v-show="playList.length > 0">
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image" alt="">
                </div>
                <div class="top">
                    <i class="icon iconfont icon-shouqi" @click.stop="back"></i>
                    <h2 class="title" v-html="currentSong.name"></h2>
                    <h2 class="sub-title" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div ref="musicCdWrapper" class="music-cd-wrapper" v-show="!isShowLysic" @click="showLysic">
                        <img class="needle-btn" src="./needle.png" width="60" :class="cdControl">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd-img" :class="cdRotate">
                                <img :src="currentSong.image" alt="">
                            </div>
                        </div>
                        <div class="lyric-current-line">
                            <div class="lyric-current-info">
                                {{lyricCurrenntText}}
                            </div>
                        </div>
                    </div>
                    <!-- better-scroll 要初始化，需要把数据绑定到scroll组件上，再在scrll组件上会调用refresh -->
                    <scroll ref="lyricList" class="scroll-lyricList" :data="currentLyric && currentLyric.lines">
                        <div 
                            v-show="isShowLysic" 
                            @click="toggleLysic"
                            :currentLine="currentLine">
                            <ul class="lyrics-info">
                                <li v-for="(item, index) in currentLyricArray" :key="index">
                                    <p ref="lyricTxt" class="line" :class="{active: currentLine === index}">{{item.txt}}</p>
                                </li>
                            </ul>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <!-- 歌曲播放进度 -->
                    <div class="process-containers">
                        <div class="runing-time">
                            <span>{{timeHandle(currentTime)}}</span>
                        </div>
                        <process-bar :percent="percent" @percentChange="onPercentChange"></process-bar>
                        <div class="sum-song-times">
                            <span>{{timeHandle(currentSong.duration)}}</span>
                        </div>
                    </div>
                    <!-- 前后歌曲及播放暂停 -->
                    <div class="operator">
                        <div class="operator-item">
                            <i 
                                class="icon iconfont"
                                :class="modeIcon"
                                @click.stop="changeMode">
                            </i>
                        </div>
                        <div class="operator-item">
                            <i 
                                class="icon iconfont icon-shangyishou"
                                @click.stop="prev"></i>
                        </div>
                        <div class="operator-item">
                            <i 
                                class="icon iconfont icon-mid"
                                :class="playIcon"
                                @click.stop="togglePlaying">
                            </i>
                        </div>
                        <div class="operator-item">
                            <i 
                                class="icon iconfont icon-xiayishou"
                                @click.stop="next">
                            </i>
                        </div>
                        <div class="operator-item">
                            <i 
                                class="icon iconfont"
                                @click.stop="toggleFavorite(currentSong)"
                                :class="getFavoriteIcon(currentSong)"
                                >
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="singer-img" :class="cdRotate">
                    <img :src="currentSong.image" width="40" height="40" alt="">
                </div>
                <div class="song-info">
                    <h2 class="singer-name" v-html="currentSong.name"></h2>
                    <p class="song-name">{{lyricCurrenntText}}</p>
                </div>
                <div class="play-btn">
                    <!-- @click.stop 阻止冒泡事件的触发 -->
                    <progress-circle :radius="radius" :percent="percent">
                        <i class="icon iconfont icon-play" :class="playIcon" @click.stop="togglePlaying"></i>
                    </progress-circle>
                </div>
                <div class="all-list" @click.stop="showPlayList">
                    <i class="icon iconfont icon-yinleliebiao"></i>
                </div>
            </div>
        </transition>
        <play-list ref="playLsit"></play-list>
        <!-- 播放音乐，用到h5 audio标签 -->
        <!-- play，表示该歌曲已准备好播放，当浏览器能够开始播放指定的音频/视频时，发生canplay事件 -->
        <!-- error，audio提供的回调，当播放歌曲遇到未知错误不能播放时触发 -->
        <!-- timeupdate，audio提供的实时更新已播放歌曲时间的回调，返回已播放时间的时间戳 -->
        <!-- ended,audio提供的回调，当歌曲播放完毕时调用 -->
        <!-- src 歌曲播放的外链 -->
        <audio 
            ref="audio" 
            :src="currentSong.url" 
            @play="ready" 
            @error="error" 
            @timeupdate="timeUpdate"
            @ended="ended">
        </audio>
    </div>
</template>

<script type='text/ecmascript-6'>
    // vuex 提供的语法糖，可以快速从state中拿到并处理对应的状态
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import ProcessBar from 'base/processBar/processBar'
    import Lysic from 'base/lysic/lysic'
    import {getSongLyrics} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import ProgressCircle from 'base/progressCircle/progressCircle'
    import {playMode} from 'common/js/config'
    import {Base64} from 'js-base64'
    import Lyric from 'lyric-parser'
    import Scroll from 'base/scroll/scroll'
    import PlayList from 'components/play-list/play-list'
    import {playerMixin} from 'common/js/mixin'

    export default {
        mixins: [playerMixin],
        data () {
            return {
                songReady: false,
                currentTime: 0,
                isShowLysic: false,
                radius: 32,
                lyrics: '',
                currentLyric: null,
                currentLine: 0,
                currentLyricArray: [],
                lyricCurrenntText: ''
            }
        },
        created () {
            // this.probeType = 3
            this.touch = {}
        },
        computed: {
            // 计算属性，控制播放按钮的class
            playIcon () {
                return this.playing ? 'icon-zanting' : 'icon-bofang'
            },
            // 计算属性，控制唱片的旋转的class
            cdRotate () {
                return this.playing ? 'play' : 'play pause'
            },
            // 计算属性，得出已播放占未播放的时间比
            percent () {
                return this.currentTime / this.currentSong.duration
            },
            cdControl () {
                return this.playing ? 'cd-play' : ''
            },
            // mapGetters,vuex提供的语法糖，在computed里调用，获取state中各变量的初始值
            ...mapGetters([
                'fullScreen',
                'currentIndex',
                'playing',
                'singer'
            ])
        },
        methods: {
            // mapMutations，vux提供的语法糖，在methods提交mutation
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN'
            }),
            ...mapActions([
                'playHistoryList'
            ]),
            showPlayList () {
                this.$refs.playLsit.show()
            },
            // 开启迷你播放器
            back () {
                this.setFullScreen(false)
                this.isShowLysic = false
                this.$refs.musicCdWrapper.style.opacity = 1
                this.$refs.lyricList.style = 0
            },
            // 开启全屏播放器
            open () {
                this.setFullScreen(true)
            },
            // 播放和暂停歌曲
            togglePlaying () {
                if (this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
                // 从vuex中取playing值，通过playing的true or false来执行播放和暂停功能，
                // 想要修改state中playing的状态值，首先得在mapMututations中提交commit
                this.setPlayingState(!this.playing)
            },
            // 上一首
            prev () {
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this._loop()
                } else {
                    let index = this.currentIndex - 1
                    if (index === -1) {
                        index = this.playList.length - 1
                    }
                    // 触发mutation，修改state
                    this.setCurrentIndex(index)
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                this.songReady = false
            },
            // 下一首
            next () {
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this._loop()
                } else {
                    let index = this.currentIndex + 1
                    if (index === this.playList.length) {
                        index = 0
                    }
                    this.setCurrentIndex(index)
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                this.songReady = false
            },
            // audio 歌曲准备好后的回调函数
            ready () {
                this.songReady = true
                this.playHistoryList(this.currentSong)
            },
            // audio url错误时的回调函数
            error () {
                this.songReady = true
                return false
            },
            // audio 歌曲播放完毕时调用的回调
            ended () {
                if (this.mode === playMode.loop) {
                    this._loop()
                } else {
                    this.next()
                }
            },
            // 单曲循环，播放结束时把歌曲的currentTime重置为0，再调用play()方法
            _loop () {
                this.$refs.audio.currentTime = 0
                this.$refs.audio.play()
                if (this.currentLyric) {
                    this.currentLyric.seek(0)
                }
            },
            // 歌曲播放了多长时间，实时更新
            timeUpdate (e) {
                this.currentTime = e.target.currentTime
            },
            // 格式化时间戳
            timeHandle (interval) {
                // 向下取整
                interval = interval | 0
                const minute = interval / 60 | 0
                const seconds = this._addZero(interval % 60)
                return `${minute}:${seconds}`
            },
            // 秒数小于10，在秒数前面加0
            _addZero (num, n = 2) {
                let len = num.toString().length
                while (len < n) {
                    num = '0' + num
                    len++
                }
                return num
            },
            // 手指拖动滑块时，改变percent值，从子组件那接收到的事件
            onPercentChange (percent) {
                const currentTime = this.currentSong.duration * percent
                this.$refs.audio.currentTime = currentTime
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000)
                }
            },
            // 是否展示歌词
            showLysic () {
                this.isShowLysic = true
                // better-scroll，refresh()方法，需要等待DOM载入后计算可滚动的高度
                setTimeout(() => {
                    this.$refs.lyricList.$el.style.opacity = 1
                    this.$refs.musicCdWrapper.style.opacity = 0
                    this.$refs.lyricList.refresh()
                }, 20)
            },
            toggleLysic () {
                this.isShowLysic = false
                this.$refs.lyricList.$el.style.opacity = 0
                this.$refs.musicCdWrapper.style.opacity = 1
            },
            _getSongLyrics () {
                const result = getSongLyrics(this.currentSong.mid)
                result.then((res) => {
                    console.log(res, typeof res.lyric === 'string')
                    if (typeof res.lyric === 'string') {
                        if (res.retcode === ERR_OK) {
                            this.lyrics = Base64.decode(res.lyric)
                            this._getLyric(this.lyrics)
                        }
                    }
                }).catch(() => {
                    this.currentLyric = null
                    this.lyricCurrenntText = ''
                    this.currentLine = 0
                })
            },
            _getLyric (lyric) {
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                if (this.playing) {
                    this.currentLyric.play()
                }
                this.currentLyricArray = this.currentLyric.lines
            },
            handleLyric ({lineNum, txt}) {
                this.currentLine = lineNum
                if (lineNum > 5) {
                    let lineEl = this.$refs.lyricTxt[lineNum - 5]
                    this.$refs.lyricList.scrollToElement(lineEl, 1000)
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 1000)
                }
                this.lyricCurrenntText = txt
            }
        },
        watch: {
            currentSong (newSong, oldSong) {
                if (!newSong.id) {
                    return
                }
                if (newSong.id === oldSong.id) {
                    return
                }
                if (this.currentLyric) {
                    this.currentLyric.stop()
                    this.currentTime = 0
                    this.playingLyric = ''
                    this.currentLine = 0
                }
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                // this.$nextTick 当DOM加载好之后，再在执行play()方法
                this.timer = setTimeout(() => {
                    this.$refs.audio.play()
                    // 动态监听歌词的改变
                    this._getSongLyrics()
                }, 1000)
            },
            playing (newPlaying) {
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause()
                })
            }
        },
        components: {
            ProcessBar,
            Lysic,
            ProgressCircle,
            Scroll,
            PlayList
        }
    }
</script>

<style lang='less' scoped>
    .player-containers {
        color: #fff;
        .normal-player {
            width: 100%;
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: #222;
            z-index: 100;
            .background {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: -1;
                opacity: 0.6;
                filter: blur(20px);
                -webkit-filter: blur(20px); 
            }
            .top {
                position: relative;
                margin-bottom: 2rem;
                .icon {
                    font-size: 2.6rem;
                    position: absolute;
                    left: 2rem;
                    top: .8rem;
                }
                .title {
                    font-size: 1.6rem;
                    width: 70%;
                    margin: 0 auto;
                    line-height: 4rem;
                    text-align: center;
                }
                .sub-title {
                    box-sizing: border-box;
                    width: 80%;
                    margin: 0 auto;
                    text-align: center;
                    line-height: 2rem;
                    font-size: 1.4rem;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
            .middle {
                position: fixed;
                width: 100%;
                top: 8rem;
                bottom: 17rem;
                white-space: nowrap;
                .music-cd-wrapper {
                    transition: all .4s;
                    height: 0;
                    vertical-align: top;
                    opacity: 1;
                    width: 100%;
                    padding-top: 100%;
                    position: relative;
                    .needle-btn {
                        transition: all .5s;
                        position: absolute;
                        top: 0;
                        left: 50%;
                        z-index: 1;
                        transform-origin: 0 0;
                        z-index: 12;
                        transform: rotate(-30deg) translateX(-25%);
                        &.cd-play {
                            transform: rotate(-4deg) translateX(-25%);
                        }
                    }
                    .cd-wrapper {
                        position: absolute;
                        left: 50%;
                        top: 4.5rem;
                        width: 70%;
                        height: 70%;
                        z-index: 11;
                        transform: translateX(-50%);
                        .cd-img {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 4rem solid rgb(0, 0, 0);
                            border-radius: 50%;
                            position: relative;
                            img {
                                position: absolute;
                                display: block;
                                left: 0;
                                top: 0;
                                width: 100%;
                                border-radius: 50%;
                            }
                            &.play {
                                animation: rotate 20s linear infinite;
                            }
                            &.pause {
                                animation-play-state: paused;
                            }
                        }
                    }
                    .lyric-current-line {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        text-align: center;
                        font-size: 1.4rem;
                        .lyric-current-info {
                            width: 80%;
                            margin: 0 auto;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                }
                .scroll-lyricList {
                    transition: all .4s;
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 32rem;
                    overflow: hidden;
                    z-index: 10;
                    .lyrics-info {
                        text-align: center;
                        font-size: 1.4rem;
                        width: 80%;
                        margin: 0 auto;
                        li {
                            p {
                                color: rgba(255,255,255,0.5);
                                line-height: 3.2rem;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                &.active {
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
            }
            .bottom {
                position: absolute;
                width: 100%;
                bottom: 5rem;
                .process-containers {
                    padding: 1.2rem 0;
                    width: 80%;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    .runing-time {
                        width: 2rem;
                    }
                    .sum-song-times {
                        width: 2rem;
                    }
                }
                .operator {
                    width: 100%;
                    padding: 0 2rem;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    .operator-item {
                        flex: 1;
                        text-align: center;
                        .icon-xihuan {
                            color: #e84639;
                        }
                        .icon {
                            font-size: 3rem;
                        }
                        .icon-mid {
                            font-size: 2.6rem;
                            position: relative;
                            top: -.2rem;
                        }
                    }
                }
            }
            &.normal-enter-active, &.normal-leave-active {
                transition: all .4s;
                .top, .bottom {
                    // cubic-bezier(0.86, 0.18, 0.82, 1.32) 贝塞尔曲线设置
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
                }
            }
            &.normal-enter, &.normal-leave-to {
                opacity: 0;
                z-index: -2;
                .top {
                    transform: translate3d(0, -10rem, 0);
                }
                .bottom {
                    transform: translate3d(0, 10rem, 0);
                }
            }
        }
        .mini-player {
            box-sizing: border-box;
            padding-right: 1rem;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 150;
            background: #333;
            height: 6rem;
            width: 100%;
            display: flex;
            align-items: center;
            align-items: center;
            .singer-img {
                padding: 0 1rem;
                img {
                    border-radius: 50%;
                }
                &.play {
                    animation: rotate 20s linear infinite;
                }
                &.pause {
                    animation-play-state: paused;
                }
            }
            .song-info {
                width: 55%;
                .singer-name {
                    font-size: 1.4rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .song-name {
                    font-size: 1.2rem;
                    color: rgba(255,255,255,0.5);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .play-btn {
                width: 3rem;
                // margin-top: -.42rem;
                text-align: center;
                padding: 0 1rem;
                .icon {
                    font-size: 2.4rem;
                }
                .icon-play {
                    font-size: 1.6rem;
                    position: absolute;
                    top: .8rem;
                    left: .8rem;
                }
            }
            .all-list {
                width: 3rem;
                text-align: right;
                .icon {
                    font-size: 2.4rem;
                }
            }
            &.mini-enter-active, &.mini-leave-active {
                transition: all 0.4s
            }
            &.mini-enter, &.mini-leave-to {
                opacity: 0
            }
        }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0)
        }
        100% {
            transform: rotate(360deg)
        }
    }
    @keyframes fadein {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>