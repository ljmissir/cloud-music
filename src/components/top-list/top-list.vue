<!--  -->
<template>
    <transition name="slide">
        <music-list :rank="rank" :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script type='text/ecmascript-6'>
    import MusicList from 'components/musicList/musicList'
    import {mapGetters} from 'vuex'
    import {getRankListSongs} from 'api/rank'
    import {ERR_OK} from 'api/config'
    import {getSongVkey} from 'api/singer'
    import {createSong} from 'common/js/songs'

    export default {
        data () {
            return {
                songs: [],
                rank: true
            }
        },
        computed: {
            bgImage () {
                if (this.songs.length) {
                    return this.songs[0].image
                }
                return ''
            },
            title () {
                return this.topList.topTitle
            },
            ...mapGetters([
                'topList'
            ])
        },
        created () {
            this._getTopListSongs()
        },
        methods: {
            _getTopListSongs () {
                if (!this.topList.id) {
                    this.$router.push('/rank')
                    return
                }
                const result = getRankListSongs(this.topList.id)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._mapResolveList(res.songlist)
                    }
                })
            },
            _mapResolveList (list) {
                let ret = []
                list.forEach((item) => {
                    let musicData = item.data
                    if (item) {
                        getSongVkey(musicData.songmid).then((res) => {
                            const vkey = res.data.items[0].vkey
                            if (musicData.songid && musicData.albummid) {
                                ret.push(createSong(musicData, vkey))
                            }
                        })
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
    .slide-enter-active, .slide-leave-active {
        transition: all .4s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
</style>