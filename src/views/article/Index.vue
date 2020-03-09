<template>
  <div>
    <Row style="margin-top:2rem">
      <i-col :xs="{ span: 20, offset: 2}" :sm="{ span: 18, offset:3 }" :md="{ span: 16, offset: 4 }"
             :lg="{ span: 14, offset: 5 }">
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item href="/">
            <Icon type="ios-home-outline"></Icon>
            放逐地
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="pound"></Icon>
            文区
          </Breadcrumb-item>
        </Breadcrumb>
        <div
          id="post"
          style="height: 3rem; margin-bottom:1rem; cursor:pointer;"
          onclick="window.open('/article/new','_self')">
          <span>> 发表我的文章</span>
        </div>
        <span class="text-title">高级搜索</span>
        <Row style="display: flex;flex-wrap:wrap;">
          <i-col span="21">
            <div id="search">
              <Row style="padding:1em;display: flex;flex-wrap:wrap;">
                <i-col style="flex-grow: 1;flex-basis: calc(10em*.5);margin:.5rem 1rem">
                  <span style="display:block">原作</span>
                  <i-input v-model="fandom" placeholder="请输入..." style="width: 100%"></i-input>
                </i-col>
                <i-col style="flex-grow: 1;flex-basis: calc(12em*.5);margin:.5rem 1rem">
                  <span style="display:block">配对</span>
                  <i-input v-model="relationship" placeholder="请输入..." style="width: 100%"></i-input>
                </i-col>
                <i-col style="flex-grow: 1;flex-basis: calc(16em*.5);margin:.5rem 1rem">
                  <span style="display:block">标题</span>
                  <i-input v-model="title" placeholder="请输入..." style="width: 100%"></i-input>
                </i-col>
                <i-col style="flex-grow: 1;flex-basis: calc(10em*.5);margin:.5rem 1rem">
                  <span style="display:block">作者</span>
                  <i-input v-model="author" placeholder="请输入..." style="width: 100%"></i-input>
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
        </Row>
        <span class="text-title">我收藏的分类</span>
        <div class="wrap-card" style="height: 3rem; margin-bottom:1rem">
          <span style="float:left;" herf="/article">生化危机</span>
          <span style="float:right;">100阅读</span>
          <span style="float:right;">100喜欢</span>
        </div>
        <div class="wrap-card" style="height: 3rem; margin-bottom:1rem">
          <span style="float:left;" herf="/article">生化危机</span>
          <span style="float:right;">100阅读</span>
          <span style="float:right;">100喜欢</span>
        </div>
      </i-col>
    </Row>
  </div>
</template>



<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import router from "vue-router"
import {
  Article,
} from "@/types/api/article";

@Component
export default class SearchRequest extends Vue {
  fandom = ""
  relationship =""
  title = ""
  author = ""
  
  /* get searchData(){
    let req = {} as Article.Search.Request
    req.title = this.title
    req.fandom = this.fandom
    req.relationship = this.relationship
    req.author = this.author
    req.orderBy = "recent"
    return req
  }  */

  btnClick(){
    console.log(this.title)
    //输入内容不为空
    if([this.fandom, this.relationship, this.title, this.author].every( x => x == "" )){
      console.log("please enter something");
    }
    else{
      //console.log(this.searchData)
      //this.$store.commit('changeSearchData', this.searchData)
      this.$router.push({
        path:'/article/searchresult',
        query:{
          fandom:this.fandom,
          relationship:this.relationship,
          title:this.title,
          author:this.author,
        }
      })
    }
  }
}
</script>

<style scoped>
  .wrap-card {
    width: 100%;
    line-height: 3rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.3) inset,
    0 10px 15px 12px rgba(208, 208, 208, 0.5);
    border-radius: 18px;
    margin-top: 0.5rem;
    transition: all 0.3s linear;
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

  #post {
    width: 100%;
    line-height: 3rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.3) inset,
    0 10px 15px 12px rgba(208, 208, 208, 0.5);
    border-radius: 18px;
    margin-top: 0.5rem;
    transition: all 0.3s linear;
  }

  #post span {
    display: table-cell;
    padding-left: 1rem;
    vertical-align: middle;
    font-size: 1.2rem;
    color: rgba(95, 95, 95, 0.7);
    text-shadow: 0 1px 1px rgba(71, 68, 66, 0.6);
    font-family: "Arvo", "Myriad Pro", "Trebuchet MS", sans-serif;
  }

  #post:hover {
    /* background: rgba(170, 77, 27, 0.6); */
    transform: scale(1.02);
    box-shadow: 0 -1px 5px 4px rgba(224, 230, 228, 0.65) inset,
    0 3px 2px 2px rgba(208, 208, 208, 0.8);
  }

  #search {
    width: 100%;
    line-height: 2rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.2) inset,
    -10px 10px 15px 8px rgba(208, 208, 208, 0.5);
    border-radius: 18px 0 0 18px;
    margin-top: 0.5rem;
    transition: all 0.3s linear;
  }

  #search span {
    line-height: 2rem;
    padding-left: 3px;
  }

  #search-button {
    height: 8rem;
    box-shadow: 0 0 0 1px rgba(150, 149, 149, 0.15),
    -3px -3px 5px 1px #9dbbb61f inset,
    10px 10px 15px 8px rgba(208, 208, 208, 0.5);
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
</style>
