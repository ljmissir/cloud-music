<!-- tab导航栏组件 -->
<template>
    <div class="tab-wrapper">
        <div class="tab-item">
            <router-link to="/recommend">推荐</router-link>
        </div>
        <div class="tab-item">
            <router-link to="/singer">歌手</router-link>
        </div>
        <div class="tab-item">
            <router-link to="/rank">排行</router-link>
        </div>
        <div class="tab-item">
            <router-link to="/search">搜索</router-link>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        data () {
            return {

            }
        }
    }
</script>

<style lang='less' scoped>
    .tab-wrapper {
        background: #222;
        display: flex;
        box-sizing: border-box;
        height: 4.4rem;
        line-height: 4.4rem;
        font-size: 1.4rem;
        .tab-item {
            flex: 1;
            width: 25%;
            text-align: center;
            a {
                color: #fff;
                display: inline;
            }
            .router-link-active {
                color: #e84639;
                border-bottom: 2px solid #e84639;
            }
        }
    }
</style>