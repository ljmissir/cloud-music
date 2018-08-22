<!--  -->
<template>
    <div class="search-box">
        <i class="icon iconfont icon-sousuo"></i>
        <input v-model="query" type="text" :placeholder="placeholder">
        <i @click="clearSearchInfo" v-show="query" class="icon iconfont icon-delete2"></i>
    </div>
</template>

<script type='text/ecmascript-6'>
    import {deRequest} from 'common/js/util'
    export default {
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        data () {
            return {
                query: ''
            }
        },
        methods: {
            clearSearchInfo () {
                this.query = ''
            },
            // 对外暴露的方法，把当前query设置为输入框的query值，以供外部组件引用时调用该方法
            setQuery (query) {
                this.query = query
            }
        },
        created () {
            // 对输入框做截流优化
            this.$watch('query', deRequest((newQuery) => {
                this.$emit('query', newQuery)
            }, 400))
        }
    }
</script>

<style lang='less' scoped>
    .search-box {
        background: #333;
        box-sizing: border-box;
        width: 100%;
        height: 4rem;
        padding: 0 .6rem;
        border-radius: .6rem;
        display: flex;
        align-items: center;
        input {
            padding: .5rem 0;
            flex: 1;
            margin: 0 1rem;
            font-size: 1.4rem;
            background: #333;
            line-height: 2rem;
            color: #fff;
        }
    }
</style>