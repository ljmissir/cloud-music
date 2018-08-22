<!--  -->
<template>
    <div class="search-list-wrapper">
        <transition-group tag="ul" name="list" class="search-list">
            <li class="search-item" v-for="item in searchs" :key="item" @click="sealectItem(item)">
                <span>{{item}}</span>
                <i class="icon iconfont icon-delete2" @click.stop="deleteSelf(item)"></i>
            </li>
        </transition-group>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            searchs: {
                type: Array,
                default: []
            }
        },
        methods: {
            // 从搜索历史中直接触发搜索，向外派发selectCurrent事件
            sealectItem (item) {
                this.$emit('selectCurrent', item)
            },
            // 从搜索历史中删除当前搜索，向外派发delete事件
            deleteSelf (item) {
                this.$emit('delete', item)
            }
        }
    }
</script>

<style lang='less' scoped>
    .search-list-wrapper {
        .search-list {
            .search-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                font-size: 1.4rem;
                height: 3.6rem;
                line-height: 3.6rem;
                &.list-enter-active, &.list-leave-active {
                    transition: all .1s;
                }
                &.list-enter, &.list-leave-to {
                    height: 0;
                    opacity: 0;
                }
            }
        }
    }
</style>