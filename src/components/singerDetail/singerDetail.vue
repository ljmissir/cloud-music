<!--  -->
<template>
    <transition name="slide">
        <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script type='text/ecmascript-6'>
    import {getSingerDetail} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import {mapGetters} from 'vuex'
    import {createSong} from 'common/js/songs'
    import MusicList from 'components/musicList/musicList'

    export default {
        data () {
            return {
                songs: []
            }
        },
        computed: {
            ...mapGetters([
                'singer'
            ]),
            title () {
                return this.singer.name
            },
            bgImage () {
                return this.singer.avatar
            }
        },
        created () {
            this._getSingerDetail()
        },
        methods: {
            _getSingerDetail () {
                if (!this.singer.id) {
                    // 歌曲信息是通过传递歌手id请求服务器获得的，如果在歌曲列表页刷新，即未获取到id值，则返回上一层路由
                    this.$router.push('/singer')
                    return
                }
                const result = getSingerDetail(this.singer.id)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._mapSongList(res.data.list)
                    }
                })
            },
            _mapSongList (list) {
                let ret = []
                list.forEach((item) => {
                    let {musicData} = item
                    if (musicData.songid && musicData.albumid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        components: {
            MusicList
        }
    }
</script>

<style lang='less' scoped>
    // 定义路由切换动画
    .slide-enter-active, .slide-leave-active {
        transition: all .4s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
</style>