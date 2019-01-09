<!--  -->
<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type='text/ecmascript-6'>
    import MusicList from 'components/musicList/musicList'
    import {getSongVkey} from 'api/singer'
    import {getDiscSongList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import {mapGetters} from 'vuex'
    import {createSong} from 'common/js/songs'

    export default {
        data () {
            return {
                songs: []
            }
        },
        computed: {
            title () {
                return this.disc.name
            },
            bgImage () {
                return this.disc.avatar
            },
            ...mapGetters([
                'disc'
            ])
        },
        created () {
            this._getDiscSong()
        },
        methods: {
            _getDiscSong () {
                if (!this.disc.id) {
                    this.$router.push('/recommend')
                    return
                }
                const result = getDiscSongList(this.disc.id)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._mapDiscSongList(res.cdlist[0].songlist)
                    }
                })
            },
            _mapDiscSongList (list) {
                let ret = []
                list.forEach((item) => {
                    let musicData = item
                    getSongVkey(musicData.songmid).then((res) => {
                        const vkey = res.data.items[0].vkey
                        if (musicData.songid && musicData.albummid) {
                            ret.push(createSong(musicData, vkey))
                        }
                    })
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
    .slide-enter-active, .slide-leave-active {
        transition: all .4s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0)
    }
</style>