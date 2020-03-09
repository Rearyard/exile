<template>
  <div>
    <Row style="margin-top:2rem">
      <iCol :xs="{ span: 20, offset: 2}" :sm="{ span: 18, offset:3 }" :md="{ span: 16, offset: 4 }" :lg="{ span: 14, offset: 5 }">
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item href="/">
              <Icon type="ios-home-outline"></Icon>放逐地
          </Breadcrumb-item>
          <Breadcrumb-item href="/components/breadcrumb">
              <Icon type="social-buffer-outline"></Icon>文区
          </Breadcrumb-item>
          <Breadcrumb-item>
              <Icon type="pound"></Icon>{{$route.query.req[0]}}、{{$route.query.req[1]}}
          </Breadcrumb-item>
        </Breadcrumb>
        <div
          id="tag-card"
          style="height: 7rem; padding-left:1rem; padding-top:1rem">
            <Tag type="dot" closable>{{req.fandom}}</Tag>
            <Tag type="dot" closable>{{req.relationship}}</Tag>
            <Divider style="margin:0.5rem 0"/>
        </div>
      </iCol>
    </Row>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import searchResponse from '../../../public/search.json'
import axios from "axios"
import {
  Article,
} from "@/types/api/article";

@Component
export default class SearchResult extends Vue{
  req = {} as Article.Search.Request
  res = {} as Article.Search.Response
  /* get searchData(){
    return this.$store.state.searchData
  }  */
  async mounted(){
    console.log("search Result Page Mounted")
    //console.log(this.$route.query.req[0])
    this.req.fandom = this.$route.query.req[0]
    this.req.relationship[0] = this.$route.query.req[1]
    this.req.title = this.$route.query.req[2]
    this.req.author = this.$route.query.req[3]
    this.req.orderBy = 'recent'
    //this.res = await Article.search(this.req)
    console.log("Has found " + searchResponse.count + " results")
    
  }
}
</script>


<style scoped>
#tag-card {
  width:100%; 
  height: 4rem;
  line-height: 3rem;
  background-color: #ffffff;
  box-shadow:
    0px 0px 5px 0px rgba(208,208,208,0.3) inset,
    0px 10px 15px 12px rgba(208,208,208,0.5);
  border-radius:18px;
  margin-top:0.5rem;
}
#tag-text{
  font: size 1.2rem;
  padding-left: 1rem;
}
</style>
