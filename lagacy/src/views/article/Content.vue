<!-- eslint-disable -->
<!--suppress ALL -->
<template>
  <div v-if="article">
    <div style="margin-top:2rem;display:flex;justify-content: center;">
      <div style="flex: 0 1 720px;box-sizing: border-box;max-width: 720px">
        <Breadcrumb separator=" > " style="margin-bottom: 2rem">
          <Breadcrumb-item to="/">
            <Icon type="ios-home-outline"></Icon>后花园
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="social-buffer-outline"></Icon>文区
          </Breadcrumb-item>
          <BreadcrumbItem :to="'/article/' + this.$route.params.aid">
            <Icon type="pound" />
            {{ article.title }}
          </BreadcrumbItem>
          <BreadcrumbItem v-if="selectedChapter">
            <Icon type="pound" />
            {{ selectedChapter.title }}
          </BreadcrumbItem>
        </Breadcrumb>
        <div class="wrap-card">
          <!--头部-->
          <div class="article-header" :class="{ 'article-header-portable': portable }">
            <Row>
              <iCol span="24">
                <h1>{{ article.title }}</h1>
              </iCol>
            </Row>
            <span style="color: #666">{{ article.summary }}</span>
            <div style="display: grid;grid-template-columns: 36px auto;align-items: center;">
              <Avatar
                v-if="author.avatar"
                :src="author.avatar"
                size="24"
                style="justify-self: center"
              />
              <Icon v-else type="md-contact" size="24" />
              <div>
                <span @click="jumpUserCenter(author.uid)" style="text-decoration: underline; cursor: pointer">{{author.nickname}}</span>
              </div>
              <Icon type="md-funnel" size="24" />
              <div>
                <Tag color="success" v-for="tag in tags" :key="tag">{{tag}}</Tag>
                <Tag color="#66BAB7" v-for="fandom in fandoms" :key="fandom">{{fandom}}</Tag>
                <Tag
                  color="#00896C"
                  v-for="relationship in relationships"
                  :key="relationship"
                >{{relationship}}</Tag>
              </div>
              <Icon type="md-funnel" size="24" />
              <div>
                <Tag :color="ratingColor" style="font-weight: bold">
                  {{
                  article.rating
                  }}
                </Tag>
              </div>
              <Icon type="md-warning" size="24" />
              <div>
                <Tag v-for="w in warnings" :key="w">{{ w }}</Tag>
              </div>
              <Icon type="md-information-circle" size="24" v-if="article.note" />
              <div v-if="article.note">{{ article.note }}</div>
            </div>
            <Row type="flex" justify="space-between" class="article-stats">
              <iCol>
                <ButtonGroup v-if="author.uid==$store.state.user.id">
                  <Button
                    type="info"
                    @click="$router.push('/article/'+article.id)"
                    v-if="selectedChapter"
                  >目录</Button>
                  <Button type="info" @click="jumpEdit">编辑{{selectedChapter?"章节":"文章"}}</Button>
                  <Button type="info" v-if="!selectedChapter" @click="modifyChapter">{{chapterModify?"退出管理":"管理章节"}}</Button>
                  <Button type="info" @click="jumpNewChapter">写新章节</Button>
                </ButtonGroup>
              </iCol>
              <iCol>
                <span style="color:#9ea7b4">
                  <Icon type="md-heart-outline" />
                  {{ article.like }}
                  <Icon type="md-star-outline" />
                  {{ article.favorite }}
                  字数 {{ article.wordCount }}
                </span>
              </iCol>
            </Row>
          </div>

          <Divider class="my-divider" />
          <!--主要内容-->
          <div
            class="article-body"
            :class="{ 'article-body-portable': portable }"
            v-if="article.chapters.length"
          >
            <div v-if="!selectedChapter" style="width: 100%">
              <!--              卡片-->
              <List item-layout="vertical">
                <ListItem v-for="(chapter,index) in chapters" :key="index">
                  <Row type="flex" justify="space-between" style="width: 100%">
                    <iCol>
                      <router-link
                        class="card-title"
                        :to="'/article/'+article.id+'/'+chapter.id"
                      >{{chapter.title}}</router-link>
                    </iCol>
                    <iCol>
                      <Time :time="chapter.published" />
                      <Button type="error" icon="ios-trash" v-if="chapterModify" @click="showDeleteModal(chapter.id,chapter.title,index)"></Button>
                    </iCol>
                  </Row>
                  <Row type="flex" justify="space-between">
                    <iCol>{{chapter.summary}}</iCol>
                    <iCol>
                      <span class="card-sub">
                        最近编辑：
                        <Time :time="chapter.last_edit" />
                      </span>
                    </iCol>
                  </Row>
                </ListItem>
              </List>
            </div>
            <div v-else style="width:100%">
              <h2>{{ selectedChapter.title }}</h2>
              <div v-if="selectedChapter.summary">摘要: {{ selectedChapter.summary }}</div>
              <div v-if="selectedChapter.note">注释: {{ selectedChapter.note }}</div>
              <hr />
              <div
                style="letter-spacing: 1px; text-align: justify;line-height: 2em;margin: 1em 0;white-space: break-spaces;word-break: break-all;"
                v-for="(p, idx) in (selectedChapter.content || '<空>').split(
                  '\n'
                )"
                :key="idx"
                v-html="p"
              ></div>
              <Row type="flex" justify="center" style="text-align: center">
                <iCol :span="4">
                  <Button :disabled="!preCid" @click="preChar" icon="md-arrow-back" type="text"></Button>
                </iCol>
                <iCol :span="4">
                  <Button @click="jumpIndex" icon="md-list" type="text"></Button>
                </iCol>
                <iCol :span="4">
                  <Button
                    :disabled="!nextCid"
                    @click="nextChar"
                    icon="md-arrow-forward"
                    type="text"
                  ></Button>
                </iCol>
              </Row>
            </div>
          </div>
          <Divider class="my-divider divider-footer" />
          <div class="article-footer">
            本文著作权为作者
            <span style="text-decoration: underline">
              {{
              author.nickname
              }}
            </span>
            所有，未经作者授权禁止转载
          </div>
        </div>
        <!--底端按钮-->
        <Row :gutter="32" class-name="article-buttons">
          <iCol span="8" style="text-align: center">
            <i-button
              class="cute-button"
              @click="fav"
              :icon="judgement.articleFav ? 'md-star' : 'md-star-outline'"
              type="success"
            >{{ judgement.articleFav ? "取消" : "收藏" }}</i-button>
          </iCol>
          <iCol span="8" style="text-align: center">
            <i-button
              @click="like"
              class="cute-button"
              :icon="judgement.articleLike ? 'md-heart' : 'md-heart-outline'"
              type="error"
              style="background-color: rgba(244, 179, 207, 1);border-color: rgb(244, 179, 207);"
            >{{ judgement.articleLike ? "取消" : "喜欢" }}</i-button>
          </iCol>
          <iCol span="8" style="text-align: center">
            <i-button disabled class="cute-button" icon="logo-yen" type="warning">赞助</i-button>
          </iCol>
        </Row>
        <div>
          <div v-if="comments.length" style="margin: 0 1em">
            <Page
              :current.sync="commentListPage"
              :total="selectedChapter.comment_count"
              size="small"
              show-elevator
              style="margin-bottom: 1em"
            />
            <Card v-for="c in comments" :key="c.author.id">
              <div
                slot="title"
                style="display: flex;justify-content: space-between;align-items: center"
              >
                <div style="display: flex;justify-content: left;align-items: center">
                  <Avatar
                    v-if="c.author.avatar"
                    :src="c.author.avatar"
                    size="24"
                    style="justify-self: center"
                  />
                  <Icon v-else type="md-contact" size="24" />
                  <div style="margin-left: 12px">
                    <a
                      style="color:#222;text-decoration: underline"
                      href="javascript:;"
                    >{{ c.author.nickname }}</a>
                  </div>
                </div>
                <div style="display: flex;justify-content: right;align-items: center">
                  <Button
                    v-if="$store.state.user.id === c.author.id"
                    size="small"
                    icon="md-trash"
                    type="error"
                    ghost
                    shape="circle"
                    style="border: none"
                    @click="delComment(c.id)"
                  />
                  <span style="color: #777">
                    {{
                    moment(c.published).fromNow()
                    }}
                  </span>
                  <span class="vertical-hr" />
                  <div style="display: flex;flex-direction: column;align-items: center">
                    <Icon type="md-heart-outline" />
                    <div style="font-size: 50%">{{ c.like }}</div>
                  </div>
                </div>
              </div>
              <p>{{ c.content }}</p>
            </Card>
            <Page
              :current.sync="commentListPage"
              :total="selectedChapter.comment_count"
              size="small"
              show-elevator
              style="margin-top: 1em"
            />
          </div>
          <div class="wrap-card comment-panel" v-if="$route.params.cid">
            <h1>评论</h1>
            <Input
              v-model="commentInput"
              maxlength="200"
              show-word-limit
              type="textarea"
              placeholder="请友善发言并遵守《国际卖萌公约》"
              style="width: 100%; resize: none; margin-top: 2em"
              size="large"
              :rows="5"
            />
            <div style="text-align: right; padding-top: 1em">
              <i-button
                class="cute-button"
                icon="md-checkmark"
                type="success"
                @click="submitComment"
              >提交</i-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/*eslint-disable*/
import {
  Article,
  ArticleStruct,
  Chapter,
  Rating,
  Comment,
  ArticleSimplified,
  Warning,
  ChapterSimplified
} from "@/types/api/article";
import Axios from "axios";
import moment from "moment";
import router from "../../router";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { API_PREFIX, get, post } from "@/types/api/config";
import { UserStructSimplified } from "@/types/api/user";
import array from "lodash/array";
import getDetail = Article.getDetail;
import getChapter = Chapter.getChapter;
import putComment = Comment.putComment;
import deleteComment = Comment.deleteComment;

//类的定义，需要加上组件装饰器，类名就是组件名
@Component
export default class ArticleContent extends Vue {
  //data直接写在类里，[字段名]:[类型]=[初始值]，类型可以自动推断时省略
  article: ArticleStruct = null;
  author: UserStructSimplified = null;
  comments: Comment[] = [];
  selectedChapter: Chapter = null;
  chapterModify:Boolean = false;
  chapters: ChapterSimplified[] = [];
  commentInput = "";
  chapterListPage = 1;
  commentListPage = 1;
  judgement = {
    articleLike: false,
    articleFav: false
  };
  moment = moment;

  //生命周期钩子照常写
  async mounted() {
    this.refresh();
    this.addView();
  }

  //computed改为getter，直接写在类里面
  get isMobile() {
    return this.$store.state.isMobile
  }

  get ratingString() {
    return Rating[this.article.rating];
  }

  get warnings() {
    return this.article.warning.split(",").map(_ => Warning[_]);
  }

  get ratingColor() {
    switch (Rating[this.article.rating]) {
      case Rating.G:
        return "#9dd1a9";
      case Rating.PG13:
        return "#a2d6cd";
      case Rating.R:
        return "#f7bb8e";
      case Rating.NC17:
        return "#ea534f";
    }
  }

  get portable() {
    return window.screen.width < 1024;
  }

  get tags() {
    const tag = String(this.article.tag).split(",");
    return array.compact(tag);
  }

  get fandoms() {
    const fandom = String(this.article.fandom).split(",");
    return array.compact(fandom);
  }

  get relationships() {
    const relationship = String(this.article.relationship).split(",");
    return array.compact(relationship);
  }
  get preCid() {
    const chapterArray = this.article.chapters.split(",");
    const nowIndex = chapterArray.indexOf(this.$route.params.cid);
    if (nowIndex == 0) {
      return null;
    } else {
      return chapterArray[nowIndex - 1];
    }
  }
  get nextCid() {
    const chapterArray = this.article.chapters.split(",");
    const nowIndex = chapterArray.indexOf(this.$route.params.cid);
    if (nowIndex == chapterArray.length - 1) {
      return null;
    } else {
      return chapterArray[nowIndex + 1];
    }
  }
  preChar() {
    window.scrollTo(0, 0);
    this.$router.push({
      name: "ArticleContent",
      params: { aid: this.$route.params.aid, cid: this.preCid }
    });
  }
  nextChar() {
    window.scrollTo(0, 0);
    this.$router.push({
      name: "ArticleContent",
      params: { aid: this.$route.params.aid, cid: this.nextCid }
    });
  }
  jumpIndex() {
    window.scrollTo(0, 0);
    this.$router.push({
      name: "ArticleContent",
      params: { aid: this.$route.params.aid }
    });
  }
  getDateDescribeString(c: ChapterSimplified) {
    let n1 = new Date(c.published).getTime(),
      n2 = new Date(c.last_edit).getTime();
    if (n2 > n1) return `编辑于${new Date(c.last_edit).toLocaleTimeString()}`;
    return `${new Date(c.published).toLocaleTimeString()}`;
  }

  @Watch("commentListPage")
  async loadComment() {
    let limit = 10,
      offset = (this.commentListPage - 1) * 10;
    let { aid, cid } = this.$route.params;
    if (cid === undefined) return;
    Object.assign(this, await Comment.getComments(aid, cid, limit, offset));
    if (!this.comments.length && this.commentListPage > 1) {
      this.commentListPage--;
      this.loadComment();
    }
  }

  async refresh() {
    let { aid, cid } = this.$route.params;
    (this as any).$Spin.show();
    Object.assign(
      this,
      await getDetail(aid).catch(err => {
        if (err.response.status == 403) {
          return (this as any).$Modal.error({
            title: "回去吧",
            content: "您当前的年龄不允许阅读此文章",
            onOk: () => {
              this.$router.back();
            }
          });
        }
      })
    );
    (this as any).$Spin.hide();
    if (!this.article.id) {
      return (this as any).$Modal.error({
        title: "回去吧",
        content: "您所访问的文章不存在或已删除",
        onOk: () => {
          this.$router.back();
        }
      });
    }
    this.comments = [];
    if (cid) this.selectedChapter = await getChapter(aid, cid);
    else this.selectedChapter = null;
    let j = await Promise.all([
      post("/like/article/judgement", { id: aid }),
      post("/follow/article/judgement", { aid: Number(aid) }),
      this.loadComment()
    ]);
    this.judgement.articleLike = j[0];
    this.judgement.articleFav = j[1];
  }

  jumpEdit() {
    this.$router.push({
      name: "EditArticle",
      params: {
        aid: String(this.article.id),
        cid: this.selectedChapter ? String(this.selectedChapter.id) : null
      }
    });
  }

  jumpUserCenter(id) {
    const isMobile = this.$store.state.isMobile;
    if (isMobile) {
      this.$router.push(`/selfmobile/${id}/info`);
    } else {
      this.$router.push(`/self/${id}/info`);
    }
  }

  modifyChapter(){
    this.chapterModify = !this.chapterModify
  }
  showDeleteModal(cid,title,index){
    if (this.chapters.length==1) {
      return (this as any).$Modal.warning({
        title: "不可删除唯一章节",
        content: "此章节为文章的唯一章节，若要删除请跳转个人中心删除文章"
      })
    }
    (this as any).$Modal.confirm({
      title: "确认要删除章节吗",
      content:`确认要删除章节${title}吗，章节删除后不可恢复！`,
      onOk:()=>{
        (this as any).$axios.delete(`/api/article/${this.article.id}/${cid}`).then(res=>{
          if (!res.data.result) {
            return (this as any).$Message.error("删除失败")
          }
          this.chapters.splice(index, 1)
          return (this as any).$Message.success("删除成功")
        })
      },
      onCancel:()=>{
        (this as any).$Modal.remove()
      }
    })
  }
  jumpNewChapter() {
    this.$router.push({
      name: "EditArticle",
      params: {
        aid: String(this.article.id)
      },
      query: {
        action: "new"
      }
    });
  }
  async like() {
    let { id } = this.article;
    post("/like/article", { id })
      .then(() => post("/like/article/judgement", { id }))
      .then(value => (this.judgement.articleLike = value));
  }

  async fav() {
    let aid = this.article.id;
    post("/follow/article", { aid })
      .then(() => post("/follow/article/judgement", { aid }))
      .then(value => (this.judgement.articleFav = value));
  }

  submitComment() {
    let { aid, cid } = this.$route.params;
    putComment(aid, cid, this.commentInput)
      .then(() => this.refresh())
      .then(() => (this.commentInput = ""))
      .then(
        () =>
          (this.commentListPage = Math.ceil(
            this.selectedChapter.comment_count / 10
          ))
      );
  }

  delComment(mid) {
    let { aid, cid } = this.$route.params;
    deleteComment(aid, cid, mid).then(value => this.loadComment());
  }
  addView() {
    let { aid } = this.$route.params;
    post(`/article/addread/${aid}`, {});
  }
  @Watch("$route")
  async $routeChange(to: Route, from: Route) {
    this.refresh();
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
  /*align-items: center;*/
  /*justify-content: center;*/
  flex-direction: column;
  width: 100%;
  /*text-align: center;*/
  margin-top: 2em;
  padding: 3em 3em 0 3em;
  min-height: 200px;
  /* align-items: center; */
}

.article-title {
  text-align: center;
}

.article-header-portable {
  padding: 3em 0 0 0;
}

.article-body {
  display: flex;
  width: 100%;
  padding: 0 2rem;
}

.article-body-portable {
  padding: 0;
}

.article-footer {
  color: #808695;
  padding-bottom: 3em;
  text-align: center;
  font-size: 0.8em;
}

.article-stats {
  margin-top: 2em;
}

.article-buttons {
  /* align-items: center; */
  margin: 3em auto 2em auto !important;
  width: 300px !important;
}

.card-title {
  font-weight: bold;
  color: #515a6e;
}

.card-sub {
  font-size: 0.8em;
  color: #808695;
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

.divider-footer {
  margin: 24px 0 0 0 !important;
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

.vertical-hr {
  width: 1px;
  border-left: #777 solid 1px;
  margin: 0 0.5em;
}
</style>
