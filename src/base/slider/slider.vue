<!-- slider轮播图组件 -->
<template>
    <div class="slider" ref="sliderWrapper">
        <div class="slider-items" ref="sliderItems">
            <slot></slot>
        </div>
        <div class="dots">
            <span 
                class="dot" 
                :class="{active: currentPageIndex === index}" 
                v-for="(item, index) in dots" 
                :key="index">
                {{item}}
            </span>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
    import {addClass} from 'common/js/dom'
    import BScroll from 'better-scroll'
    
    export default {
        name: 'slider',
        props: {
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interval: {
                type: Number,
                default: 3000
            }
        },
        data () {
            return {
                dots: [],
                currentPageIndex: 0
            }
        },
        mounted () {
            setTimeout(() => {
                this._setSliderWidth()
                this._initdots()
                this._initSlider()
                if (this.autoPlay) {
                    this._autoPlay()
                }
            }, 20)

            window.addEventListener('resize', () => {
                if (!this.slider) {
                    return
                }
                this._setSliderWidth(true)
                this.slider.refresh()
            })
        },
        methods: {
            // DOM元素挂载完成之后，计算slider组件的宽度
            _setSliderWidth (isResize) {
                // 获取轮播组件内的所有子元素
                this.children = this.$refs.sliderItems.children
                let width = 0
                let sliderWidth = this.$refs.sliderWrapper.clientWidth
                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i]
                    addClass(child, 'slider-item')
                    child.style.width = sliderWidth + 'px'
                    width += sliderWidth
                }
                if (this.loop && !isResize) {
                    width += 2 * sliderWidth
                }
                this.$refs.sliderItems.style.width = width + 'px'
            },
            _initdots () {
                this.dots = new Array(this.children.length)
            },
            _initSlider () {
                this.slider = new BScroll(this.$refs.sliderWrapper, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapLoop: this.loop,
                    snapThreshold: 0.3,
                    snapSpeed: 400
                })
                this.slider.on('scrollEnd', () => {
                    let pageIndex = this.slider.getCurrentPage().pageX
                    if (this.loop) {
                        pageIndex -= 1
                    }
                    this.currentPageIndex = pageIndex
                    if (this.autoPlay) {
                        this._autoPlay()
                    }
                })
                this.slider.on('beforeScrollStart', () => {
                    if (this.autoPlay) {
                        clearTimeout(this.timer)
                    }
                })
            },
            _autoPlay () {
                let pageIndex = this.currentPageIndex + 1
                if (this.loop) {
                    pageIndex += 1
                }
                this.timer = setTimeout(() => {
                    this.slider.goToPage(pageIndex, 0, 400)
                }, this.interval)
            }
        },
        destroyed () {
            clearTimeout(this.timer)
        }
    }
</script>

<style lang='less' scoped>
    .slider {
        min-height: 12.8rem;
        .slider-items {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            .slider-item {
                float: left;
                box-sizing: border-box;
                overflow: hidden;
                text-align: center;
                a {
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    text-decoration: none;
                    img {
                        width: 100%;
                        display: block;
                    }
                }
            }
        }
        .dots {
            position: absolute;
            bottom: 1.2rem;
            left: 50%;
            transform: translate(-50%, 0);
            .dot {
                display: inline-block;
                margin: 0 .4rem;
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: #e84639;
                &.active {
                    width: 12px;
                    border-radius: 5px;
                    background: #000;
                }
            }
        }
    }
</style>