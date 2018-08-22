<!--  -->
<template>
    <transition name="slide">
        <div 
            class="menu-wrapper" 
            ref="menuSlide"
            @touchstart.prevent="touchStart"
            @touchmove.prevent="touchMove"
            @touchend.prevent="touchEnd"
            >
            <i @click="back" class="icon iconfont icon-fanhuijiantou"></i>
        </div>
    </transition>
</template>

<script type='text/ecmascript-6'>
    export default {
        data () {
            return {

            }
        },
        created () {
            this.touch = {}
        },
        methods: {
            back () {
                this.$router.back()
            },
            // 手势动作还未完善，待思考，暂时先用返回按钮实现
            touchStart (e) {
                this.touch.initialed = true
                const startX = e.touches[0].pageX
                this.touch.startX = startX
            },
            touchMove (e) {
                if (!this.touch.initialed) {
                    return
                }
                const startX = e.touches[0].pageX
                const diffX = this.touch.startX - startX
                console.log(diffX)
                // 右滑手势
                if (diffX < 0) {
                    return false
                } else {
                    // this.$refs.menuSlide.style.transform = `translate3d(-100%, 0, 0)`
                }
            },
            touchEnd () {
                this.touch.initialed = false
            }
        }
    }
</script>

<style lang='less' scoped>
    .menu-wrapper {
        position: fixed;
        transition: all .4s;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 151;
        background: #fff;
        width: 75%;
        &.slide-enter-active, &.slide-leave-active {
            transition: all .4s;
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(-100%, 0, 0)
        }
        .icon-fanhuijiantou {
            position: absolute;
            top: 2rem;
            left: 2rem;
            font-size: 2.2rem;
            color: #222;
            font-weight: bold;
        }
    }
</style>