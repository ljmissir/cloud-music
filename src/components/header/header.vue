<!-- header组件 -->
<template>
    <div class="header-wrapper">
        <router-link class="menu-wrapper" to="/menu">
            <i class="icon iconfont icon-caidan"></i>
        </router-link>
        <div class="cloud-logo">
            <img src="./cloud.png" width="40" height="40" alt="">
            <p>Cloud Music</p>
        </div>
        <router-link class="user-entry-icon" to="/user">
            <i class="icon iconfont icon-wode"></i>
        </router-link>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        
    }
</script>

<style lang='less' scoped>
    .header-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 4.8rem;
        background: #222;
        color: #fff;
        font-size: 1.4rem;
        .menu-wrapper {
            position: absolute;
            left: 2rem;
            color: #fff;
            i {
                font-size: 2.2rem;
            }
        }
        .cloud-logo {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .user-entry-icon {
            color: #fff;
            position: absolute;
            right: 2rem;
            i {
                font-size: 2.2rem;
            }
        }
    }
</style>