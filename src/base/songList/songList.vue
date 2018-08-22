<!-- 歌曲列表组件 -->
<template>
    <div class="songs-list-containers">
        <ul>
            <li class="item" @click="selectItem(item, index)" v-for="(item, index) in songs" :key="index">
                <div class="img-wrapper" v-show="rank">
                    <!-- <img v-lazy="item.image" width="60" height="60" alt=""> -->
                    <span :class="getRankIndex(index)">{{index + 1}}</span>
                </div>
                <div class="content">
                    <h2 v-html="item.name"></h2>
                    <p class="desc">{{getDesc(item)}}</p>
                    <i class="icon iconfont icon-youjiantou1"></i>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            },
            // 如果是排行榜页面，则显示歌曲排名序号
            rank: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                
            }
        },
        methods: {
            getDesc (song) {
                return `${song.singer} - ${song.album}`
            },
            selectItem (item, index) {
                // 基础组件，不涉及业务逻辑，只是告知父组件，触发了该点击事件
                this.$emit('select', item, index)
            },
            getRankIndex (index) {
                if (index <= 2) {
                    return 'redFont'
                } else {
                    return 'normalFont'
                }
            }
        }
    }
</script>

<style lang='less' scoped>
    .songs-list-containers {
        .item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 4.8rem;
            margin-bottom: 1rem;
            .img-wrapper {
                padding-right: 2rem;
                font-size: 1.6rem;
                .redFont {
                    color: #e84639;
                }
                .normalFont {
                    color: #fff;
                }
            }
            .content {
                flex: 1;
                line-height: 2rem;
                overflow: hidden;
                position: relative;
                h2 {
                    color: #fff;
                    margin-bottom: .4rem;
                    font-size: 1.4rem;
                    width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .desc {
                    font-size: 1.2rem;
                    width: 80%;
                    color: rgba(255, 255, 255, 0.5);
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .icon-youjiantou1 {
                    font-size: 2.2rem;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translate(0, -50%);
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }
    }
</style>