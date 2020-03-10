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
            <Icon type="ios-home-outline"></Icon>放逐地
          </Breadcrumb-item>
          <Breadcrumb-item href="/components/breadcrumb">
            <Icon type="social-buffer-outline"></Icon>文区
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="pound"></Icon>
            <span v-for= "str in req.fandom" v-bind:key="str">{{str}}、</span>
            <span v-for= "str in req.relationship" v-bind:key="str">{{str}}、</span>
          </Breadcrumb-item>
        </Breadcrumb>
        <div id="tag-card" style="padding:1rem 1rem 0.5rem 1rem; margin-top: 0.5rem;">
          <Tag
            type="dot"
            closable
            v-for= "str in fandomList"
            :key="str"
            :name = "str"
            @on-close="handleClose"
          >
            {{str}}
          </Tag>
          <Tag
            type="dot"
            closable
            v-for= "str in relationshipList"
            :key="str"
            :name = "str"
            @on-close="handleClose2"
          >
            {{str}}
          </Tag>
          <Button icon="ios-add" type="dashed" @click="handleAdd">添加标签</Button>
          <Divider style="margin:0.5rem 0 0 0" />
          <span>共{{res.count}}篇</span>
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
        <Page :total="res.count" size="small" show-elevator simple style="float:left"/>
        <Select
          size="small"
          placement="bottom-end"
          placeholder="按最后更新时间排序"
          style="width:100px; float:right"
        >
          <Option v-for="item in orderby" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
          v-for="article in articles"
          :key = "article.aid"
          class = "article-card"
          style = "line-height:1rem; margin: 0.5rem 0; padding: 1rem 1rem 2rem 1rem;"
        >
          <Tag
            checked="false"
            color="#9dd1a9"
            v-for= "str in article.fandom.split(';')"
            :key="str"
          >
            {{str}}
          </Tag>
          <Tag v-if="article.rating == 0 " checked="false" color="#f7bb8e">G</Tag>
          <Tag v-else-if="article.rating == 1 " checked="false" color="#f7bb8e">PG-13</Tag>
          <Tag v-else-if="article.rating == 2" checked="false" color="#ea534f">R</Tag>
          <Tag v-else checked="false" color="#ea534f">R</Tag>
          <span id="title">{{article.title}}</span>
          <span id="summary">{{article.note}}</span>
          <Divider style="margin:0.8rem 0 0.5rem 0" />
          <div id="author">
            <strong>{{article.author.username}}</strong>
            <Divider type="vertical" />
            <span>{{article.like}}个赞</span>
          </div>
        </div>
      </iCol>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import searchResponse from "../../../public/search.json";
import axios from "axios";
import { Article } from "@/types/api/article";

@Component
export default class SearchResult extends Vue {
  req = {} as Article.Search.Request;
  res = {} as Article.Search.Response;
  fandomList= [] as string[]
  relationshipList = [] as string[]
  articles: Article[] = []
  orderby = [
    {
      value: 'recent',
      label: '按最后更新时间排序'
    },
    {
      value: 'popular',
      label: '按热度排序'
    }
  ]
  /* get searchData(){
    return this.$store.state.searchData
  }  */
  relationshipText: string;
  fandomText: string;
  handleAdd () {
    console.log("在这里添加search请求")
  }
  handleClose (event, name) {
    const index = this.fandomList.indexOf(name);
    this.fandomList.splice(index, 1);
  }
  handleClose2 (event, name) {
    const index = this.relationshipList.indexOf(name);
    this.relationshipList.splice(index, 1);
  }
  async beforeMount() {
    console.log("search Result Page Mounted");
    this.req.fandom = String(this.$route.query.fandom).split(";");
    this.req.relationship = String(this.$route.query.relationship).split(";");
    this.req.title = String(this.$route.query.title);
    this.req.author = String(this.$route.query.author);
    this.req.orderBy = "recent";
    this.fandomList = this.req.fandom;
    this.relationshipList = this.req.relationship;
    //this.res = await Article.search(this.req)
    console.log("Has found " + searchResponse.count + " results")
    this.res.count = searchResponse.count
    this.articles = []
    this.articles = searchResponse.articles
    console.log(this.articles)
  }
} 
</script>


<style scoped>
#tag-card {
  width: 100%;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
    0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
#tag-text {
  font: size 1rem;
  padding-left: 1rem;
}
.article-card {
  width: 100%;
  line-height: 1.5rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
    0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
.article-card #title{
  font-size: 1.1rem;
  line-height: 1.2rem;
  color: rgba(83, 81, 81, 0.8);
  text-shadow: 0px 1px 1px rgba(71, 68, 66, 0.2);
  font-family: "Arvo", "Myriad Pro", "Trebuchet MS", sans-serif;
}
.article-card #summary{
  display: block;
  margin-top:1rem;
}
.article-card #author{
  display: block;
  float: right;
  height:1rem;
}
</style>
