<template>
  <div class="article-edit">
    <Row style="margin-top:1rem">
      <div style="max-width: 720px;margin: 0 auto">
        <Breadcrumb separator=" > " style="margin-bottom: 1rem">
          <Breadcrumb-item to="/">
            <Icon type="ios-home-outline" />后花园
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="social-buffer-outline" />文区
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="social-buffer-outline" />新建/编辑文章
          </Breadcrumb-item>
        </Breadcrumb>
        <Row type="flex" justify="center" class="wrap-card" v-if="!edit">
          <iCol span="22">
            <Steps :current="step">
              <Step  content="确定文章的基本信息">
                <template slot="title"><a @click="jumpStep(0)">基本信息</a></template>
              </Step>
              <Step content="新的开始√">
                <template slot="title"><a @click="jumpStep(1)">编辑章节</a></template>
              </Step>
              <Step content="一切就绪？准备发布！">
                <template slot="title"><a @click="jumpStep(2)">确认和提交</a></template>
              </Step>
            </Steps>
          </iCol>
        </Row>
        <Row class="wrap-card" style="margin:18px 0 18px 0;" v-if="!edit">
          <Row type="flex" justify="center">
            <iCol span="4">
              <div class="title-topic-icon">
                <img src="../../assets/icons/emoticon.svg" />
              </div>
            </iCol>
            <iCol span="20">
              <span class="ins-title">{{instructions[step].title}}</span>
              <p>{{instructions[step].content}}<a @click="modalRate=true">点此查看分级标准</a></p>
            </iCol>
          </Row>
        </Row>
        <div class="wrap-card" style="z-index:999">
          <Form
            :model="form"
            :rules="articleRules"
            :label-width="80"
            ref="formArticle"
            v-if="step==0&&cid==0"
          >
            <form-item label="标题：" prop="title">
              <Input v-model="form.title" maxlength="40"  show-word-limit  placeholder="不可留空，请填写" />
            </form-item>
            <form-item label="分级：" prop="rating">
              <Select v-model="form.rating">
                <Option v-for="rate in ratings" :value="rate" :key="rate">{{rate}}</Option>
              </Select>
            </form-item>
            <form-item label="性向：" prop="category">
              <Select v-model="form.category">
                <Option v-for="rate in categories" :value="rate" :key="rate">{{rate}}</Option>
              </Select>
            </form-item>
            <form-item label="警告：" prop="warning">
              <Select v-model="form.warning" style="width: content-box;" multiple>
                <Option
                  v-for="rate in warnings"
                  :value="rate['value']"
                  :key="rate['value']"
                >{{rate['text']}}</Option>
              </Select>
            </form-item>
            <form-item label="人物：" prop="character">
              <Select
                v-model="form.character"
                multiple
                allow-create
                filterable
                @on-create="handleCreateChar"
              >
                <Option
                  v-for="(item) in options.characterOptions"
                  :value="item.character_name"
                  :key="item.id"
                >{{item.character_name}}</Option>
              </Select>
            </form-item>
            <form-item label="CP：" prop="relationship">
              <Select
                v-model="form.relationship"
                multiple
                allow-create
                filterable
                remote
                :remote-method="cpPreSearch"
                :loading="loading.cp"
              >
                <Option
                  v-for="(item) in options.cpOptions"
                  :value="item.cp_name"
                  :key="item.id"
                >{{item.cp_name}}</Option>
              </Select>
            </form-item>
            <form-item label="标签：" prop="tag">
              <Select
                v-model="form.tag"
                multiple
                allow-create
                filterable
                remote
                :remote-method="tagPreSearch"
                :loading="loading.tag"
              >
                <Option
                  v-for="(item) in options.tagOptions"
                  :value="item.tag_name"
                  :key="item.id"
                >{{item.tag_name}}</Option>
              </Select>
            </form-item>
            <form-item label="原作：" prop="fandom">
              <Select
                v-model="form.fandom"
                multiple
                allow-create
                filterable
                remote
                :remote-method="fandomPreSearch"
                :loading="loading.fandom"
              >
                <Option
                  v-for="(item) in options.fandomOptions"
                  :value="item.fandom_name"
                  :key="item.id"
                >{{item.fandom_name}}</Option>
              </Select>
            </form-item>
            <form-item label="摘要：" prop="summary">
              <i-input v-model="form.summary" maxlength="200"  show-word-limit  placeholder="文章摘要" />
            </form-item>
            <form-item label="注释：" prop="note">
              <i-input v-model="form.note" maxlength="200"  show-word-limit  placeholder="文章注释" />
            </form-item>
            <form-item label="多章节：">
              <i-switch v-model="multiChapter" true-color="#a2d6cd" />
            </form-item>
            <div class="action-grounp">
              <Button
                type="warning"
                style="margin:0 .5rem"
                size="large"
                @click="modalClear=true"
              >放弃修改</Button>
              <Button
                type="info"
                @click="articleInfoCheck"
                style="margin:0 .5rem"
                size="large"
                v-if="!edit"
              >下一步</Button>
              <Button
                type="info"
                @click="editArticle"
                style="margin:0 .5rem"
                size="large"
                :loading="loading.confirm"
                v-if="edit"
              >提交修改</Button>
            </div>
          </Form>
          <Row v-if="step==1||cid!=0">
            <Row>
              <iCol>
                <div class="hr">
                  <div>章节信息</div>
                  <hr />
                </div>
                <Form ref="formChapter" :model="chapter" :rules="chapterRules">
                  <form-item label="标题：" prop="title">
                    <i-input :disabled="!multiChapter" maxlength="40"  show-word-limit  v-model="chapter.title" placeholder="章节标题" />
                  </form-item>
                  <form-item label="摘要：" prop="summary" style="flex-basis: 15em">
                    <i-input v-model="chapter.summary" maxlength="200"  show-word-limit  placeholder="可留空" />
                  </form-item>
                  <form-item label="注释：" prop="note" style="flex-basis: 15em">
                    <i-input v-model="chapter.note" maxlength="200"  show-word-limit  placeholder="可留空" />
                  </form-item>
                </Form>
                <quill-editor
                  v-model="chapter.content"
                  style="margin-bottom: 1rem"
                  :options="editorOption"
                />
              </iCol>
            </Row>
            <Row>
              <iCol>
                <div class="action-grounp">
                  <Button
                    type="warning"
                    style="margin:0 .5rem"
                    size="large"
                    @click="modalClear=true"
                  >放弃修改</Button>
                  <Button
                    type="info"
                    @click="chapterInfoCheck"
                    style="margin:0 .5rem"
                    size="large"
                    v-if="!edit"
                  >下一步</Button>
                  <Button
                    type="info"
                    @click="editChapter"
                    :loading="loading.confirm"
                    style="margin:0 .5rem"
                    size="large"
                    v-if="edit&&action!='new'"
                  >提交修改</Button>
                  <Button
                    type="info"
                    size="large"
                    v-if="edit&&action=='new'"
                    style="margin:0 .5rem"
                    :loading="loading.confirm"
                    @click="addChapter(aid)"
                  >提交章节</Button>
                </div>
              </iCol>
            </Row>
          </Row>
          <Row v-if="step==2">
            <Spin v-if="loading.confirm" size="large" fix>
              <Steps :current="postStep" direction="vertical" :status="postStatus">
                <Step title="提交文章..."></Step>
                <Step title="提交章节..." v-if="postStep>=1"></Step>
                <Step title="提交完成" v-if="postStep>=2"></Step>
              </Steps>
            </Spin>
            <Row>
              <iCol>
                <p>文章标题：{{form.title}}</p>
                <p>分级：{{form.rating}}</p>
                <p>性向：{{form.category}}</p>
                <p>警告：{{warningTextArray.toString()}}</p>
                <p>CP：{{form.relationship.toString()}}</p>
                <P>原作：{{form.fandom.toString()}}</P>
                <Checkbox v-model="confirmBox">我了解平台关于分级和警告的相关规则，并确认选择了合适的分级以及对相关情节进行警告。</Checkbox>
              </iCol>
            </Row>
            <Row>
              <iCol>
                <div class="action-grounp">
                  <Button
                    type="warning"
                    style="margin:0 .5rem"
                    size="large"
                    @click="modalClear=true"
                  >放弃修改</Button>
                  <Button
                    :loading="loading.confirm"
                    :disabled="!confirmBox"
                    type="info"
                    @click="newPost"
                    style="margin:0 .5rem"
                    size="large"
                  >提交</Button>
                </div>
              </iCol>
            </Row>
          </Row>
        </div>
      </div>
    </Row>
    <Modal v-model="modalClear" title="确认放弃修改" @on-ok="clear">
      <p>你确定放弃修改吗？</p>
      <p>您的新文章不会被创建，已经做出的任何未提交的更改也不会被保存</p>
      <p>(注意这包括您已经编辑但未发布的文章内容)</p>
    </Modal>
    <Modal
        v-model="modalRate"
        title="分级规则">
        <span v-for="(value,name) in rateDescription" :key="name">
          <b>{{name}}:</b><span>{{value}}</span><br>
        </span>
    </Modal>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import cookie from "js-cookie";
import array from "lodash/array";
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      edit: false,
      aid: 0,
      cid: 0,
      step: 0,
      postStep: 0,
      postStatus: "process",
      action: "",
      multiChapter: true,
      confirmBox: false,
      modalRate:false,
      modalClear: false,
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote"],
            [{ header: 1 }, { header: 2 }]
          ]
        },
        placeholder: "请输入正文..."
      },
      loading: {
        cp: false,
        tag: false,
        fandom: false,
        confirm: false
      },
      options: {
        cpOptions: [],
        tagOptions: [],
        fandomOptions: [],
        characterOptions: []
      },
      form: {
        title: "",
        rating: "",
        note: "",
        summary: "",
        category: "",
        warning: [],
        character: [],
        relationship: [],
        tag: [],
        fandom: []
      },
      rateDescription:[],
      articleRules: {
        rating: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        category: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        warning: [
          {
            trigger: "change",
            required: true,
            validator(rule, value, cb) {
              if (!value || value.length < 1) return cb(new Error("必填项"));
              if (value.length > 1) {
                if (value.includes("No") || value.includes("Unknown"))
                  return cb(new Error("不得冲突"));
              }
              cb();
            }
          }
        ],
        title: [{ required: true, message: "必填项", trigger: "change" }]
      },
      chapterRules: {
        title: [{ required: true, message: "必填项", trigger: "change" }]
      },
      chapter: {
        title: "",
        summary: "",
        note: "",
        content: ""
      },
      ratings: ["G", "PG13", "R", "NC17"],
      categories: ["Unknown", "BG", "BL", "GL", "Mixed", "Others"],
      warnings: [
        { text: "不进行警告", value: "No" },
        { text: "详细的暴力描写", value: "Violence" },
        { text: "主要角色死亡", value: "MainDeath" },
        { text: "强奸/非自愿性行为", value: "Rape" },
        { text: "未成年人性行为", value: "Teen" },
        { text: "无警告内容", value: "Unknown" }
      ],
      instructions: [
        {
          title: "创建新文章",
          content:
            "您正创建一篇全新的文章，在后花园中文章是一个或多个章节的合集，所以稍后您将开始创建文章的正文部分。在此之前，您应该先设置文章的基本属性和信息。请注意，文章的基础信息很重要，它将直接影响到您的文章可以被哪些人阅读，请认真填写。"
        },
        {
          title:"编辑第一章",
          content: "现在您可以编辑您文章的第一章了！如果您在之前取消选择了“多章节”，那么在这一步您章节的标题将会被自动填写完成且不可修改。不过不用担心，这并不影响你以后继续向此文章添加章节，这一设定仅是为了方便编辑和展示。",
        },
        {
          title:"确认和提交",
          content:"现在在提交之前，您还有一次机会确认您的各项设置是否正确，请务必认真核对！"
        }
      ]
    };
  },
  watch: {
    multiChapter(multiple) {
      if (!multiple) {
        this.chapter.title = this.form.title;
      }
    }
  },
  computed: {
    csrfToken() {
      return cookie.get("csrfToken");
    },
    warningTextArray() {
      const result = [];
      const warningMap = new Map();
      for (const element of this.warnings) {
        warningMap.set(element.value, element.text);
      }
      for (const element of this.form.warning) {
        result.push(warningMap.get(element));
      }
      return result;
    },
    articleRequestBody() {
      const tmp = this.form;
      return {
        article_title: tmp.title,
        article_summary: tmp.summary,
        article_note: tmp.note,
        article_rating: tmp.rating,
        article_warning: tmp.warning,
        article_fandom: array.compact(tmp.fandom),
        article_relationship: array.compact(tmp.relationship),
        article_category: tmp.category,
        article_character: array.compact(tmp.character),
        article_tag: array.compact(tmp.tag)
      };
    },
    chapterRequestBody() {
      const tmp = this.chapter;
      return {
        chapter_title: tmp.title,
        chapter_content: tmp.content,
        chapter_summary: tmp.summary,
        chapter_note: tmp.note
      };
    }
  },
  methods: {
    jumpStep(step){
      if (this.step<=step) {
        return;
      }
      return this.step = step
    },
    showRateRules(){

    },
    articleInfoCheck() {
      this.$refs["formArticle"].validate(valid => {
        if (valid) {
          this.step++;
        }
      });
    },
    chapterInfoCheck() {
      this.$refs["formChapter"].validate(valid => {
        if (valid) {
          if (!this.chapter.content) {
            return this.$Message.error("至少写点什么吧~");
          }
          this.step++;
        }
      });
    },
    cpPreSearch(text) {
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
            this.options.cpOptions = {...this.options.cpOptions,...res.data};
            this.loading.cp = false;
          });
      }
    },
    handleCreateChar(val) {
      this.options.characterOptions.push({ id: val, character_name: val });
    },
    tagPreSearch(text) {
      if (text != "") {
        this.loading.tag = true;
        this.$axios
          .post(
            "/api/article/presearch",
            { type: "tag", query: text },
            {
              headers: { "x-csrf-token": this.csrfToken },
              withCredentials: true
            }
          )
          .then(res => {
            this.options.tagOptions = {...this.options.tagOptions,...res.data};
            this.loading.tag = false;
          });
      }
    },
    fandomPreSearch(text) {
      if (text != "") {
        this.loading.fandom = true;
        this.$axios
          .post(
            "/api/article/presearch",
            { type: "fandom", query: text },
            {
              headers: { "x-csrf-token": this.csrfToken },
              withCredentials: true
            }
          )
          .then(res => {
            this.options.fandomOptions = {...this.options.fandomOptions,...res.data};
            this.loading.fandom = false;
          });
      }
    },
    addArticle() {
      this.$axios
        .post("/api/article", this.articleRequestBody, {
          headers: { "x-csrf-token": this.csrfToken },
          withCredentials: true
        })
        .then(res => {
          alert(res.data);
        });
    },
    editArticle() {
      this.$refs["formArticle"].validate(valid => {
        if (valid) {
          this.loading.confirm = true;
          this.$Message.info("提交中...");
          this.$axios
            .put(`/api/article/${this.aid}`, this.articleRequestBody, {
              headers: { "x-csrf-token": this.csrfToken },
              withCredentials: true
            })
            .then(res => {
              if (res.data.msg == "success") {
                this.$Notice.success({
                  title: "提交成功"
                });
                this.$router.push(`/article/${this.aid}`);
              } else {
                this.$Notice.success({
                  title: "提交失败"
                });
                this.loading.confirm = false;
              }
            });
        }
      });
    },
    addChapter(aid) {
      this.loading.confirm = true;
      this.$axios
        .post(`/api/article/${aid}`, this.chapterRequestBody, {
          headers: { "x-csrf-token": this.csrfToken },
          withCredentials: true
        })
        .then(res => {
          if (res.data.cid) {
            this.$Notice.success({
              title: "提交成功，稍后将为您跳转文章页"
            });
            setTimeout(() => {
              this.$router.push(`/article/${aid}/${res.data.cid}`);
            }, 1500);
          } else {
            this.loading.confirm = false;
            this.$Notice.error({
              title: "提交失败，请稍后重新尝试"
            });
          }
        })
        .catch(e => {
          this.loading.confirm = false;
          this.$Notice.error({
            title: "提交失败，请稍后重新尝试"
          });
        });
    },
    editChapter() {
      this.$refs["formChapter"].validate(valid => {
        if (valid) {
          this.loading.confirm = true;
          this.$Message.info("提交中...");
          this.$axios
            .put(
              `/api/article/${this.aid}/${this.cid}`,
              this.chapterRequestBody,
              {
                headers: { "x-csrf-token": this.csrfToken },
                withCredentials: true
              }
            )
            .then(res => {
              if (res.data.msg == "success") {
                this.$Notice.success({
                  title: "提交成功"
                });
                this.$router.push(`/article/${this.aid}/${this.cid}`);
              } else {
                this.$Notice.success({
                  title: "提交失败"
                });
                this.loading.confirm = false;
              }
            });
        }
      });
    },
    newPost() {
      const result = {};
      this.loading.confirm = true;
      this.$axios
        .post("/api/article", this.articleRequestBody, {
          headers: { "x-csrf-token": this.csrfToken },
          withCredentials: true
        })
        .then(res => {
          if (res.data.aid) {
            result.aid = res.data.aid;
            this.postStep++;
            this.$axios
              .post(`/api/article/${res.data.aid}`, this.chapterRequestBody, {
                headers: { "x-csrf-token": this.csrfToken },
                withCredentials: true
              })
              .then(res => {
                if (res.data.cid) {
                  result.cid = res.data.cid;
                  this.postStep++;
                  this.$Notice.success({
                    title: "提交成功，稍后将为您跳转文章页"
                  });
                  setTimeout(() => {
                    this.$router.push(`/article/${result.aid}/${result.cid}`);
                  }, 1500);
                } else {
                  return (this.postStatus = "error");
                }
              })
              .catch(err => {
                return (this.postStatus = "error");
              });
          } else {
            return (this.postStatus = "error");
          }
        })
        .catch(err => {
          return (this.postStatus = "error");
        });
    },
    clear() {
      this.$store.commit("clearDraftTemp");
      this.loading.confirm = true;
      this.$router.push("/article/new");
    }
  },
  mounted() {
    document.styleSheets[0].insertRule(
      ".ql-editor{min-height: 300px !important}",
      0
    );
      this.$axios.get('/api/auth/register/info').then((res)=>{
        this.rateDescription = res.data.rateDescription
      })
    if (this.$route.query.draft) {
      //草稿编辑模式
      const draft = this.$store.state.draftTempData;
      this.form.title = draft.title;
      for (const index in draft.tag) {
        const element = draft.tag[index];
        this.options.tagOptions.push({ id: index, tag_name: element });
      }
      this.form.tag = draft.tag;
      this.chapter.content = draft.content;
    }
    if (this.$route.params.aid && !this.$route.params.cid) {
      //文章编辑模式
      this.edit = true;
      this.aid = this.$route.params.aid;
      this.$Spin.show();
      this.$axios.get(`/api/article/${this.aid}`).then(res => {
        const tmp = res.data;
        if (res.data.author.uid != this.$store.state.user.id) {
          this.$Modal.error({
            title: "非法操作",
            content: "您不是这篇文章的作者！",
            onOk: () => {
              return this.$router.back();
            }
          });
        }
        this.$Spin.hide();
        if (this.$route.query.action) {
          if (this.$route.query.action == "new") {
            // 章节新增模式
            this.action = "new";
            return (this.step = 1);
          }
        }
        console.log(tmp);
        this.form.title = tmp.article.article_title;
        this.form.summary = tmp.article.article_summary;
        this.form.note = tmp.article.article_note;
        this.form.rating = tmp.article.article_rating;
        this.form.warning = String(tmp.article.article_warning).split(",");
        for (const index in String(tmp.article.article_fandom).split(",")) {
          const element = String(tmp.article.article_fandom).split(",")[index];
          this.options.fandomOptions.push({ id: index, fandom_name: element });
        }
        for (const index in String(tmp.article.article_tag).split(",")) {
          const element = String(tmp.article.article_tag).split(",")[index];
          this.options.tagOptions.push({ id: index, tag_name: element });
        }
        for (const index in String(tmp.article.article_relationship).split(
          ","
        )) {
          const element = String(tmp.article.article_relationship).split(",")[
            index
          ];
          this.options.cpOptions.push({ id: index, cp_name: element });
        }
        for (const index in String(tmp.article.article_character).split(",")) {
          const element = String(tmp.article.article_character).split(",")[
            index
          ];
          this.options.characterOptions.push({
            id: index,
            character_name: element
          });
        }
        this.form.fandom = String(tmp.article.article_fandom).split(",");
        this.form.relationship = String(tmp.article.article_relationship).split(
          ","
        );
        this.form.category = tmp.article.article_category;
        this.form.character = String(tmp.article.article_character).split(",");
        this.form.tag = String(tmp.article.article_tag).split(",");
      });
    }
    if (this.$route.params.cid) {
      //章节编辑模式
      this.edit = true;
      this.step = 1;
      this.aid = this.$route.params.aid;
      this.cid = this.$route.params.cid;
      this.$axios.get(`/api/article/${this.aid}`).then(res => {
        const tmp = res.data;
        if (tmp.author.uid != this.$store.state.user.id) {
          this.$Modal.error({
            title: "非法操作",
            content: "您不是这篇文章的作者！",
            onOk: () => {
              return this.$router.back();
            }
          });
        }
      });
      this.$axios.get(`/api/article/${this.aid}/${this.cid}`).then(res => {
        const tmp = res.data;
        this.chapter.title = tmp.chapter_title;
        this.chapter.summary = tmp.chapter_summary;
        this.chapter.note = tmp.chapter_note;
        this.chapter.content = tmp.chapter_content;
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.loading.confirm == true) {
      return next();
    }
    const answer = window.confirm(
      "您确定要离开吗? 您在本页上做出的任何更改都将丢失!"
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
};
</script>
<style lang="less" scoped>
.wrap-card {
  width: 100%;
  line-height: 2rem;
  background-color: #ffffff;
  box-shadow: 0 0 5px 0 rgba(208, 208, 208, 0.3) inset,
    0 0px 7px 4px rgba(208, 208, 208, 0.5);
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
    border-radius: 0.3rem;
  }

  & > hr {
    flex-grow: 1;
    color: #a2d6cd77;
    margin-left: 1em;
  }
}

div.action-grounp {
  flex-basis: 100%;
  display: flex;
  justify-content: right;
}
.ins-title {
  font-size: 1.2em;
  font-weight: bold;
}
</style>