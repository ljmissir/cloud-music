<!--  -->
<template>
    <div class="progress-circle-wrapper">
        <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
            <circle 
                class="progress-bar" 
                r="50" cx="50" cy="50" 
                fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset">
            </circle>
        </svg>
        <slot></slot>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            radius: {
                type: Number,
                default: 0
            },
            percent: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                // 表示一个圆的周长
                dashArray: Math.PI * 100
            }
        },
        computed: {
            dashOffset () {
                return (1 - this.percent) * this.dashArray
            }
        }
    }
</script>

<style lang='less' scoped>
    .progress-circle-wrapper {
        position: relative;
        circle {
            stroke-width: 8px;
            transform-origin: center;
            // 第一个圆表示总歌曲进度，用灰色表示
            &.progress-background {
                transform: scale(0.9);
                stroke: gray;
            }
            // 第二个圆表示已播放歌曲占总时长的比例
            &.progress-bar{
                transform: scale(0.9) rotate(-90deg);
                stroke: #e84639;
            }
        }
    }
</style>