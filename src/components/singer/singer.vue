<!-- 歌手组件 -->
<template>
    <div class="singer-wrapper" ref="singer">
        <!-- 通过props把歌手数据列表传给子组件 -->
        <singer-list @pulldown="_gotoPrevPage" @scrollToEnd="_loadMoreSinger" @select="selectSinger" :data="singerListData" ref="singerList"></singer-list>
        <router-view></router-view>
    </div>
</template>

<script type='text/ecmascript-6'>
    import {getSingerList} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import Singer from 'common/js/singer'
    import SingerList from 'base/singerList/singerList'
    import {mapMutations} from 'vuex'
    import {playListMixin} from 'common/js/mixin'

    // 约定热门歌手为返回接口数据的默认排序的前十条数据
    const HOT_NAME = '热门歌手'
    const HOT_SINGER_LEN = 10
    // 每页展示100条歌手数据
    const pagesize = 100

    export default {
        mixins: [playListMixin],
        data () {
            return {
                singerListData: [],
                // 做下拉分页请求的标志位，为true时可加载下一页
                hasMore: true,
                // 维护page值，下拉时page++,向后台发送新请求，获得新数据
                page: 1
            }
        },
        created () {
            // 把方法都定义在methods对象中，然后在这里调用相关方法，养成良好编码习惯
            this._getSingerList()
        },
        methods: {
            handlePlayList (playList) {
                const bottom = playList.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.singerList.refresh()
            },
            selectSinger (singer) {
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerList () {
                this.page = 1
                this.hasMore = true
                const result = getSingerList(this.page, pagesize)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        this.singerListData = this._mapSingerListData(res.data.list)
                        this._checkHasMore(res.data)
                    }
                })
            },
            // 下拉加载更多，分页请求
            _loadMoreSinger (pos) {
                if (!this.hasMore) {
                    console.log('没有更多数据了')
                    return
                }
                this.page++
                const result = getSingerList(this.page, pagesize)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        // 这里不把数据做拼接，而是覆盖掉之前的数据，实现当前页刷新数据
                        this.singerListData = this._mapSingerListData(res.data.list)
                        this._checkHasMore(res.data)
                    }
                })
            },
            // 下拉返回上一页数据
            _gotoPrevPage () {
                if (!this.hasMore || this.page < 2) {
                    console.log('这是已经第一页了')
                    return
                }
                this.page--
                const result = getSingerList(this.page, pagesize)
                result.then((res) => {
                    if (res.code === ERR_OK) {
                        // 这里不把数据做拼接，而是覆盖掉之前的数据，实现当前页刷新数据
                        this.singerListData = this._mapSingerListData(res.data.list)
                        this._checkHasMore(res.data)
                    }
                })
            },
            // check hasMore何时置为false，当满足以下if条件时，hasMore置为false
            _checkHasMore (list) {
                if (list.per_page + this.page * list.per_page > list.total) {
                    this.hasMore = false
                }
            },
            _mapSingerListData (listData) {
                // 把源数据进行规则排序，约定数据前10条为热门歌手，其他剩余按字母升序排序
                let obj = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                listData.forEach((item, index) => {
                    if (index < HOT_SINGER_LEN) {
                        obj.hot.items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }))
                    }
                    // 把key值设置为返回数据的 item.Findex值，然后初始化key值为item.Findex值，items为空数组
                    const key = item.Findex
                    if (!obj[key]) {
                        obj[key] = {
                            title: key,
                            items: []
                        }
                    }
                    obj[key].items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }))
                })
                // 得到有序列表，热门数据排在前面，其他按字母升序排序
                let hot = []
                let ret = []
                for (let key in obj) {
                    let value = obj[key]
                    // value.title.match(/[a-zA-Z]/)
                    if (/[a-zA-Z]/.test(value.title)) {
                        ret.push(value)
                    } else if (value.title === HOT_NAME) {
                        hot.push(value)
                    }
                }
                // 按字母升序排序
                ret.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(ret)
            },
            // mapMutatios提交修改歌手
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        components: {
            SingerList
        }
    }
</script>

<style lang='less' scoped>
    .singer-wrapper {
        position: fixed;
        width: 100%;
        top: 9.2rem;
        bottom: 0;
        .loading-more {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>