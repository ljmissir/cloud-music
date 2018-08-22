<!-- 歌手列表组件 -->
<template>
    <scroll 
        class="list-view" 
        :pullup="true"
        :pulldown="true"
        @pulldown="pulldown"
        @scrollToEnd="loadMore"
        :data="data"
        ref="listView"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="scroll">
        <ul class="singer-containers-list">
            <li class="singer-items-sort" v-for="(group, index) in data" :key="index" ref="listGroup">
                <h2 class="singer-title">{{group.title}}</h2>
                <ul class="singer-item">
                    <li @click="selectItem(item)" v-for="(item, index) in group.items" :key="index">
                        <div class="avatar-wrapper">
                            <img v-lazy="item.avatar" alt="">
                        </div>
                        <div class="singer-info">
                            <span>{{item.name}}</span>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
        <div 
            class="sort-entry" 
            @touchstart.stop.prevent="onShortcutTouchStart"
            @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li 
                    v-for="(item, index) in shortCutList" 
                    :key="index" 
                    :data-index="index"
                    :class="{active: currentIndex === index}">
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <div class="fixed-title">{{fixedTitle}} </div>
        </div>
        <div class="loading-containers" v-if="!data.length">
            <Loading></Loading>
        </div>
    </scroll>
</template>

<script type='text/ecmascript-6'>
    import Scroll from 'base/scroll/scroll'
    import {getAttributeData} from 'common/js/dom'
    import Loading from 'base/loading/loading'

    // 18是右侧每个li的高度
    const BASE_HEIGHT = 16
    const TITLE_HEIGHT = 30
    export default {
        data () {
            return {
                currentIndex: 0,
                scrollY: -1,
                diff: -1,
                pullup: true
            }
        },
        props: {
            data: {
                type: Array,
                default: []
            },
            hasMore: {
                type: Boolean,
                default: false
            }
        },
        created () {
            // 维护一个this.touch方便函数之间调用公共值
            this.touch = {}
            this.listenScroll = true
            this.listHeight = []
            this.probeType = 3
        },
        computed: {
            // 计算属性
            shortCutList () {
                return this.data.map((group) => {
                    return group.title.substr(0, 1)
                })
            },
            fixedTitle () {
                if (this.scrollY > 0) {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        methods: {
            loadMore (pos) {
                this.$emit('scrollToEnd', pos)
            },
            pulldown () {
                this.$emit('pulldown')
            },
            onShortcutTouchStart (e) {
                // e.target 为当前dom元素
                // console.log(e.target.getAttribute('data-index'))
                // better-scroll scrollToElement 滚动到锚点位置
                let targetIndex = getAttributeData(e.target, 'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.targetIndex = targetIndex
                this._scrollTo(targetIndex)
            },
            onShortcutTouchMove (e) {
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delTa = parseInt(this.touch.y2 - this.touch.y1) / BASE_HEIGHT | 0
                let targetIndex = delTa + parseInt(this.touch.targetIndex)
                this._scrollTo(targetIndex)
            },
            refresh () {
                this.$refs.listView.refresh()
            },
            scroll (pos) {
                this.scrollY = pos.y
            },
            selectItem (item) {
                this.$emit('select', item)
            },
            _scrollTo (index) {
                if (!index && index !== 0) {
                    return
                }
                if (index < 0) {
                    index = 0
                } else if (index > this.listHeight.length - 2) {
                    index = this.listHeight.length - 2
                }
                this.scrollY = -this.listHeight[index]
                this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
            },
            _calculateHeight () {
                this.listHeight = []
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            }
        },
        watch: {
            data () {
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            },
            scrollY (newY) {
                const listHeight = this.listHeight
                // 滚动到顶部
                if (newY > 0) {
                    this.currentIndex = 0
                    return
                }
                // 在中间滚动
                for (let i = 0; i < listHeight.length - 1; i++) {
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i
                        this.diff = height2 + newY
                        return
                    }
                }
                // 当滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length - 2
            },
            diff (newVal) {
                let fixTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
                if (this.fixTop === fixTop) {
                    return
                }
                this.fixTop = fixTop
                this.$refs.fixed.style.transform = `translate3d(0, ${fixTop}px, 0`
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style lang='less' scoped>
    .list-view {
        position: relative;
        background: #222;
        width: 100%;
        overflow: hidden;
        height: 100%;
        .singer-containers-list {
            .singer-items-sort {
                .singer-title {
                    background: #333;
                    color: rgba(255,255,255,0.5);
                    line-height: 3rem;
                    box-sizing: border-box;
                    padding: 0 2rem;
                    font-size: 1.2rem;
                }
                .singer-item {
                    padding-top: 2rem;
                    li {
                        display: flex;
                        padding: 0 2rem 2rem 2rem;
                        box-sizing: border-box;
                        align-items: center;
                        .avatar-wrapper {
                            padding-right: 2rem;
                            img {
                                width: 5rem;
                                height: 5rem;
                                border-radius: 50%;
                            }
                        }
                        .singer-info {
                            font-size: 1.4rem;
                            color: rgb(255,255,255);
                        }
                    }
                }
            }
        }
        .sort-entry {
            z-index: 4;
            position: absolute;
            right: 0rem;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.3);
            border-radius: 1rem;
            padding: 1.4rem 0;
            li {
                text-align: center;
                color: rgba(255,255,255,0.5);
                font-size: 1.2rem;
                padding: .2rem;
                line-height: 1;
                &.active {
                    color: #f90;
                }
            }
        }
        .list-fixed {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            .fixed-title {
                height: 3rem;
                line-height: 3rem;
                padding: 0 2rem;
                font-size: 1.2rem;
                color: rgba(255,255,255,0.5);
                background: #333;
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