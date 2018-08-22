<!--  -->
<template>
    <transition name="drop">
        <div class="top-tip-wrapper" v-show="showFlag">
            <slot></slot>
        </div>
    </transition>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            delay: {
                type: Number,
                default: 2000
            }
        },
        data () {
            return {
                showFlag: false
            }
        },
        methods: {
            show () {
                this.showFlag = true
                let timer = null
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    this.hide()
                }, this.delay)
            },
            hide () {
                this.showFlag = false
            }
        }
    }
</script>

<style lang='less' scoped>
    .top-tip-wrapper {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 200;
        background: #333;
        &.drop-enter-active, &.drop-leave-active {
            transition: all .4s;
        }
        &.drop-enter, &.drop-leave-to {
            transform: translate3d(0, -100%, 0);
        }
    }
</style>