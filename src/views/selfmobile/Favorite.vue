<template>
  <div>
    <strong style="font-size:1rem;">收藏的分类：</strong>
    <Row style="margin-top:1rem; margin-bottom:1rem">
      <Page
        :total=fandomCount
        :current.sync=fandomPageCount
        size="small"
        page-size="5"
        show-elevator
        simple
        @on-change="changeFandomPage"
        style="float:left"
      />
    </Row>
    <div v-if="fandomCount!=0">
      <div
        v-for="item in fandoms.fandom"
        :key="item.id"
        class="wrap-card"
      >
        <span style="float:left;" @click="jumpSearchFandom(item.fandom_name)">
          {{item.fandom_name}}
        </span>
        <span style="float:right;"><Icon type="md-star" size="24"/></span>
        <span style="float:right;">{{item.fandom_article_amount}}篇文章</span>
      </div>
    </div>
    <div v-else class="wrap-card">
      <span>暂无收藏的分类哦</span>
    </div>
    <strong style="font-size:1rem;">收藏的文章：</strong>
    <Row style="margin-top:1rem">
      <Page
        :total=articleCount
        :current.sync=articlePageCount
        size="small"
        show-elevator
        simple
        @on-change="changeArticlePage"
        style="float:left"
      />
    </Row>
    <Row style="margin-top:1rem">
      <iCol>
        <div
          v-for="article in articles.article"
          :key = "article.id"
          class = "search-result-article-card"
        >
          <span v-if= "article.article_fandom ==''">
            <Tag color="#9dd1a9">
              原创
          </Tag>
          </span>
          <span v-else>
            <Tag
              color="#9dd1a9"
              v-for= "str in article.article_fandom.split(',')"
              :key="str"
            >
              {{str}}
            </Tag>
          </span>
          <Tag v-if="article.article_rating == 'G' " color="#f7bb8e">G</Tag>
          <Tag v-else-if="article.article_rating == 'PG' " color="#f7bb8e">PG-13</Tag>
          <Tag v-else-if="article.article_rating == 'R' " color="#ea534f">R</Tag>
          <Tag v-else color="#ea534f">NC-17</Tag>
          <span @click="jumpArticle(article.id)" id="title">{{article.article_title}}</span>
          <p id="summary" v-if="article.article_summary!=''">{{article.article_summary}}</p>
          <p id="summary" v-else>无内容简介</p>
          <Divider style="margin:0.8rem 0 0.5rem 0" />
          <div id="warning">
            <Icon type="ios-warning-outline" /><strong>警告：</strong>
            <span
              v-for="(str,i) in article.article_warning.split(',')"
              :key = "i"
            >
              <span v-if="str == 'No'">无警告内容</span>
              <span v-if="str == 'Violence'">详细的暴力描写</span>
              <span v-if="str == 'MainDeath'">主要角色死亡</span>
              <span v-if="str == 'Rape'">涉及强奸内容</span>
              <span v-if="str == 'Teen'">含有未成年角色</span>
              <span v-if="i!=article.article_warning.split(',').length-1">，</span>
              <span v-else>。</span>
            </span>
          </div>
          <div id = "wordcount">
            <Icon type="ios-book-outline" />字数：{{article.article_wordCount}}
            <Divider type="vertical" />
            <Icon type="ios-happy-outline" />性向：{{article.article_category}}
          </div>
          <div id = "relationship">
            <Icon type="ios-color-palette-outline" />配对 ：
            <span v-if="article.article_relationship==''"> 无 </span>
            <span
              v-for="(str,index) in article.article_relationship.split(',')"
              :key="index"
            >
              <span v-if="index!=article.article_relationship.split(',').length-1">
                {{str}} <Divider type="vertical" />
              </span>
              <span v-else>
                {{str}}
              </span>
            </span>
          </div>
          <div id="others">
            <span @click="jumpUser(article.article_author)">
              <strong>{{article.user_nickname}}</strong>
            </span>
            <Divider type="vertical" />
            <span>{{article.article_like}}个赞</span>
            <Divider type="vertical" />
            <span>{{article.article_view}}次阅读</span>
          </div>
        </div>
      </iCol>
      <iCol v-if="articleCount == 0">
        <div class = "search-result-article-card">
          <p>暂无文章</p>
        </div>
      </iCol>
    </Row>
  </div>
</template>

<script>
export default {
  data(){
    return{
      articles:{},
      articleCount:0,
      articlePageCount:1,
      fandoms:{},
      fandomCount:0,
      fandomPageCount:1,
    }
  },
  mounted(){
    this.getFavoriteArticle(0,10);
    this.getFavoriteFandom(0,5);
  },
  methods:{
    getFavoriteArticle(offset, amount) {
      // console.log(`offset ${offset} amount ${amount}`);
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
                'class': 'search-spin-icon-load',
                props: {
                    type: 'ios-loading',
                    size: 18
                }
            }),
            h('div', {
              'style': 'color: rgb(100, 119, 113);'
            },'Loading')
          ])
        },
      });
      this.$axios.get(`/api/user/${this.$route.params.uid}/follow/articles`, {
        params: {
          offset: offset,
          amount: amount
        }
      }).then(res => {
        // console.log(res);
        this.$Spin.hide();
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.articles = res.data;
            this.articleCount = res.data.count;
          }
        }
      }).catch(error => {
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.articleCount = 0;
          this.$Message.warning({
            content: '您访问的用户不存在',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
          this.$Spin.hide();
          this.jumpLogin();
        } else {
          this.$Spin.hide();
          this.articleCount = 0;
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    getFavoriteFandom(offset, amount){
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
                'class': 'search-spin-icon-load',
                props: {
                    type: 'ios-loading',
                    size: 18
                }
            }),
            h('div', {
              'style': 'color: rgb(100, 119, 113);'
            },'Loading')
          ])
        },
      });
      this.$axios.get(`/api/user/${this.$route.params.uid}/follow/fandom`, {
        params: {
          offset: offset,
          amount: amount
        }
      }).then(res => {
        console.log(res)
        this.$Spin.hide();
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.fandoms = res.data;
            this.fandomCount = res.data.count;
          }
        }
      }).catch(error => {
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.fandomCount = 0;
          this.$Message.warning({
            content: '您访问的用户不存在',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
          this.$Spin.hide();
          this.jumpLogin();
        } else {
          this.$Spin.hide();
          this.fandomCount = 0;
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    changeArticlePage(articlePageCount){
      console.log(articlePageCount);
      this.getFavoriteArticle((articlePageCount-1)*10, 10);
    },
    changeFandomPage(fandomPageCount){
      this.getFavoriteFandom((fandomPageCount-1)*5, 5);
    },
    jumpArticle(id){
      this.$router.push(`/article/${id}`)
    },
    jumpUser(id){
      const user=this.$store.state.user;
      if(user.isMobile){
        this.$router.push(`/selfmobile/${id}/info`)
      }else{
        this.$router.push(`/self/${id}/info`)
      }
    },
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    jumpSearchFandom(fandomName){
      this.$router.push({
        path:'/article/searchresult',
        query:{
          fandom:fandomName,
          relationship:'',
          title:'',
          author:'',
        }
      });
    }
  }
}
</script>

<style scoped>
.wrap-card {
  width: 100%;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.2) inset,
  0 5px 10px 5px rgba(208, 208, 208, 0.3);
  border-radius: 18px;
  margin-top: 0.5rem;
  transition: all 0.3s linear;
  height:3rem;
  margin-bottom:1rem
}

.wrap-card span {
  display: table-cell;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  vertical-align: middle;
  font-size: 0.8rem;
  color: rgba(104, 104, 104, 0.7);
  text-shadow: 0 1px 1px rgba(88, 85, 83, 0.356);
  font-family: "Arvo", "Myriad Pro", "Trebuchet MS", sans-serif;
}
#warning{
  margin-top: 0px;
}
</style>

