<template>
  <div>
    <Row style="margin-top:1rem">
      <Page v-if="count>10" :total=count :current.sync=pageCount size="small" show-elevator simple @on-change="changePage" style="float:left"/>
    </Row>
    <Row style="margin-top:1rem">
      <iCol>
        <div
          v-for="article in articles.article"
          :key = "article.id"
          class = "search-result-article-card"
          style = ""
        >
          <Row>
            <i-col span="21">
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
              &nbsp;&nbsp;<Icon v-if="articles.isMyself" @click="jumpEditArticle(article.id)" type="ios-create-outline" size="20"/>
            </i-col>
            <i-col span="3">
              <Button
                shape="circle"
                size="small"
                ghost
                type="error"
                icon="ios-trash-outline"
                @click="openDeleteModal()"
              ></Button>
            </i-col>
            <Modal
              v-model="deleteModal"
              :loading=true
            >
              <div slot = "header">
                <p>删除文章</p>
              </div>
              <p>您确认要删除《{{article.article_title}}》吗？
              <p>数据一经删除将无法恢复，请慎重选择。</p>
              <div slot="footer">
                <Button type="info" @click="deleteArticle(article.id)">确认</Button>
                <Button type="default" @click="closeDeleteModal()">取消</Button>
              </div>
            </Modal>
          </Row>
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
import cookie from 'js-cookie'
export default {
  data(){
    return{
      articles:{},
      count:0,
      pageCount:1,
      deleteModal: false
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
    },
    jumpEditArticle(id){
      this.$router.push({
        path: `/article/edit/${id}`,
      });
    },
    openDeleteModal(){
      this.deleteModal = true;
    },
    closeDeleteModal(){
      this.deleteModal=false;
    },
    deleteArticle(id){
      const csrfToken = cookie.get("csrfToken");
      console.log(csrfToken);
      this.$axios.delete(`/api/article/${id}`,
        {
          headers: { "x-csrf-token": csrfToken }
        },
      ).then(res => {
        if(res.status == 200){
          this.$Message.info('删除成功！')
          this.closeDeleteModal()
          this.getMyFamdom(0,10);
        }
      }).catch(error => {
        this.closeDeleteModal()
        if(error.response.status == 400){
          this.$Message.warning({
            content: '删除失败',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 401){
          this.jumpLogin();
        } else if(error.response.status == 403){
          this.$Message.warning({
            content: '无权限删除他人的文章',
            duration: 10,
            closable: true
          });
        } else {
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
#warning{
  margin-top: 0px;
}
#search-result-tag-card {
  width: 100%;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
    0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
.search-result-article-card {
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem 1rem 3rem 1rem;
  line-height: 1rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
    0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
.search-result-article-card #title{
  font-size: 1rem;
  color: rgba(83, 81, 81, 0.8);
  text-shadow: 0px 1px 1px rgba(71, 68, 66, 0.2);
  font-family: "Arvo", "Myriad Pro", "Trebuchet MS", sans-serif;
  cursor: pointer;
}
.search-result-article-card #summary{
  display: block;
  margin-top:1rem;
}
.search-result-article-card #wordcount{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.search-result-article-card #others{
  float:right;
  height:1rem;
  padding-top: 0.8rem;
  strong{
    cursor: pointer;
  }
}
.search-result-article-card #warning{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.search-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
    color: rgb(100, 119, 113);
}
#search-result-input-wrapper {
  width: 12rem;
}
#search-result-input-wrapper input{
  border-radius:1rem;
}
#search-result-tag-wrapper {
  width: 5.5rem;
}
#search-result-tag-wrapper input{
  border-radius:1rem;
}
</style>

