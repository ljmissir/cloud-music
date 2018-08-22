<!-- loading组件 -->
<template>
    <div class="loading-wrapper">
        <img src="./loading.gif" width="20" height="20" alt="">
        <p class="text">{{title}}</p>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            title: {
                type: String,
                default: '努力加载中...'
            }
        }
    }
</script>

<style lang='less' scoped>
    .loading-wrapper {
        width: 100%;
        text-align: center;
        p {
            color: #fff;
            font-size: 1.2rem;
        }
    }
</style>