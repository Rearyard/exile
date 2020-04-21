<template>
  <div>
    <Row style="margin-top:1rem">
      <Page :total=count :current.sync=pageCount size="small" show-elevator simple @on-change="changePage" style="float:left"/>
    </Row>
    <Row style="margin-top:1rem">
      <iCol>
        <div
          v-for="article in articles.article"
          :key = "article.id"
          class = "search-result-article-card"
          style = ""
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
          <Tag v-else-if="article.article_rating == 'PG13' " color="#f7bb8e">PG-13</Tag>
          <Tag v-else-if="article.article_rating == 'R' " color="#ea534f">R</Tag>
          <Tag v-else color="#ea534f">NC-17</Tag>
          <span id="title" @click="jumpArticle(article.id)">{{article.article_title}}</span>
          &nbsp;&nbsp;<Icon v-if="articles.isMyself" type="ios-create-outline" size="20"/>
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
            <span @click="jumpUser(articles.user.id)">
              <strong>{{articles.user.user_nickname}}</strong>
            </span>
            <Divider type="vertical" />
            <span>{{article.article_like}}个赞</span>
            <Divider type="vertical" />
            <span>{{article.article_view}}次阅读</span>
          </div>
        </div>
      </iCol>
      <iCol v-if="count == 0">
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
      count:0,
      pageCount:1
    }
  },
  mounted(){
    this.getMyFamdom(0,10);
    // console.log(this.$store.state.user);
  },
  methods:{
    getMyFamdom(offset, amount) {
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
      this.$axios.get(`/api/user/${this.$route.params.uid}/articles`, {
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
            this.count = res.data.count;
          }
        }
      }).catch(error => {
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.count = 0;
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
          this.count = 0;
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    changePage(pageCount){
      // console.log(pageCount);
      this. getMyFamdom((pageCount-1)*10, 10);
    },
    jumpArticle(id){
      this.$router.push(`/article/${id}`)
    },
    jumpUser(id){
      const isMobile=this.$store.state.isMobile;
      if(isMobile){
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
    }
  }
}
</script>

<style scoped>
#warning{
  margin-top: 0px;
}

</style>

