<template>
  <div>
    <Row style="margin-top:2rem;">
      <iCol
        :xs="{ span: 20, offset: 2}"
        :sm="{ span: 18, offset:3 }"
        :md="{ span: 16, offset: 4 }"
        :lg="{ span: 14, offset: 5 }"
      >
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item href="/">
            <Icon type="ios-home-outline"></Icon>后花园
          </Breadcrumb-item>
          <Breadcrumb-item href="/components/breadcrumb">
            <Icon type="social-buffer-outline"></Icon>文区
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="pound"></Icon>搜索结果
          </Breadcrumb-item>
        </Breadcrumb>
        <div style = "margin-bottom: 2rem;">
          高级搜索
          <iSwitch true-color="#a2d6cd" size="small" v-model = "easySearch" />
          模糊搜索
        </div>
        <div id="search-result-tag-card" style="padding:1rem 1rem 0.5rem 1rem; margin-top: 0.5rem;">
          <div v-if = "!easySearch">
            <div>
              原作：
              <a v-if= "fandomList== ''"></a>
              <a v-else>
                <Tag
                  style="border-radius:1rem"
                  type="dot"
                  closable
                  v-for= "(str,i) in fandomList"
                  :key="str"
                  :name = "i"
                  @on-close="deleteFandom"
                >
                  {{str}}
                </Tag>
                <!-- <Tag
                  style="border-radius:1rem; height:32px; background: white; line-height:32px; padding: 0 10px;"
                  closable
                  v-for= "(str,i) in fandomList"
                  :key="str"
                  :name = "i"
                  @on-close="deleteFandom"
                >
                  <Icon
                    v-if = "fandomIsFollowed(str)"
                    @click="addtoFavorite(str)"
                    type = "ios-star"
                    size="16"
                    style="margin-right: 8px;"
                  />
                  <Icon
                    v-else
                    @click="addtoFavorite(str)"
                    type = "ios-star-outline"
                    size="16"
                    style="margin-right: 8px;"
                  />
                  <span style= "margin-right: 8px;">{{str}}</span>
                </Tag> -->
              </a>
              <Input
                v-model="addFandom"
                placeholder="   添加"
                icon="ios-add"
                id = "search-result-tag-wrapper"
                @on-blur = "handleAddFandom"
                @on-click = "handleAddFandom"
                @on-enter = "handleAddFandom"
              />
            </div>
            <div>
              配对：
              <a v-if= "relationshipList== ''"></a>
              <a v-else>
                <Tag
                  style="border-radius:1rem"
                  type="dot"
                  closable
                  v-for= "(str,i) in relationshipList"
                  :key="str"
                  :name = "i"
                  @on-close="deleteRelationship"
                >
                  {{str}}
                </Tag>
              </a>
              <Input
                v-model="addRelationship"
                placeholder="   添加"
                icon="ios-add"
                id = "search-result-tag-wrapper"
                @on-blur = "handleAddRelationship"
                @on-click = "handleAddRelationship"
                @on-enter = "handleAddRelationship"
              />
            </div>
            <div>
              标题：
              <Input
                v-model="title"
                placeholder="请输入标题..."
                id = "search-result-input-wrapper"
                icon = "ios-search-outline"
                @on-click = "changeTitle"
                @on-enter = "changeTitle"
              />
            </div>
            <div>
              作者：
              <Input
                v-model="author"
                placeholder="请输入作者..."
                id = "search-result-input-wrapper"
                icon = "ios-search-outline"
                @on-enter = "changeAuthor"
                @on-click = "changeAuthor"
              />
            </div>
          </div>
          <div v-else>
            关键词：
            <Input
              v-model="query"
              placeholder="请输入标题/TAG/作者..."
              id = "search-result-input-wrapper"
              icon = "ios-search-outline"
              @on-enter = "changeQuery"
              @on-click = "changeQuery"
            />
          </div>
          <Divider style="margin:0.5rem 0 0 0" />
          <span>共{{count}}篇</span>
          </div>
      </iCol>
    </Row>
    <Row style="margin-top:2rem">
      <iCol
        :xs="{ span: 20, offset: 2}"
        :sm="{ span: 18, offset:3 }"
        :md="{ span: 16, offset: 4 }"
        :lg="{ span: 14, offset: 5 }"
      >
        <Page :total=count :current.sync=pageCount size="small" show-elevator simple @on-change="changePage" style="float:left"/>
        <Select
          size="small"
          placement="bottom-end"
          placeholder="按最后更新时间排序"
          style="width:100px; float:right"
          @on-change="changeOrder"
          v-model="orderBy"
        >
          <Option
            v-for="item in orderSelector"
            :value="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </iCol>
    </Row>
    <Row style="margin-top:2rem">
      <iCol
        :xs="{ span: 20, offset: 2}"
        :sm="{ span: 18, offset:3 }"
        :md="{ span: 16, offset: 4 }"
        :lg="{ span: 14, offset: 5 }"
      >
        <div
          v-for="item in articles"
          :key = "item.article.id"
          class = "search-result-article-card"
          style = ""
        >
          <span v-if= "item.article.article_fandom ==''">
            <Tag color="#9dd1a9">
              原创
           </Tag>
          </span>
          <span v-else>
            <Tag
              color="#9dd1a9"
              v-for= "str in item.article.article_fandom.split(',')"
              :key="str"
            >
              {{str}}
            </Tag>
          </span>
          <Tag v-if="item.article.article_rating == 'G' " color="#f7bb8e">G</Tag>
          <Tag v-else-if="item.article.article_rating == 'PG13' " color="#f7bb8e">PG-13</Tag>
          <Tag v-else-if="item.article.article_rating == 'R' " color="#ea534f">R</Tag>
          <Tag v-else color="#ea534f">NC-17</Tag>
          <span @click="jumpArticle(item.article.id)" id="title">{{item.article.article_title}}</span>
          <p id="summary" v-if="item.article.article_summary!=''">{{item.article.article_summary}}</p>
          <p id="summary" v-else>无内容简介</p>
          <Divider style="margin:0.8rem 0 0.5rem 0" />
          <div id="warning">
            <Icon type="ios-warning-outline" /><strong>警告：</strong>
            <span
              v-for="(str,i) in item.article.article_warning.split(',')"
              :key = "i"
            >
              <span v-if="str == 'No'">无警告内容</span>
              <span v-if="str == 'Violence'">详细的暴力描写</span>
              <span v-if="str == 'MainDeath'">主要角色死亡</span>
              <span v-if="str == 'Rape'">涉及强奸内容</span>
              <span v-if="str == 'Teen'">含有未成年角色</span>
              <span v-if="str == 'Unknown'">无警告内容</span>
              <span v-if="i!=item.article.article_warning.split(',').length-1">，</span>
              <span v-else>。</span>
            </span>
          </div>
          <div id = "wordcount">
            <Icon type="ios-book-outline" />字数：{{item.article.article_wordCount}}
            <Divider type="vertical" />
            <Icon type="ios-happy-outline" />性向：{{item.article.article_category}}
          </div>
          <div id = "relationship">
            <Icon type="ios-color-palette-outline" />配对 ：
            <span v-if="item.article.article_relationship==''"> 无 </span>
            <span
              v-for="(str,index) in item.article.article_relationship.split(',')"
              :key="index"
            >
              <span v-if="index!=item.article.article_relationship.split(',').length-1">
                {{str}} <Divider type="vertical" />
              </span>
              <span v-else>
                {{str}}
              </span>
            </span>
          </div>
          <div id="others">
            <span @click="jumpUser(item.users.id)">
              <strong>{{item.users.user_nickname}}</strong>
            </span>
            <Divider type="vertical" />
            <span>{{item.article.article_like}}个赞</span>
            <Divider type="vertical" />
            <span>{{item.article.article_view}}次阅读</span>
          </div>
        </div>
      </iCol>
      <iCol
        v-if="count == 0"
        :xs="{ span: 20, offset: 2}"
        :sm="{ span: 18, offset:3 }"
        :md="{ span: 16, offset: 4 }"
        :lg="{ span: 14, offset: 5 }"
      >
        <div class = "search-result-article-card">
          <p>没有找到您想要的文章哦</p>
        </div>
      </iCol>
    </Row>
    <BackTop :bottom="portable?50:30" :right="portable?10:30"></BackTop>
  </div>
</template>

<script>
import cookie from "js-cookie";
export default{
  data(){
    return{
      fandomList: [""],
      followedFandom: [""],
      relationshipList: [""],
      title: '',
      author: '',
      orderBy: 'recent',
      query: '',
      easySearch: false,
      noArticle: false,
      orderSelector: [
        {
          value: 'recent',
          label: '按最后更新时间排序'
        },
        {
          value: 'popular',
          label: '按热度排序'
        }
      ],
      count: 0,
      pageCount: 1,
      articles:{},
      addFandom:'',
      addRelationship:'',
      isFollowed:[]
    }
  },
  computed: {
    portable() {
      return window.screen.width < 1024;
    },
  },
  mounted(){
    if('query'in this.$route.query){
      console.log('easy search model');
      this.easySearch = true;
      this.query = this.$route.query.query;
      this.fetchSearchResult((this.pageCount-1)*10, 10);
    } else {
      console.log('complicate search model');
      this.easySearch = false;
      this.fandomList = this.$route.query.fandom.split("&%!");
      this.relationshipList = this.$route.query.relationship.split("&%!");
      this.title = this.$route.query.title;
      this.author = this.$route.query.author;
      // this.fetchSearchResult((this.pageCount-1)*10, 10);
      console.log('Page Mounted')
      this.fetchSearchResult((this.pageCount-1)*10, 10);
      // console.log(this.articles)
    }
  },
  methods:{
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
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
    handleAddFandom () {
      // console.log("在这里添加原作")
      if(this.addFandom!=''){
        //维护FandomList不为空数组且不含空字符串
        //FandomList初始化为[""]，插入第二项数据时需删除空白的第一项。
        // console.log("缓冲中")
        if(this.fandomList.length==1&&this.fandomList[0]==''){
          this.fandomList[0]=this.addFandom;
        } else {
          this.fandomList.push(this.addFandom);
        }
        this.addFandom='';
        this.pageCount=1;
        this.fetchSearchResult((this.pageCount-1)*10, 10)
      }
    },
    handleAddRelationship () {
      // console.log("在这里添加CP");
      if(this.addRelationship!=''){
        //同FandomList数组
        if(this.relationshipList.length==1&&this.relationshipList[0]==''){
          this.relationshipList[0]=this.addRelationship;
        } else {
          this.relationshipList.push(this.addRelationship);
        }
        this.addRelationship='';
        this.pageCount=1;
        this.fetchSearchResult((this.pageCount-1)*10, 10)
      }
    },
    deleteFandom (event, name) {
      // console.log(`删除第${name}项`);
      //维护fandomList数组，为空时重置为[""]
      if(this.fandomList.length==1){
        this.fandomList[0]=''
      } else {
        this.fandomList.splice(name, 1);
      }
      this.pageCount=1;
      this.fetchSearchResult((this.pageCount-1)*10, 10)
    },
    deleteRelationship (event, name) {
      //维护relationshipList数组，为空时重置为[""]
      if(this.relationshipList.length==1){
        this.relationshipList[0]=''
      } else {
        this.relationshipList.splice(name, 1);
      }
      this.pageCount=1;
      this.fetchSearchResult((this.pageCount-1)*10, 10);
    },
    changePage(pageCount){
      // console.log(`页码${pageCount}`);
      this.fetchSearchResult((pageCount-1)*10, 10);
    },
    changeTitle(){
      // console.log(this.pageCount,this.title);
      this.pageCount=1;
      this.fetchSearchResult((this.pageCount-1)*10, 10);
    },
    changeAuthor(){
      this.pageCount=1;
      this.fetchSearchResult((this.pageCount-1)*10, 10);
    },
    changeOrder(){
      this.pageCount=1;
      // console.log('result')
      this.fetchSearchResult((this.pageCount-1)*10, 10);
    },
    changeQuery(){
      this.pageCount=1;
      if(this.query === ''){
        // console.log('not null')
        this.$Message.warning({
            content: '关键词不能为空',
            duration: 10,
            closable: true
        });
        return;
      }
      this.fetchSearchResult((this.pageCount-1)*10, 10);
    },
    addtoFavorite(name){
      // console.log(name);
      const csrfToken = cookie.get("csrfToken");
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
      this.$axios.post(
        `/api/follow/fandom/${name}`,
        {},
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        // console.log(res);
        if(res.status === 200){
          if(res.data.msg === 'fandom followed!'){
            this.$Message.success({
              content: `已将${name}添加到您收藏的分类中`,
              duration: 10,
              closable: true
            });
            this.followedFandom.push(name);
          } else {
            this.$Message.success({
              content: `已取消${name}的收藏`,
              duration: 10,
              closable: true
            });
            const index = this.followedFandom.indexOf(name);
            if(index > -1) { this.followedFandom.splice(index, 1); }
          }
          this.$Spin.hide();
        }
      }).catch(error=>{
        if(error.response.status == 404){
          this.$Spin.hide();
          this.$Message.warning({
              content: `还没有人创建${name}相关哦`,
              duration: 10,
              closable: true
          });
        } else if(error.response.status == 403){
          this.$Spin.hide();
          this.jumpLogin();
        } else {
          this.$Spin.hide();
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    fandomIsFollowed(name){
      return this.followedFandom.includes(name, 0);
    },
    fetchSearchResult(offset, limit){
      // console.log(`offset ${offset} limit ${limit}`);
      const csrfToken = cookie.get("csrfToken");
      // console.log(csrfToken);
      /* console.log(`title: ${this.title}`)
      console.log(`fandom: ${this.fandomList}`)
      console.log(`relationship: ${this.relationshipList}`)
      console.log(`author: ${this.author}`) */

      const data = {}
      if(!this.easySearch){ //复杂搜索
      //去除传向后端的data里的空值，如果为空，直接不传这个字段
        if(this.title!=''){data.title=this.title}
        if(this.author!=''){data.author=this.author}
        if(this.fandomList.length!=0){data.fandom=this.fandomList}
        if(this.relationshipList.length!=0){data.relationship=this.relationshipList}
        data.limit=limit;
        data.offset=offset;
        data.orderBy=this.orderBy;
      } else { //简单搜索
        data.query = this.query;
        data.limit=limit;
        data.offset=offset;
        data.orderBy=this.orderBy;
      }
      //发送请求
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
      this.$axios.post(
        '/api/article/search', data,
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        // console.log(res);
        if(!res){
          this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
          });
        } else {
          if(res.status == 200){
            this.count = res.data.count;
            // console.log(this.count)
            this.articles = res.data.articles;
            this.followedFandom = res.data.followed_fandom;
            if(res.data.count==0){
              this.noArticle = true;
            }
            this.$Spin.hide();
          }
        }
      }).catch(error=>{
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.count = 0;
          this.$Message.warning({
              content: '请勿输入非法字符',
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
    }
  }
}
</script>


<style lang="less">

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
