<template>
  <!--eslint-disable-->
  <div class="article-edit">
    <Row style="margin-top:1rem">
      <div style="max-width: 720px;margin: 0 auto">
        <Breadcrumb separator=" > " style="margin-bottom: 1rem">
          <Breadcrumb-item to="/">
            <Icon type="ios-home-outline"/>
            放逐地
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="social-buffer-outline"/>
            文区
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="social-buffer-outline"/>
            新建/编辑文章
          </Breadcrumb-item>
        </Breadcrumb>
        <div class="wrap-card">
          <Form v-model="form" :label-width="80">
            <form-item label="分级：">
              <Select v-model="form.rating" style="max-width:10rem;">
                <Option v-for="rate in ratings" :value="rate[1]" :key="rate[1]">
                  {{rate[0]}}
                </Option>
              </Select>
            </form-item>
            <form-item label="警告：">
              <Select v-model="form.warning" style="width: content-box;" multiple>
                <Option v-for="rate in warnings" :value="rate[0]" :key="rate[0]">
                  {{rate[1]}}
                </Option>
              </Select>
            </form-item>
            <form-item label="原作：">
              <Input v-model="form.fandom" placeholder="原创作品留空"/>
            </form-item>
            <form-item label="性向：">
              <Select v-model="form.category" style="max-width:10rem;">
                <Option v-for="rate in categories" :value="rate[1]" :key="rate[1]">
                  {{rate[0]}}
                </Option>
              </Select>
            </form-item>
            <form-item label="CP：">
              <TagInput v-model="form.relationship" placeholder="输入空格确认"/>
            </form-item>
            <form-item label="人物：">
              <TagInput v-model="form.character" placeholder="输入空格确认"/>
            </form-item>
            <form-item label="标签：">
              <TagInput v-model="form.tag" placeholder="输入空格确认"/>
            </form-item>
            <div class="hr">
              <div>文章信息</div>
              <hr/>
            </div>
            <form-item label="标题：">
              <Input v-model="form.title" placeholder=""/>
            </form-item>
            <form-item label="摘要：">
              <Input v-model="form.summary" placeholder="可留空"/>
            </form-item>
            <form-item label="注释：">
              <Input v-model="form.note" placeholder="可留空"/>
            </form-item>
            <form-item label="章节数：">
              <InputNumber v-model="chaptersCount" style="max-width: 4rem" :min="0"/>
            </form-item>
            <div style="display:flex;justify-content: right;">
              <Button type="warning" style="margin:0 .5rem" size="large">
                放弃修改
              </Button>
              <Button type="primary" style="margin:0 .5rem" size="large">
                提交文章基础信息
              </Button>
            </div>
          </Form>
          <div v-for="(chapter,idx) in chapters" v-if="idx<chaptersCount" :key="`chapterEdit`+idx">
            <div class="hr" :id="'chapter'+idx">
              <div>章节{{idx+1}}</div>
              <hr/>
            </div>
            <Form v-model="chapters[idx]" :label-width="80">
              <form-item label="标题：">
                <Input v-model="chapters[idx].title" placeholder=""/>
              </form-item>
              <form-item label="摘要：">
                <Input v-model="chapters[idx].summary" placeholder="可留空"/>
              </form-item>
              <form-item label="注释：">
                <Input v-model="chapters[idx].note" placeholder="可留空"/>
              </form-item>
              <quill-editor v-model="chapters[idx].content"
                            style="margin-bottom: 1rem"/>
              <div style="display:flex;justify-content: right;">
                <Button type="warning" style="margin:0 .5rem" size="large">
                  放弃修改
                </Button>
                <Button type="primary" style="margin:0 .5rem" size="large">
                  提交章节{{idx+1}}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Row>
  </div>
</template>

<script lang="ts">
  /* eslint-disable */
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {Article, Category, Chapter, Rating, Warning} from "@/types/api/article";
  import TagInput from "@/components/form/TagInput.vue";
  //@ts-ignore
  import {quillEditor} from 'vue-quill-editor' // 调用富文本编辑器
  import 'quill/dist/quill.snow.css' // 富文本编辑器外部引用样式  三种样式三选一引入即可
  // import 'quill/dist/quill.core.css'
  // import 'quill/dist/quill.bubble.css'
  import * as Quill from 'quill'; // 富文本基于quill

  @Component({
    components: {TagInput, 'quill-editor': quillEditor}
  })
  export default class ArticleEdit extends Vue {
    form: Article.PutArticle.Request = {
      category: Category.Unknown,
      character: [],
      fandom: "",
      note: "",
      rating: Rating.G,
      relationship: [],
      summary: "",
      tag: [],
      title: "",
      warning: []
    }
    chaptersCount = 0

    defaultChapter(): Chapter.PutChapter.Request {
      return {
        cid: 0,
        title: "",
        note: "",
        summary: "",
        content: "",
      }
    }

    chapters: Chapter.PutChapter.Request[] = []

    mounted() {
      this.chaptersCount = 1
      const aid = Number.parseInt(this.$route.params.aid),
        cid = Number.parseInt(this.$route.params.cid)
      if (Number.isNaN(aid)) {

      } else {

      }
    }

    get ratings() {
      return Object.entries(Rating)
        .filter(value => typeof value[1] == "number")
    }

    get warnings() {
      return Object.entries(Warning)
    }

    get categories() {
      return Object.entries(Category)
        .filter(value => typeof value[1] == "number")
    }

    get narrowScreen() {
      return document.body.clientWidth < 1024
    }

    @Watch('chaptersCount')
    chaptersCountChanged(newVal) {
      if (newVal > this.chapters.length) {
        for (let i = this.chapters.length; i < newVal; i++) {
          const c = this.defaultChapter()
          c.cid = i
          this.chapters.push(c)
        }
      }
    }
  }
</script>

<style lang="less">
  .wrap-card {
    width: 100%;
    line-height: 2rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.3) inset,
    0 10px 15px 12px rgba(208, 208, 208, 0.5);
    border-radius: 18px;
    margin-top: 0.5rem;
    transition: all 0.2s linear;
    padding: 2rem 3%;
  }

  div.hr {
    display: flex;
    align-items: center;
    margin: 1rem 0;

    & > div {
      padding: 0 1em;
      font-size: small;
      border: #a2d6cd solid 2px;
      border-radius: .3rem
    }

    & > hr {
      flex-grow: 1;
      color: #a2d6cd77;
      margin-left: 1em
    }
  }
</style>