import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 在单页应用中，如果没有应用路由懒加载，运用webpack打包后的文件将会异常的大，造成进入首页时，需要加载的内容过多，
// 延时过长，不利于用户体验，而运用懒加载则可以将页面进行划分，需要的时候加载页面，可以有效的分担首页所承担的加载压力，
// 减少首页加载用时，即动态加载路由，实现路由组件的异步加载，优化页面性能
const Recommend = () => import('components/recommend/recommend')

const Singer = () => import('components/singer/singer')

const Rank = () => import('components/rank/rank')

const Search = () => import('components/search/search')

const SingerDetail = () => import('components/singerDetail/singerDetail')

const Disc = () => import('components/disc/disc')

const TopList = () => import('components/top-list/top-list')

const UserInfo = () => import('components/user-info/user-info')

const Menu = () => import('components/menu/menu')

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: Recommend,
            children: [
                {
                    path: ':id',
                    component: Disc
                }
            ]
        },
        {
            path: '/singer',
            component: Singer,
            children: [
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/rank',
            component: Rank,
            children: [
                {
                    path: ':id',
                    component: TopList
                }
            ]
        },
        {
            path: '/search',
            component: Search,
            children: [
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/user',
            component: UserInfo
        },
        {
            path: '/menu',
            component: Menu
        }
    ]
})
