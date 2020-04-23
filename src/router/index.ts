import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Active from '../views/Active.vue'
import Article from '../views/article/Index.vue'
import Draft from '../views/article/Draft.vue'
import Join from '../views/Join.vue'
import JoinMobile from '../views/JoinMobile.vue'
import SelfWrapper from '../views/self/Index.vue'
import SelfInfo from '../views/self/Info.vue'
import SelfWorks from '../views/self/Works.vue'
import SelfFavorite from '../views/self/Favorite.vue'
import SelfMobile from '../views/selfmobile/Index.vue'
import SelfMobileInfo from '../views/selfmobile/Info.vue'
import SelfMobileWorks from '../views/selfmobile/Works.vue'
import SelfMobileFavorite from '../views/selfmobile/Favorite.vue'
import NewArticle from '../views/article/New.vue'
import EditArticle from '../views/article/Edit.vue'
import ImportArticle from '../views/article/Load.vue'
import ArticleContent from '../views/article/Content.vue'
import ArticleSearchResult from '../views/article/SearchResult.vue'

Vue.use(VueRouter)

const routes = [
  {
    //首页
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    //登录
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    //注册
    path:'/register',
    name : 'Register',
    component: Register,
  },
  {
    //激活
    path:'/active',
    name : 'Active',
    component: Active,
  },
  {
    //文区
    path: '/article',
    name: 'Article',
    component: Article,
  },
  {
    //技术交流
    path: '/join',
    name: 'Join',
    component:Join
  },
  {
    //技术交流手机端
    path: '/joinmobile',
    name: 'JoinMobile',
    component:JoinMobile
  },
  {
    //文区-新文章
    path: '/article/new',
    name: 'NewArticle',
    component: NewArticle,
  },
  {
    //文区-导入
    path: '/article/import',
    name: 'ImportArticle',
    component: ImportArticle,
  },
  {
    //文区-搜索结果
    path: '/article/searchresult',
    name: 'ArticleSearchResult',
    component: ArticleSearchResult,
  },
  {
    //文区-编辑
    //新文章和修改文章共用
    //在/article/new选择新文章的时候跳转前应该先和后端请求aid和cid
    path: '/article/edit/:aid?/:cid?',
    name: 'EditArticle',
    component: EditArticle,
  },
  //文区-草稿箱
  //目前很鸡肋
  //没大用处
  {
    path: '/article/draft',
    name: 'ArticleDraft',
    component: Draft,
  },
  {
    //文区-详情和阅读
    //详情和阅读页共用
    path: '/article/:aid/:cid?',
    name: 'ArticleContent',
    component: ArticleContent,
  },
  {
    //个人中心
    //这是个嵌套路由，请负责这一块的小伙伴做好布局
    path: '/self/:uid',
    name: 'Self',
    component: SelfWrapper,
    children: [
      {
        path: 'info',
        component:SelfInfo,
        name: 'SelfInfo'
      },
      {
        path: 'favorite',
        component:SelfFavorite,
        name: 'SelfFavorite'
      },
      {
        path:'works',
        component:SelfWorks,
        name: 'SelfWorks'
      },
    ]
  },
  {
    //手机端个人中心
    path: '/selfmobile/:uid',
    name: 'SelfMobile',
    component: SelfMobile,
    children: [
      {
        path: 'info',
        component:SelfMobileInfo,
        name: 'SelfMobileInfo'
      },
      {
        path:'works',
        component:SelfMobileWorks,
        name: 'SelfMobileWorks'
      },
      {
        path: 'favorite',
        component:SelfMobileFavorite,
        name: 'SelfMobileFavorite'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
