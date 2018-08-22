<!-- scroll组件 -->
<template>
    <div class="scroll-wrapper" ref="scrollWrapper">
        <!-- slot插槽，被引用部分的html代码会被插入到slot插槽中去，这样可以让这个scroll组件在很多场景中被复用 -->
        <slot></slot>
    </div>
</template>

<script type='text/ecmascript-6'>
    import BScroll from 'better-scroll'

    // 初始化scroll组件传递的props
    export default {
        props: {
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            // 传进来的数据
            data: {
                type: Array,
                defult: null
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
            // 是否派发上拉加载更多，默认为false
            pullup: {
                type: Boolean,
                default: false
            },
            // 是否派发下拉加载更多，默认为false
            pulldown: {
                type: Boolean,
                default: false
            }
        },
        // 在DOM挂载完成之后初始化scroll，已确保better-scroll能准确计算出滚动高度
        mounted () {
            setTimeout(() => {
                this._initScroll()
            }, 20)
        },
        methods: {
            // 初始化scroll
            _initScroll () {
                if (!this.$refs.scrollWrapper) {
                    return
                }
                // 初始化scroll
                this.scroll = new BScroll(this.$refs.scrollWrapper, {
                    probeType: this.probeType,
                    click: this.click
                })
                if (this.listenScroll) {
                    let _this = this
                    this.scroll.on('scroll', (pos) => {
                        // 调用$emit 派发scroll事件
                        _this.$emit('scroll', pos)
                    })
                }
                // 如果触发上拉事件，则向父组件派发scrollToEnd事件，告知父组件已经滚动到底部
                if (this.pullup) {
                    this.scroll.on('scrollEnd', () => {
                        // + 50 确保已经上拉到距离底部超过50px位置
                        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                            this.$emit('scrollToEnd')
                        }
                    })
                }
                // 是否派发顶部下拉事件，用于下拉刷新
                if (this.pulldown) {
                    let _this = this
                    this.scroll.on('touchend', (pos) => {
                        // 下拉动作
                        if (pos.y > 50) {
                            _this.$emit('pulldown', pos)
                        }
                    })
                }
            },
            // 以下为 better-scroll 代理事件，对外暴露的方法，供外部组件引用该组件时可以调用该方法实现对应的功能
            enable () {
                this.scroll && this.scroll.enable()
            },
            disable () {
                this.scroll && this.scroll.disable()
            },
            refresh () {
                this.scroll && this.scroll.refresh()
            },
            scrollTo () {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
            },
            scrollToElement () {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            }
        },
        watch: {
            // 实时监听data的变化，并调用better-scroll的refresh()方法
            data () {
                setTimeout(() => {
                    this.refresh()
                }, 20)
            }
        }
    }
</script>

<style lang='less' scoped>
</style>