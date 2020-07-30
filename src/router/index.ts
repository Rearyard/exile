import Vue from 'vue'
import VueRouter from 'vue-router'

const Index= () => import( '../views/Index.vue')
const Login= () => import( '../views/Login.vue')
const Register= () => import( '../views/Register.vue')
import Reset  from '@/views/Reset.vue'
const Active= () => import( '../views/Active.vue')
const Article= () => import( '../views/article/Index.vue')
const Draft= () => import( '../views/article/Draft.vue')
const Join= () => import( '../views/Join.vue')
const JoinMobile= () => import( '../views/JoinMobile.vue')
const Question= () => import( '../views/Question.vue')
const QuestionMobile= () => import( '../views/QuestionMobile.vue')
const SelfWrapper= () => import( '../views/self/Index.vue')
const SelfInfo= () => import( '../views/self/Info.vue')
const SelfWorks= () => import( '../views/self/Works.vue')
const SelfFavorite= () => import( '../views/self/Favorite.vue')
const Following= () => import( '../views/self/Following.vue')
const Followed= () => import( '../views/self/Followed.vue')
const Provement= () => import( '../views/self/Provement.vue')
const SelfMobile= () => import( '../views/selfmobile/Index.vue')
const SelfMobileInfo= () => import( '../views/selfmobile/Info.vue')
const SelfMobileWorks= () => import( '../views/selfmobile/Works.vue')
const SelfMobileFavorite= () => import( '../views/selfmobile/Favorite.vue')
const NewArticle= () => import( '../views/article/New.vue')
const EditArticle= () => import( '../views/article/Edit.vue')
const ImportArticle= () => import( '../views/article/Load.vue')
const ArticleContent= () => import( '../views/article/Content.vue')
const ArticleSearchResult= () => import( '../views/article/SearchResult.vue')
const NotificationWrapper= ()=>import('../views/notification/Wrapper.vue')
const NotificationIndex= ()=>import('../views/notification/Index.vue')
const NotificationSystem= ()=>import('../views/notification/Notification.vue')
const NotificationLike= ()=>import('../views/notification/Like.vue')
const NotificationComment= ()=>import('../views/notification/Comment.vue')
const NotificationDM= ()=>import('../views/notification/DirectMsg.vue')
const PCNotificationIndex = ()=>import('../views/notificationpc/Index.vue')
const PCNotificationSystem = ()=>import('../views/notificationpc/System.vue')
const PCNotificationComment = ()=>import('../views/notificationpc/Comment.vue')
const PCNotificationLike = ()=>import('../views/notificationpc/Like.vue')

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
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    //激活
    path: '/active',
    name: 'Active',
    component: Active,
  },
  {
    // 密码重置
    path:'/reset',
    name:'Reset',
    component:Reset,
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
    component: Join
  },
  {
    //技术交流手机端
    path: '/joinmobile',
    name: 'JoinMobile',
    component: JoinMobile
  },
  {
    //常见问题
    path: '/question',
    name: 'Question',
    component: Question
  },
  {
    //常见问题
    path: '/questionmobile',
    name: 'QuestionMobile',
    component: QuestionMobile
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
        component: SelfInfo,
        name: 'SelfInfo'
      },
      {
        path: 'favorite',
        component: SelfFavorite,
        name: 'SelfFavorite'
      },
      {
        path: 'works',
        component: SelfWorks,
        name: 'SelfWorks'
      },
      {
        path: 'following',
        component: Following,
        name: 'Following',
      },
      {
        path: 'followed',
        component: Followed,
        name: 'Followed'
      },
      {
        path: 'Provement',
        component: Provement,
        name: 'Provement'
      }
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
        component: SelfMobileInfo,
        name: 'SelfMobileInfo'
      },
      {
        path: 'works',
        component: SelfMobileWorks,
        name: 'SelfMobileWorks'
      },
      {
        path: 'favorite',
        component: SelfMobileFavorite,
        name: 'SelfMobileFavorite'
      }
    ]
  },
  {
    path: '/notification',
    component: NotificationWrapper,
    name: 'NotificationWrapper',
    children: [
      {
        name: 'NotificationIndex',
        component: NotificationIndex,
        path: ''
      },{
        name: 'NotificationSystem',
        component: NotificationSystem,
        path: 'system'
      },{
        name: 'NotificationLike',
        component: NotificationLike,
        path: 'like'
      },{
        name: 'NotificationComment',
        component: NotificationComment,
        path: 'comment'
      },{
        name: 'NotificationDM',
        component: NotificationDM,
        path: 'directmsg'
      }
    ]
  },
  {
    path:'/pcnotification',
    component: PCNotificationIndex,
    name: 'PCNotificationIndex',
    children: [
      {
        name: 'PCNotificationSystem',
        component: PCNotificationSystem,
        path: 'system'
      },
      {
        name: 'PCNotificationComment',
        component: PCNotificationComment,
        path: 'comment'
      },
      {
        name: 'PCNotificationLike',
        component: PCNotificationLike,
        path: 'like'
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
