<template>
  <div v-if="article">
    <Row style="margin-top:2rem">
      <i-col
        :xs="{ span: 20, offset: 2}"
        :sm="{ span: 18, offset:3 }"
        :md="{ span: 16, offset: 4 }"
        :lg="{ span: 14, offset: 5 }"
      >
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item to="/">
            <Icon type="ios-home-outline"></Icon>
            放逐地
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="social-buffer-outline"></Icon>
            文区
          </Breadcrumb-item>
          <BreadcrumbItem :to="'/article/' + this.$route.params.aid">
            <Icon type="pound"/>
            {{article.title}}
          </BreadcrumbItem>
          <BreadcrumbItem v-if="selectedChapter">
            <Icon type="pound"/>
            第 {{selectedChapter.cid+1}} 章
          </BreadcrumbItem>
        </Breadcrumb>

        <div class="wrap-card">
          <div class="article-header">
            <h1>{{article.title}}</h1>
            <span>{{article.summary}}</span>
            <span style="font-size: 130%">BY {{article.author.username}} | 分级 {{ratingString}}</span>
            <span>
              <Icon type="ios-alert"/>
              :
              {{article.warning.join(' ')}}
            </span>
            <span>注释: {{article.note}}</span>
            <div class="article-stats">
              <span>点赞: {{article.like}} 字数: {{article.wordCount}}</span>
            </div>
          </div>

          <Divider class="my-divider"/>

          <div class="article-body" v-if="article.chapters.length">
            <div v-if="!selectedChapter" style="width: 100%">
              <div v-if="!portable">
                <div style="text-align: center">
                  <div class="toc-header-box">目录</div>
                </div>
                <br/>
                <Row :gutter="16">
                  <i-col span="6">章节名</i-col>
                  <i-col span="6">概要</i-col>
                  <i-col span="2">评论</i-col>
                  <i-col span="5">发布时间</i-col>
                  <i-col span="5">最后修改</i-col>
                </Row>
                <Divider class="my-divider slim-divider"/>

                <Row
                  class="chapter-summary"
                  :gutter="16"
                  v-for="chapter of article.chapters"
                  v-bind:key="chapter.cid"
                  v-on:click.native="openChapter(chapter.cid)"
                >
                  <i-col span="6">{{chapter.title}}</i-col>
                  <i-col span="6">{{chapter.summary}}</i-col>
                  <i-col span="2">{{chapter.commentCount}}</i-col>
                  <i-col span="5">{{dateIntToString(chapter.publish)}}</i-col>
                  <i-col span="5">{{dateIntToString(chapter.edit)}}</i-col>
                </Row>

                <Divider class="my-divider slim-divider"/>
              </div>

              <div v-if="portable">
                <div style="text-align: center">
                  <div class="toc-header-box">目录</div>
                </div>
                <br/>
                <i-col span="5">章节名</i-col>
                <Divider class="my-divider slim-divider"/>

                <Row
                  class="chapter-summary"
                  v-for="chapter of article.chapters.slice((chapterListPage-1)*10, chapterListPage*10)"
                  v-bind:key="chapter.cid"
                >{{chapter.title}}
                </Row>

                <Divider class="my-divider slim-divider"/>
              </div>

              <div class="page-turner" style="justify-content: flex-end">
                <i-button size="small">上一页</i-button>
                <div style="display: flex; align-items: center">
                  <span style="color: rgba(74, 144, 226, 1)">{{chapterListPage}}</span>
                  / {{Math.ceil(article.chapters.length / 10)}}
                </div>
                <i-button size="small">下一页</i-button>
                <i-button size="small">尾页</i-button>
              </div>
            </div>

            <div v-if="selectedChapter">
              <h1>第{{selectedChapter.cid+1}}章</h1>
              简介: {{selectedChapter.summary}}
              <hr/>
              <p v-for="(p,idx) in selectedChapter.content.split('\n')" :key="idx">
                {{p}}
              </p>
            </div>
          </div>

          <Divider class="my-divider"/>

          <div class="article-footer">本文著作权为作者 {{article.author.username}} 所有，未经作者授权禁止转载</div>
        </div>

        <Row :gutter="32" class-name="article-buttons">
          <i-col span="8" style="text-align: center">
            <i-button
              class="cute-button"
              icon="ios-heart-outline"
              style="background-color: rgba(157, 209, 169, 1)"
            >收藏
            </i-button>
          </i-col>
          <i-col span="8" style="text-align: center">
            <i-button
              class="cute-button"
              icon="ios-heart-outline"
              style="background-color: rgba(244, 179, 207, 1)"
            >喜欢
            </i-button>
          </i-col>
          <i-col span="8" style="text-align: center">
            <i-button
              class="cute-button"
              icon="ios-cash-outline"
              style="background-color: rgba(255, 195, 0, 1)"
            >赞助
            </i-button>
          </i-col>
        </Row>

        <div>
          <div v-if="comments.length">
            <div
              class="wrap-card comment-card"
              v-for="comment of comments.slice((commentListPage-1)*10, commentListPage*10)"
              v-bind:key="comment.id"
            >
              <div>{{comment.author}}</div>
              <div>{{comment.like}}</div>
              <div>{{comment.content}}</div>
              <div>{{dateIntToString(comment.publish)}}</div>
            </div>

            <div class="page-turner">
              <i-button size="small">上一页</i-button>
              <div
                style="display: flex; align-items: center"
              >{{commentListPage}} / {{Math.ceil(comments.length / 10)}}
              </div>
              <i-button size="small">下一页</i-button>
              <i-button size="small">尾页</i-button>
            </div>
          </div>
          <div class="wrap-card comment-panel">
            <h1>评论</h1>
            <Input
              v-model="commentInput"
              maxlength="200"
              show-word-limit
              type="textarea"
              placeholder="请友善发言并遵守《国际膜蛤公约》"
              style="width: 100%; resize: none; margin-top: 2em"
              size="large"
              :rows="5"
            />
            <div style="text-align: right; padding-top: 1em">
              <i-button
                class="cute-button"
                icon="ios-checkmark"
                style="background-color: rgba(157, 209, 169, 1)"
                @click="submitComment()"
              >提交
              </i-button>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script lang="ts">
  import {
    Article,
    ArticleStruct,
    Chapter,
    Rating,
    Comment
  } from "@/types/api/article";
  import moment from "moment";
  import router from '../../router';
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {Route} from "vue-router";
  //类的定义，需要加上组件装饰器，类名就是组件名
  @Component
  export default class ArticleContent extends Vue {
    //data直接写在类里，[字段名]:[类型]=[初始值]，类型可以自动推断时省略
    article: ArticleStruct = null
    comments: Comment[] = []
    selectedChapter: Chapter = null
    commentInput = ""
    chapterListPage = 1
    commentListPage = 1

//生命周期钩子照常写
    async mounted() {
      this.article = await Article.getDetail(this.$route.params.aid).then(
        v => v.article
      );
      this.comments = [];
      if (this.$route.params.cid) {
        this.openChapter(this.$route.params.cid);
      }
    }

//computed改为getter，直接写在类里面
    get ratingString() {
      return Rating[this.article.rating];
    }

    get portable() {
      return window.screen.width < 1024;
    }

//methods直接写在类里面
    //参数参数如此指定类型，返回值类型可以自动推断时省略
    dateIntToString(x: number) {
      return moment(x).format("YYYY-MM-DD HH:MM:SS");
    }

    //number|string表示参数类型可以为number或string
    openChapter(cid: number | string) {
      // 通过挂在 $route 上的钩子实现跳转
      router.push({
        path: `/article/${this.$route.params.aid}/${cid}`,
      });
    }

    async loadComment(limit, offset) {
      this.comments = [];
      this.comments = await Comment.getComment(
        this.$route.params.aid,
        this.$route.params.cid,
        limit,
        offset
      ).then(v => v.comments);
    }

//watch的函数直接写在类里，函数名任意给定，在前面加上如此的装饰器声明监视的路径
    @Watch('$route')
    async $routeChange(to: Route, from: Route) {
      if (to.params.aid != from.params.aid) {
        // article 之间跳转, 全部刷新
        this.article = await Article.getDetail(this.$route.params.aid).then(
          v => v.article
        );
        this.comments = [];
      }

      if (to.params.cid) {
        if (from.params.cid != to.params.cid) {
          this.selectedChapter = null;
          this.selectedChapter = await Chapter.getChapters(
            this.$route.params.aid,
            1,
            ~~to.params.cid
          ).then(v => v.chapters[0]);
          this.loadComment(10, 0);
        }
      } else {
        this.selectedChapter = null;
        this.comments = [];
      }
    }
  }
</script>

<style scoped>
  .wrap-card {
    width: 100%;
    line-height: 2rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.3) inset,
    0 10px 15px 12px rgba(208, 208, 208, 0.5);
    border-radius: 18px;
    margin-top: 0.5rem;
    transition: all 0.2s linear;
    padding-left: 2em;
    padding-right: 2em;
  }

  .demo-breadcrumb-separator {
    color: #000000;
    padding: 0 5px;
  }

  .article-header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    text-align: center;
    margin-top: 3em;
    padding: 3em 3em 0 3em;
    min-height: 200px;
    /* align-items: center; */
  }

  .article-body {
    display: flex;
    width: 100%;
    padding: 2em 3em 2em 3em;
  }

  .article-footer {
    display: flex;
    width: 100%;
    margin-top: 3em;
    align-items: center;
    text-align: center;
    flex-direction: column;
  }

  .article-stats {
    margin-top: 2em;
    color: #9ea7b4;
    width: 100%;
    text-align: right;
  }

  .article-buttons {
    /* align-items: center; */
    margin: 3em auto 2em auto !important;
    width: 300px !important;
  }

  .cute-button {
    width: 73px;
    height: 36px;
    border-radius: 12px;
    padding-left: 0;
    padding-right: 0;
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
    line-height: 150%;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .toc-header-box {
    margin-left: auto;
    margin-right: auto;
    width: 4rem;
    padding: 0.5rem 0 0.5rem 0 !important;
    border-top: 1px solid #9ea7b4;
    border-bottom: 1px solid #9ea7b4;
    font-size: 150%;
    padding: 1rem;
  }

  .my-divider {
    background: #9ea7b4;
  }

  .slim-divider {
    margin: 0;
  }

  .chapter-summary {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chapter-summary > div {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .comment-card {
    padding: 1em;
  }

  .comment-panel {
    padding: 3em 2em 2em 2em;
  }

  .comment-input {
    margin-top: 1em;
  }

  .page-turner {
    display: flex;
    margin: 1em 0 1em 0;
  }
</style>