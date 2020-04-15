<template>
  <div>
    <Row v-if="noArticle">
      <div>暂时没有文章哦</div>
    </Row>
    <Row v-else>
      <Page
        :total="articles.count"
        :page-size = "10"
        :current="pageCount" size="small"
        @on-change="changePage"
        show-elevator simple
        style="float:left; margin-bottom: 1rem;"
      />
      <div
        v-for="(item, index) in articles.article"
        :key = index
      >
        <Divider />
        <Row>
          <iCol span="20">
            <span
              v-for= "fandom in item.article_fandom.split(',')"
              :key="fandom"
              class="tag tag-green"
            >
              {{fandom}}
            </span>
            <span class="tag tag-red">{{item.article_rating}}</span>
            <span class="title">{{item.article_title}}</span>
          </iCol>
          <iCol span="4">
            <Button v-if="articles.isMyself" type="info">编辑</Button>
            <Button v-else type="info">查看</Button>
          </iCol>
        </Row>
        <Row class="list-content">
          <iCol>
            <p>{{item.article_summary}}</p>
          </iCol>
        </Row>
        <Row class="list-footer">
          <iCol span="16">
            <span>字数：{{item.article_wordCount}} | 热度：{{item.article_like}} | 阅读：{{item.article_view}} </span>
          </iCol>
          <iCol span="8">
            <i>{{item.article_last_edit}}/{{item.article_created}}</i>
          </iCol>
        </Row>
        <Divider />
      </div>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articles: {},
      data: {},
      noArticle: true
    };
  },
  mounted(){
    this.getMyFamdom(0,10);
  },
  methods:{
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    getMyFamdom(offset, amount) {
      console.log(`offset ${offset} amount ${amount}`);
      this.$axios.get(`/api/user/${this.$route.params.uid}/articles`, {
        params: {
          offset: offset,
          amount: amount
        }
      }).then(res => {
        console.log(res);
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.articles = res.data;
            if(res.data.count==0){ this.noArticle = true; }
            else {this.noArticle = false;}
          } else if (res.status == 403){
            this.jumpLogin();
          } else {
            this.$Message.warning({
                content: '网络出现了一些问题，请刷新重试',
                duration: 10,
                closable: true
            });
          }
        }
      });
    },
    changePage(pageCount){
      console.log(pageCount);
      this. getMyFamdom((pageCount-1)*10, 10);
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
  }
};
</script>

<style scoped>
.tag {
  color: #fff;
  background: gray;
  padding: 4px;
  border-radius: 5px;
  margin: 2px;
}
.tag-green {
  background: #9dd1a9;
}
.tag-red {
  background: #ea534f;
}
.title {
  font-size: 1.2em;
}
.list-content,.list-footer{
  margin:5px;
  padding:5px;
}
.list-footer {
  font-size: 0.9em;
  color: gray;
}
</style>