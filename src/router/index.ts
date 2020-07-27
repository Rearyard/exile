import Vue from 'vue'
import VueRouter from 'vue-router'

const Index= () => import( '../views/Index.vue')
const Login= () => import( '../views/Login.vue')
const Register= () => import( '../views/Register.vue')
import Reset  from '@/views/Reset.vue'
import Request from '@/views/Request.vue'
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
const MessageWrapper= ()=>import('../views/messages/Wrapper.vue')
const MessageIndex= ()=>import('../views/messages/Index.vue')
const MessageNotification= ()=>('../views/messages/Notification.vue')
const MessageLike= ()=>('../views/messages/Like.vue')
const MessageComment= ()=>('../views/messages/Comment.vue')
const MessageDirectMsg= ()=>('../views/messages/DirectMsg.vue')

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
    //注册申请
    path:'/request',
    name:'Request',
    component:Request,
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
    path: '/message/',
    component: MessageWrapper,
    children: [
      {
        name: 'MessageIndex',
        component: MessageIndex,
        path: '',
      },{
        name: 'MessageNotification',
        component: MessageNotification,
        path: 'notification',
      },{
        name: 'MessageLike',
        component: MessageLike,
        path: 'like',
      },{
        name: 'MessageComment',
        component: MessageComment,
        path: 'comment',
      },{
        name: 'MessageDirectMsg',
        component: MessageDirectMsg,
        path: 'DirectMsg',
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
