<template>
  <div>
    <Row style="margin-top:2rem">
      <i-col :xs="{ span: 20, offset: 2}" :sm="{ span: 18, offset:3 }" :md="{ span: 16, offset: 4 }"
             :lg="{ span: 14, offset: 5 }">
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item href="/">
            <Icon type="ios-home-outline"></Icon>
            后花园
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="pound"></Icon>
            文区
          </Breadcrumb-item>
        </Breadcrumb>
        <Row>
          <i-col span="23">
            <router-link to="/article/new">
              <div
                id="search-post"
                style="height: 3rem; margin-bottom:1rem; cursor:pointer;">
                <span>> 发表我的文章</span>
            </div>
            </router-link>
          </i-col>
          <i-col span="1">
            <div style="width:100%"></div>
          </i-col>
        </Row>
        <span class="text-title">
          高级搜索
          <iSwitch true-color="#a2d6cd" size="small" v-model = "easySearch"/>
          模糊搜索
        </span>
        <div v-if = "easySearch" class = "search-wrapper">
          <Row>
            <i-col span="20">
              <div id ="easy-search" style = "height: 2.5rem;">
                <Input v-model="query" placeholder="请输入想要搜索的标题/CP/原作等。" style="width: 100%; height:100%" />
              </div>
            </i-col>
            <i-col span = "3">
              <div id="search-button" style="height:2.5rem; line-height:2.5rem;" @click = "easySearchClick()">
                <img
                  src="../../assets/search.png"
                  height="100%"
                  style="clear: both; display: block; margin: auto;"
                />
              </div>
            </i-col>
          </Row>
        </div>
        <div v-else>
          <Row style="display: flex;flex-wrap:wrap;">
            <i-col span="20">
              <div id="search">
                <Row style="padding:1rem;display: flex;flex-wrap:wrap;">
                  <i-col style="flex-grow: 1;flex-basis: calc(10em*.5);margin:.5rem 1rem">
                    <span style="display:block">标题</span>
                    <i-input
                      v-model="title"
                      placeholder="请输入..."
                      class="search-input"
                      style="width: 100%"
                    ></i-input>
                  </i-col>
                  <i-col style="flex-grow: 1;flex-basis: calc(12em*.5);margin:.5rem 1rem">
                    <span style="display:block">作者</span>
                    <i-input
                      v-model="author"
                      placeholder="用空格分割"
                      style="width: 100%"
                    ></i-input>
                  </i-col>
                  <i-col style="flex-grow: 1;flex-basis: calc(16em*.5);margin:.5rem 1rem">
                    <span style="display:block">原作</span>
                    <Select
                      v-model="fandom"
                      multiple
                      allow-create
                      filterable
                      placeholder="按回车添加多个原作"
                      remote
                      :remote-method="fandomPreSearch"
                      :loading="loading.fandom"
                      id = "cp-selector"
                    >
                      <Option
                        v-for="(item) in options.fandomOptions"
                        :value="item.fandom_name"
                        :key="item.id"
                      >{{item.fandom_name}}</Option>
                    </Select>
                  </i-col>
                  <i-col style="flex-grow: 1;flex-basis: calc(10em*.5);margin:.5rem 1rem">
                    <span style="display:block">配对</span>
                    <Select
                      v-model="relationship"
                      placeholder="按回车添加多个CP"
                      multiple
                      allow-create
                      filterable
                      remote
                      :remote-method="cpPreSearch"
                      :loading="loading.cp"
                      id = "cp-selector"
                    >
                      <Option
                        v-for="(item) in options.cpOptions"
                        :value="item.cp_name"
                        :key="item.id"
                      >{{item.cp_name}}</Option>
                    </Select>
                  </i-col>
                </Row>
              </div>
            </i-col>
            <i-col span="3">
              <div
                id="search-button"
                style="height: calc(100% - .5rem);display: flex;align-items: center"
                @click=btnClick()>
                <img src="../../assets/search.png" width="100%" style="vertical-align: middle;"/>
              </div>
            </i-col>
            <i-col span="1">
              <div style="width:100%"></div>
            </i-col>
          </Row>
        </div>
        <span class="text-title">我收藏的分类</span>
        <Row>
          <i-col span="23">
            <div v-if="fandomCount!=0">
              <Row style="margin-top:1rem; margin-bottom:1rem">
                <Page
                  :total=fandomCount
                  :current.sync=fandomPageCount
                  size="small"
                  :page-size=5
                  show-elevator
                  simple
                  @on-change="changeFandomPage"
                  style="float:left"
                />
              </Row>
              <div
                v-for="item in fandoms.fandom"
                :key="item.id"
                class="search-wrap-card"
                style = "height: 3rem; margin-bottom:1rem"
              >
                <span style="float:left;" @click="jumpSearchFandom(item.fandom_name)">
                  {{item.fandom_name}}
                </span>
                <span style="float:right;">
                  <Icon @click="addtoFavorite(item.fandom_name)" type="md-star" size="24"/>
                </span>
                <span style="float:right;" @click="jumpSearchFandom(item.fandom_name)">
                  {{item.fandom_article_amount}}篇文章
                </span>
              </div>
            </div>
            <div v-else class="search-wrap-card">
              <span>暂无收藏的分类哦</span>
            </div>
          </i-col>
        </Row>
      </i-col>
    </Row>
  </div>
</template>



<script>
import { mapMutations } from "vuex";
import cookie from 'js-cookie'
import array from "lodash/array";

export default {
  data(){
    return {
      fandom : [],
      relationship : [],
      title : '',
      author : '',
      query : '',
      easySearch : false,
      fandoms : {},
      fandomCount : 0,
      fandomPageCount : 1,
      loading: {
        cp: false,
        fandom: false,
      },
      options: {
        cpOptions: [],
        fandomOptions: [],
      },
      fandomList: '',
      relationshipList: '',
    }
  },
  /* get searchData(){
    let req = {} as Article.Search.Request
    req.title = this.title
    req.fandom = this.fandom
    req.relationship = this.relationship
    req.author = this.author
    req.orderBy = "recent"
    return req
  }  */
  mounted() {
    this.getFavoriteFandom(0,5);
  },
  computed:{
    csrfToken() {
      return cookie.get("csrfToken");
    },
  },
  methods:{
    btnClick(){
      //输入内容不为空
      if([this.fandom, this.relationship, this.title, this.author].every( x => x == "" )){
        console.log("please enter something");
      } else{
        this.$router.push({
          path:'/article/searchresult',
          query:{
            fandom: this.fandom.join('&%!'),
            relationship: this.relationship.join('&%!'),
            title: this.title,
            author: this.author,
          }
        })
      }
    },
    easySearchClick(){
      if(this.query === ''){
        console.log("please enter something");
      } else {
        this.$router.push({
          path:'/article/searchresult',
          query:{
            query : this.query
          }
        })
      }
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
      this.$axios.get(`/api/user/${this.$store.state.user.id}/follow/fandom`, {
        params: {
          offset: offset,
          amount: amount
        }
      }).then(res => {
        // console.log(res)
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
    },
    changeFandomPage(fandomPageCount){
      this.getFavoriteFandom((fandomPageCount-1)*5, 5);
    },
    cpPreSearch(text) {
      const csrfToken = cookie.get("csrfToken");
      console.log(csrfToken)
      if (text != "") {
        this.loading.cp = true;
        this.$axios
          .post(
            "/api/article/presearch",
            { type: "relationship", query: text },
            {
              headers: { "x-csrf-token": this.csrfToken },
              withCredentials: true
            }
          )
          .then(res => {
            this.options.cpOptions = res.data;
            this.loading.cp = false;
          });
      }
    },
    fandomPreSearch(text) {
      const csrfToken = cookie.get("csrfToken");
      if (text != "") {
        this.loading.fandom = true;
        this.$axios
          .post(
            "/api/article/presearch",
            { type: "fandom", query: text },
            {
              headers: { "x-csrf-token": csrfToken },
              withCredentials: true
            }
          )
          .then(res => {
            this.options.fandomOptions = res.data;
            this.loading.fandom = false;
          });
      }
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
        console.log(res);
        if(res.status === 200){
          if(res.data.msg === 'fandom followed!'){
            this.$Message.success({
              content: `已将${name}添加到您收藏的分类中`,
              duration: 10,
              closable: true
            });
          } else {
            this.$Message.success({
              content: `已取消${name}的收藏`,
              duration: 10,
              closable: true
            });
          }
          this.$Spin.hide();
          this.getFavoriteFandom(0,5);
          this.fandomPageCount = 1;
        }
      }).catch(error => {
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
  }
}
</script>

<style>

.search-wrap-card {
  width: 100%;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.2) inset,
  0 5px 10px 5px rgba(208, 208, 208, 0.3);
  border-radius: 18px;
  margin-top: 0.5rem;
  transition: all 0.3s linear;
}

.search-wrap-card span {
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

#search-post {
  width: 100%;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.2) inset,
  0 5px 10px 5px rgba(208, 208, 208, 0.3);
  border-radius: 18px;
  margin-top: 0.5rem;
  transition: all 0.3s linear;
}

#search-post span {
  display: table-cell;
  padding-left: 1rem;
  vertical-align: middle;
  font-size: 1.2rem;
  color: rgba(95, 95, 95, 0.7);
  text-shadow: 0 1px 1px rgba(71, 68, 66, 0.6);
  font-family: "Arvo", "Myriad Pro", "Trebuchet MS", sans-serif;
}

#search-post:hover {
  /* background: rgba(170, 77, 27, 0.6); */
  transform: scale(1.02);
  box-shadow: 0 -1px 5px 4px rgba(224, 230, 228, 0.65) inset,
  0 3px 2px 2px rgba(208, 208, 208, 0.8);
}

#search {
  width: 100%;
  height: calc(100% - 0.5rem);
  line-height: 2rem;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.2) inset,
  -10px 10px 15px 8px rgba(208, 208, 208, 0.3);
  border-radius: 18px 0 0 18px;
  margin-top: 0.5rem;
  transition: all 0.3s linear;
}


#search span {
  line-height: 2rem;
  padding-left: 3px;
}

#easy-search{
  width: 100%;
  height: calc(100% - 0.5rem);
  line-height: 2rem;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.2) inset,
  -10px 10px 15px 8px rgba(208, 208, 208, 0.3);
  border-radius: 18px 0 0 18px;
  margin-top: 0.5rem;
  transition: all 0.3s linear;
}
#easy-search input {
  line-height: 2rem;
  border-radius: 18px 0 0 18px;
  height:100%;
}

#search-button {
  height: 8rem;
  box-shadow: 0 0 0 1px rgba(150, 149, 149, 0.15),
  -3px -3px 5px 1px #9dbbb61f inset,
  10px 10px 15px 8px rgba(208, 208, 208, 0.3);
  line-height: 8rem;
  margin-top: 0.5rem;
  border-radius: 0 18px 18px 0;
  cursor: pointer;
  transition: all 0.3s linear;
}

#search-button span {
  padding-left: 1rem;
  margin: 0 auto;
}

#search-button:hover {
  box-shadow: 0 0 0 2px rgba(199, 199, 199, 0.4),
  -3px -3px 6px 1px #9dbbb675 inset,
  10px 10px 15px 8px rgba(208, 208, 208, 0.5);
  transform: scale(1.05);
}

.text-title {
  display: block;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

#cp-selector span{
  line-height: 22px;
}


</style>
