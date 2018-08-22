<!-- 推荐页面组件 -->
<template>
    <div class="recommend-wrapper" ref="recommend">
        <!-- 轮播图 -->
        <!-- pulldown是否派发下拉事件，pullup是否派发上拉事件 -->
        <Scroll 
            class="scroll-slot" 
            :data="discList" 
            @pulldown="pulldownMore" 
            :pulldown="pulldown" 
            :pullup="pullup" 
            ref="scroll" 
            @scrollToEnd="loadMore">
            <div>
                <div class="slider-wrapper" v-if="recommendSwiperData.length">
                    <slider>
                        <!-- 以下代码片段会被插入到slider组件中的slot插槽中 -->
                        <div v-for="item in recommendSwiperData" :key="item.id">
                            <a :href="item.linkUrl">
                                <img class="needsclick"  @load="loadImg" :src="item.picUrl" alt="">
                            </a>
                        </div>
                    </slider>
                </div>
                <!-- 歌单 -->
                <div class="recommend-list">
                    <h2 class="title">热门歌单推荐</h2>
                    <ul class="list-wrap">
                        <li class="list-item" v-for="(item, index) in discList" :key="index" @click="selectItem(item)">
                            <div class="img-wrapper">
                                <img width="60" height="60" v-lazy="item.avatar" alt="">
                            </div>
                            <div class="text-info">
                                <h2 class="disc-name">{{item.name}}</h2>
                                <p class="disc-desc padding-top-bom" v-html="item.desc"></p>
                                <p class="disc-desc">播放{{(item.num / 10000).toFixed(2)}}万</p>
                            </div>
                        </li>
                        <loading v-show="hasMore" class="load-more" title="努力加载中..."></loading>
                    </ul>
                </div>
            </div>
            <div class="loading-containers" v-if="!discList.length && !recommendSwiperData.length">
                <loading></loading>
            </div>
        </Scroll>
        <router-view></router-view>
    </div>
</template>

<script type='text/ecmascript-6'>
    import {getRecommendSwiperData, getDiscList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import Slider from 'base/slider/slider'
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import {playListMixin} from 'common/js/mixin'
    import Recommend from 'common/js/recommend'
    import {mapMutations} from 'vuex'
    
    export default {
        mixins: [playListMixin],
        data () {
            return {
                recommendSwiperData: [],
                discList: [],
                pullup: true,
                pulldown: true,
                // sin 和 ein 是从qq音乐接口分析而来，用来维护加载分页请求时的变量
                sin: 0,
                ein: 29,
                // hasMOore，设置一是否能加载更多的标志位，为true时可以加载更多，否则不可以
                hasMore: true
            }
        },
        created () {
            this._getRecommendSwiperData()
            this._getDiscList()
        },
        methods: {
            handlePlayList (playList) {
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.recommend.style.bottom = bottom
                this.$refs.scroll.refresh()
            },
            _getRecommendSwiperData () {
                const result = getRecommendSwiperData()
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.recommendSwiperData = res.data.slider
                    }
                })
            },
            _getDiscList () {
                this.hasMore = true
                const result = getDiscList(this.sin, this.ein)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.discList = this._normalLizeList(res.data.list)
                        this._checkHasMore(res.data)
                    }
                })
            },
            _normalLizeList (list) {
                let result = []
                list.forEach((item) => {
                    result.push(new Recommend({
                        id: item.dissid,
                        name: item.dissname,
                        avatar: item.imgurl,
                        desc: item.creator.name,
                        num: item.listennum
                    }))
                })
                return result
            },
            // 完善上拉加载更多,即分页请求
            loadMore () {
                if (!this.hasMore) {
                    return
                }
                this.sin += 30
                this.ein += 30
                const result = getDiscList(this.sin, this.ein)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        console.log(res.data)
                        this.discList = this.discList.concat(this._normalLizeList(res.data.list))
                        this._checkHasMore(res.data)
                    }
                })
            },
            // 根据返回数据结构及特征，判断满足什么条件时，把hasMore置为false
            _checkHasMore (list) {
                if (this.ein > list.sum) {
                    this.hasMore = false
                }
            },
            pulldownMore () {
                console.log('触发下拉加载更多')
            },
            selectItem (item) {
                console.log(item)
                this.$router.push({
                    path: `/recommend/${item.id}`
                })
                this.setDisc(item)
            },
            loadImg () {
                if (!this.checkedLoaded) {
                    this.checkedLoaded = true
                    this.$refs.scroll.refresh()
                }
            },
            ...mapMutations({
                setDisc: 'SET_DISC'
            })
        },
        components: {
            Slider,
            Scroll,
            Loading
        }
    }
</script>

<style lang='less' scoped>
    .recommend-wrapper {
        position: fixed;
        width: 100%;
        top: 9.2rem;
        .scroll-slot {
            background: #222;
            // height: 100%;
            height: 48rem;
            overflow: hidden;
            .slider-wrapper {
                min-height: 12.8rem;
                width: 100%;
                position: relative;
                overflow: hidden;
            }
            .recommend-list {
                background: #222;
                // margin-top: -.3rem;
                .title {
                    height: 4.4rem;
                    line-height: 4.4rem;
                    text-align: center;
                    font-size: 1.4rem;
                    color: #e84639;
                }
                .list-item {
                    display: flex;
                    padding: 0 2rem 2rem 2rem;
                    align-items: center;
                    .img-wrapper {
                        padding-right: 1.6rem;
                    }
                    .text-info {
                        width: 20rem;
                        font-size: 1.2rem;
                        .disc-name {
                            color: #fff;
                            font-weight: bold;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .padding-top-bom {
                            padding: .4rem 0;
                        }
                    }
                }
                .load-more {
                    padding-bottom: 2rem;
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
</style>