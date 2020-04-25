<template>
  <!--eslint-disable-->
  <div class="article-edit">
    <Row style="margin-top:1rem">
      <div style="max-width: 720px;margin: 0 auto">
        <Breadcrumb separator=" > " style="margin-bottom: 1rem">
          <Breadcrumb-item to="/">
            <Icon type="ios-home-outline"/>
            后花园
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
          <Form :model="form" :label-width="80" inline :rules="rules.form" ref="formArticle">
            <form-item label="分级：" prop="rating" style="flex-basis: 10em">
              <Select v-model="form.rating">
                <Option v-for="rate in ratings" :value="rate[1]" :key="rate[1]">
                  {{rate[0]}}
                </Option>
              </Select>
            </form-item>
            <form-item label="性向：" prop="category" style="flex-basis: 10em">
              <Select v-model="form.category">
                <Option v-for="rate in categories" :value="rate[1]" :key="rate[1]">
                  {{rate[0]}}
                </Option>
              </Select>
            </form-item>
            <form-item label="警告：" prop="warning" style="flex-basis: 100%">
              <Select v-model="form.warning" style="width: content-box;" multiple>
                <Option v-for="rate in warnings" :value="rate[1]" :key="rate[1]">
                  {{rate[1]}}
                </Option>
              </Select>
            </form-item>
            <form-item label="人物：" prop="character" style="flex-basis: 15em">
              <TagInput v-model="form.character" placeholder="输入空格确认"/>
            </form-item>
            <form-item label="CP：" prop="relationship" style="flex-basis: 15em">
              <TagInput v-model="form.relationship" placeholder="输入空格确认"/>
            </form-item>
            <form-item label="标签：" prop="tag" style="flex-basis: 15em">
              <TagInput v-model="form.tag" placeholder="输入空格确认"/>
            </form-item>
            <form-item label="原作：" prop="fandom" style="flex-basis: 15em">
              <Input v-model="form.fandom" placeholder="原创作品留空"/>
            </form-item>
            <div class="hr">
              <div>文章信息</div>
              <hr/>
            </div>
            <form-item label="标题：" prop="title" style="flex-basis: 100%">
              <Input v-model="form.title" placeholder=""/>
            </form-item>
            <form-item label="摘要：" prop="summary" style="flex-basis: 15em">
              <Input v-model="form.summary" placeholder="可留空"/>
            </form-item>
            <form-item label="注释：" prop="note" style="flex-basis: 15em">
              <Input v-model="form.note" placeholder="可留空"/>
            </form-item>
            <form-item label="多章节：">
              <i-switch v-model="multiChapters" true-color="#a2d6cd"/>
            </form-item>
            <quill-editor v-model="chapter.content" v-if="!multiChapters && chapter"
                          style="margin-bottom: 1rem"/>
            <div class="action-grounp">
              <Button type="warning" style="margin:0 .5rem" size="large"
                      @click="clearContent(()=>(fetchArticle(form.aid),multiChapters|| fetchChapter(form.aid,chapter.cid)))"
              >
                放弃修改
              </Button>
              <Button type="info" @click="submitArticle"
                      style="margin:0 .5rem" size="large">
                提交文章{{multiChapters?'基础信息':''}}
              </Button>
            </div>
          </Form>
          <div v-if="multiChapters">
            <div class="hr">
              <div>章节 {{chapter.cid+1}}</div>
              <hr/>
            </div>
            <Form :model="chapter" :rules="rules.chapter" ref="formChapter" :label-width="80">
              <form-item label="标题：" prop="title" style="flex-basis: 100%">
                <Input v-model="chapter.title" placeholder=""/>
              </form-item>
              <form-item label="摘要：" style="flex-basis: 15em">
                <Input v-model="chapter.summary" placeholder="可留空"/>
              </form-item>
              <form-item label="注释：" style="flex-basis: 15em">
                <Input v-model="chapter.note" placeholder="可留空"/>
              </form-item>
              <quill-editor v-model="chapter.content"
                            style="margin-bottom: 1rem"/>
              <div class="action-grounp">
                <Button type="warning" style="margin:0 .5rem" size="large"
                        @click="clearContent(()=>(fetchChapter(form.aid,chapter.cid)))">
                  放弃修改
                </Button>
                <Button type="info" style="margin:0 .5rem" size="large" @click="submitChapter">
                  提交章节
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Row>
    <Modal
      v-model="modals.confirmClear"
      title="确认放弃修改"
      @on-cancel="clearContentCB=undefined"
      @on-ok="clearContent">
      <p>你确定放弃修改吗？</p>
    </Modal>

  </div>
</template>

<script>
export default{
  data() {
    return{
      ratings:{},
      form:{},
    }
  }
}
  // /* eslint-disable */
  // import {Component, Ref, Vue} from "vue-property-decorator";
  // import {Article, Category, Chapter, Rating, Warning} from "@/types/api/article";
  // import TagInput from "@/components/form/TagInput.vue";
  // //@ts-ignore
  // import {quillEditor} from 'vue-quill-editor' // 调用富文本编辑器
  // import 'quill/dist/quill.snow.css'
  // import {Form} from "view-design"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
  // @Component({
  //   components: {TagInput, 'quill-editor': quillEditor}
  // })
  // export default class ArticleEdit extends Vue {
  //   defaultForm(): Article.PutArticle.Request {
  //     return {
  //       aid: undefined,
  //       category: undefined,
  //       character: [],
  //       fandom: "",
  //       note: "",
  //       rating: undefined,
  //       relationship: [],
  //       summary: "",
  //       tag: [],
  //       title: "",
  //       warning: []
  //     }
  //   }

  //   form = this.defaultForm()
  //   multiChapters = false
  //   modals = {
  //     confirmClear: false
  //   }

  //   defaultChapter(): Chapter.PutChapter.Request {
  //     return {
  //       cid: 0,
  //       title: "",
  //       note: "",
  //       summary: "",
  //       content: "",
  //     }
  //   }

  //   clearContentCB: () => void

  //   clearContent(cb?: () => void) {
  //     if (!this.clearContentCB)
  //       this.modals.confirmClear = true,
  //         this.clearContentCB = cb
  //     else
  //       this.clearContentCB(),
  //         this.clearContentCB = undefined
  //   }

  //   chapter: Chapter.PutChapter.Request = this.defaultChapter()

  //   async fetchArticle(aid: number) {
  //     if (Number.isNaN(aid) || aid == undefined)
  //       return this.form = this.defaultForm()
  //     let res = await Article.getDetail(aid)
  //     if (res.status) {
  //       const {warning, tag, title, fandom, summary, rating, note, character, category, relationship, chapters} = res.article
  //       Object.assign<Article.PutArticle.Request,
  //         Partial<Article.PutArticle.Request>>(this.form, {
  //         warning, note, summary, title, tag, category, fandom, rating, aid, character, relationship
  //       })
  //       if (chapters.length > 1)
  //         this.multiChapters = true
  //     }
  //   }

  //   async fetchChapter(aid: number, cid: number) {
  //     if (Number.isNaN(aid) || aid == undefined)
  //       return this.chapter = this.defaultChapter()
  //     this.chapter = null
  //     let res = await Chapter.getChapters(aid, 1, cid)
  //     if (res.status) {
  //       const [{content, summary, note, title}] = res.chapters
  //       this.chapter = Object.assign<{},
  //         Chapter.PutChapter.Request>({}, {
  //           content, cid, note, summary, title
  //         }
  //       )
  //     }
  //   }

  //   async mounted() {
  //     const aid = Number.parseInt(this.$route.params.aid),
  //       cid = Number.parseInt(this.$route.params.cid)
  //     if (Number.isNaN(aid)) {
  //       this.chapter = this.defaultChapter()
  //       this.chapter.cid = 0
  //     } else {
  //       this.fetchArticle(aid)
  //       if (!Number.isNaN(cid)) {
  //         this.fetchChapter(aid, cid)
  //       }
  //     }
  //   }

  //   get ratings() {
  //     return Object.entries(Rating)
  //       .filter(value => typeof value[1] == "number")
  //   }

  //   get warnings() {
  //     return Object.entries(Warning)
  //   }

  //   get categories() {
  //     return Object.entries(Category)
  //       .filter(value => typeof value[1] == "number")
  //   }

  //   get narrowScreen() {
  //     return document.body.clientWidth < 1024
  //   }

  //   @Ref('formArticle')
  //   formArticle: Form

  //   submitArticle() {
  //     this.formArticle.validate(async valid => {
  //       if (valid) {
  //         let artRes = await Article.putArticle(this.form)
  //         if (artRes.status) {
  //           for (let field of Object.keys(this.form))
  //             this.form[field] = artRes.article[field]
  //           if (!this.multiChapters) {
  //             let {title, summary, note} = this.form
  //             await Chapter.putChapter(this.form.aid, {
  //               cid: 0, title, summary, note, content: this.chapter.note
  //             })
  //           }
  //           await this.$router.replace(`/article/${this.form.aid}/${this.chapter.cid}/edit`)
  //         }
  //       }
  //     })
  //   }

  //   @Ref('formChapter')
  //   formChapter: Form

  //   async submitChapter() {
  //     this.formChapter.validate(async valid => {
  //       if (valid) {
  //         let chapRes = await Chapter.putChapter(this.form.aid, this.chapter)
  //         if (chapRes.status) {
  //           for (let field of Object.keys(this.chapter))
  //             this.chapter[field] = chapRes.chapter[field]
  //         }
  //       }
  //     })
  //   }

  //   rules: {
  //     [TTarget in (keyof ArticleEdit) & ('form' | 'chapter')]?: {
  //       [TK in keyof ArticleEdit[TTarget]]?: {
  //         required?: boolean, message?: string, trigger?: 'blur' | 'change',
  //         type?: 'array' | 'string' | 'number',
  //         validator?: (rule, value: ArticleEdit[TTarget][TK], callback: (e?: Error) => void) => void,
  //         range?: { min: number, max: number }
  //       }[]
  //     }
  //   } = {
  //     form: {
  //       rating: [{required: true, message: '必填项', trigger: "change", type: "number"}],
  //       category: [{required: true, message: '必填项', trigger: "change", type: "number"}],
  //       warning: [{
  //         trigger: "change", required: true, validator(rule, value, cb) {
  //           console.log(arguments)
  //           if (!value || value.length < 1) return cb(new Error('必填项'))
  //           if (value.length > 1) {
  //             if (value.includes(Warning.No) || value.includes(Warning.Unknown))
  //               return cb(new Error('不得冲突'))
  //           }
  //           cb()
  //         }
  //       }],
  //       title: [{required: true, message: '必填项', trigger: "change"}],
  //     },
  //     chapter: {
  //       title: [{required: true, message: '必填项', trigger: "change"}],
  //     }
  //   }

  // }

</script>

<style lang="less" scoped>
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
    width: 100%;
    box-sizing: border-box;

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

  .ivu-form {
    display: flex;
    flex-wrap: wrap;

    & .ivu-form-item {
      flex-grow: 1;
    }

  }

  .quill-editor {
    height: fit-content;
  }

  div.action-grounp {
    flex-basis: 100%;
    display: flex;
    justify-content: right;
  }
</style>