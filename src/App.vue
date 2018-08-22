<template>
    <div id="app">
      <home-header></home-header>
      <tab></tab>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <player></player>
    </div>
</template>

<script>
    import Tab from 'components/tab/tab'
    import HomeHeader from 'components/header/header'
    import Player from 'components/player/player'
    export default {
        name: 'app',
        components: {
            Tab,
            HomeHeader,
            Player
        }
    }
</script>

<style>

</style>
