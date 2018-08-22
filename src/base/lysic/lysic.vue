<!-- 歌词 -->
<template>
    <div class="lysic-wrapper">
        <ul class="lyrics-info">
            <li v-for="(item, index) in currentLyricArray" :key="index">
                <p class="line" :class="{active: currentLine === index}">{{item.txt}}</p>
            </li>
        </ul>
    </div>
</template>

<script type='text/ecmascript-6'>
    import Scroll from 'base/scroll/scroll'
    export default {
        props: {
            currentLyricArray: {
                type: Array,
                default: []
            },
            currentLine: {
                type: Number,
                default: 0
            },
            probeType: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {

            }
        },
        components: {
            Scroll
        }
    }
</script>

<style lang='less' scoped>
    .lysic-wrapper {
        position: fixed;
        width: 100%;
        height: 55%;
        overflow: hidden;
        left: 0;
        top: 8.5rem;
        right: 0;
        bottom: 0;
        z-index: 101;
    }
</style>