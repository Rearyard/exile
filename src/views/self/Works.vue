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
        v-for="article in articles.article"
        :key = "article.id"
      >
        <Divider />
        <Row>
          <iCol span="20">
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
          <span class="title"  @click="jumpArticle(article.id)">{{article.article_title}}</span>
          </iCol>
          <iCol span="4">
            <Button v-if="articles.isMyself" type="info">编辑</Button>
            <Button v-else type="info">查看</Button>
          </iCol>
        </Row>
        <Row class="list-content">
          <iCol>
            <p v-if="article.article_summary!=''">{{article.article_summary}}</p>
            <p v-else>无内容简介</p>
          </iCol>
        </Row>
        <Row class="list-content">
          <div>
            <strong>警告：</strong>
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
          <div style="padding-top: 0.5rem;">
            性向：{{article.article_category}}
            <Divider type="vertical" />
            配对 ：
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
        </Row>
        <Row class="list-footer">
          <iCol span="16">
            <Icon type="ios-book-outline" />字数：{{article.article_wordCount}}
            <Divider type="vertical" />
            热度： {{article.article_like}}
            <Divider type="vertical" />
            阅读：{{article.article_view}}
          </iCol>
          <iCol span="8">
            <i>{{dateFormat(article.article_last_edit)}} /  {{dateFormat(article.article_created)}}</i>
          </iCol>
        </Row>
      </div>
    </Row>
  </div>
</template>

<script>
import moment from 'moment'
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
    dateFormat(str){
      return moment(str).format('YYYY-MM-DD kk:mm:ss')
    },
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
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
            if(res.data.count==0){ this.noArticle = true; }
            else {this.noArticle = false;}
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
      console.log(pageCount);
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
  cursor: pointer;
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