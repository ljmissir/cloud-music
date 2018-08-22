<!-- 歌手歌曲列表组件 -->
<template>
    <div class="musci-list-wrapper" >
        <div class="music-title-wrapper">
            <i @click="back" class="icon iconfont icon-fanhuijiantou"></i>
            <h2 class="music-title-info">{{title}}</h2>
        </div>
        <div class="bg-image" :style="bgBackground" ref="bgImage">
            <div class="play-wrapper" v-if="songs.length" ref="playBtn">
                <div class="play-btn" @click.stop="randomPlayList">
                    <i class="icon iconfont icon-bofang"></i>
                    <span>随机播放全部</span>
                </div>
            </div>
            <div class="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll 
            class="music-list"
            @scroll="scroll"
            :listen-scroll="listenScroll"
            :probe-type="probeType" 
            :data="songs" 
            ref="list">
            <div class="song-list-wrapper">
                <!-- 接收子组件传递的事件 select为事件名字 -->
                <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
            </div>
            <div class="loading-containers" v-if="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script type='text/ecmascript-6'>
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/songList/songList'
    import Loading from 'base/loading/loading'
    import {mapActions} from 'vuex'
    import {playListMixin} from 'common/js/mixin'

    const TITLE_HEIGHT = 40
    export default {
        mixins: [playListMixin],
        props: {
            bgImage: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                scrollY: 0
            }
        },
        created () {
            this.probeType = 3
            this.listenScroll = true
        },
        computed: {
            // 计算属性，设置背景图片
            bgBackground () {
                return `background: url(${this.bgImage}) no-repeat`
            }
        },
        mounted () {
            this.imageHeight = this.$refs.bgImage.clientHeight
            // 最小滚动高度
            this.minTranslateY = -this.imageHeight + TITLE_HEIGHT
            // 当标签为vue自定义标签时，设置其属性要形如 this.$refs.list.$el.style.top
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods: {
            handlePlayList (playList) {
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.list.$el.style.bottom = bottom
                this.$refs.list.refresh()
            },
            back () {
                // 返回上一层路由
                this.$router.back()
            },
            scroll (pos) {
                // pos 是better-scroll封装的一个随滚动而自动变化的x轴和y轴偏移量对象，
                // 向上滚动，y值为负数
                this.scrollY = pos.y
            },
            selectItem (item, index) {
                this.selectPlay({
                    list: this.songs,
                    index: index
                })
            },
            randomPlayList () {
                this.randomPlay({
                    list: this.songs
                })
            },
            ...mapActions([
                // 触发多个mutations，即提交多个mutations来改变state值
                'selectPlay',
                'randomPlay'
            ])
        },
        components: {
            Scroll,
            Loading,
            SongList
        },
        watch: {
            // 监控scrollY值的变化
            scrollY (newVal) {
                let zIndex = 0
                let scale = 1
                let translateY = Math.max(this.minTranslateY, newVal)
                const percent = Math.abs(newVal / this.imageHeight)
                // 让layer层随手势向上滚动
                this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`

                if (newVal < this.minTranslateY) {
                    // newVal 上拉为负值，从-1开始，越往上拉，newVal值越小，当newVal值小于this.minTranslateY时，执行以下代码
                    zIndex = 10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
                    this.$refs.playBtn.style.display = 'none'
                } else {
                    // 往上拉时，先执行这里的逻辑
                    // newVal 上拉为负值，从-1开始，当往回拉时，把相应样式重置回初始值
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = ''
                }
                // 下拉时，newVal > 0
                if (newVal > 0) {
                    scale = 1 + percent
                    zIndex = 10
                }
                this.$refs.bgImage.style.zIndex = zIndex
                this.$refs.bgImage.style['transform'] = `scale(${scale})`
            }
        }
    }
</script>

<style lang='less' scoped>
    .musci-list-wrapper {
        z-index: 5;
        background: #222;
        color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .music-title-wrapper {
            position: absolute;
            text-align: center;
            top: 0;
            width: 100%;
            z-index: 12;
            height: 4rem;
            line-height: 4rem;
            .icon {
                position: absolute;
                left: 2rem;
                font-size: 2rem;
                color: #fff;
                z-index: 10;
            }
            .music-title-info {
                font-size: 1.6rem;
                width: 80%;
                margin: 0 auto;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .bg-image {
            position: relative;
            height: 0;
            width: 100%;
            padding-top: 70%;
            background-size: cover !important;
            .play-wrapper {
                position: absolute;
                bottom: 2rem;
                text-align: center;
                width: 100%;
                z-index: 20;
                .play-btn {
                    box-sizing: border-box;
                    width: 135px;
                    padding: 7px 0;
                    margin: 0 auto;
                    text-align: center;
                    border: 1px solid #e84639;
                    color:  #e84639;
                    border-radius: 100px;
                    .icon {
                        padding-right: .4rem;
                    }
                    span {
                        font-size: 1.2rem;
                    }
                }
            }
            .filter {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7,17,27,0.4);
            }
        }
        .bg-layer {
            position: relative;
            height: 100%;
            background: #222;
        }
        .music-list {
            position: fixed;
            z-index: 4;
            top: 0;
            bottom: 0;
            width: 100%;
            .song-list-wrapper {
                padding: 2rem;
            }
            .loading-containers {
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
</style>