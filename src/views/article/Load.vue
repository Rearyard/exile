<template>
  <div>
    <Row style="margin-top:2rem" type="flex" justify="center">
      <iCol :xs="{ span: 20}" :sm="{ span: 18}" :md="{ span: 16}" :lg="{ span: 14}">
        <Row class="wrapper-card">
          <iCol>
            <spin fix v-if="loading">
              <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
              <div>解析中，请稍候</div>
            </spin>
            <Upload
              :headers="{'x-csrf-token':csrfToken}"
              :with-credentials="true"
              accept=".xml,.do"
              :format="['xml','do']"
              type="drag"
              action="/api/file/xml"
              :show-upload-list="false"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              v-if="showUpload"
            >
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击选择或拖拽导出文件至此以上传</p>
                <p>目前支持LOFTER的导出文件</p>
              </div>
            </Upload>
          </iCol>
          <iCol v-if="!showUpload">
            <h2>导入结果:</h2>
            <br />
            <p>目前仅支持导入LOFTER文章数据，共识别文章{{result.length}}篇，文章内图片和超链接已自动剔除</p>
            <br />
            <Row type="flex" align="middle">
              <iCol span="6">
                <span>请初步筛选需要导入的文章:</span>
              </iCol>
              <iCol>
                <Button type="success" @click="confirmModal=true">筛选完毕</Button>
              </iCol>
            </Row>
            <br />
            <Table border :columns="columns" :data="result" @on-selection-change="changeCheck">
              <template slot-scope="{ row }" slot="tag">{{row.tag?row.tag.join(','):'无tag'}}</template>
            </Table>
          </iCol>
        </Row>
      </iCol>
    </Row>
    <Modal v-model="confirmModal" width="360">
      <p slot="header" style="color:#a2d6cd;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>导入确认</span>
      </p>
      <div style="text-align:center">
        <p>您一共选中了{{checked.length}}篇文章</p>
        <p>确定要导入吗？</p>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="modalLoading" @click="postDraft">确定</Button>
      </div>
    </Modal>
    <BackTop></BackTop>
  </div>
</template>

<script>
import cookie from "js-cookie";
export default {
  data() {
    return {
      showUpload: true,
      loading: false,
      confirmModal: false,
      modalLoading: false,
      result: [],
      checked: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        { title: "标题", key: "title" },
        { title: "TAG", slot: "tag", width: 120, align: "center" }
      ]
    };
  },
  computed: {
    csrfToken() {
      return cookie.get("csrfToken");
    }
  },
  methods: {
    handleProgress() {
      this.loading = true;
    },
    handleSuccess(response) {
      this.result = response.result;
      this.loading = false;
      this.showUpload = false;
    },
    changeCheck(set) {
      console.log(set);
      this.checked = set;
    },
    postDraft() {
      this.modalLoading = true
      this.$axios.post(
        "/api/article/drafts",
        { query: this.checked },
        {
          headers: { "x-csrf-token": this.csrfToken },
          withCredentials: true
        }
      ).then(res=>{
        this.modalLoading = false;
        this.confirmModal = false;
        if (res.data.result) {
          this.$Message.success('文章已经成功导入到草稿箱');
          this.$router.push('/article/new');
        }else{
          this.$Message.error('导入失败，若多次失败请联系工作人员上报')
        }
      }).catch(err=>{
        this.modalLoading = false;
        this.confirmModal = false;
        this.$Message.error('服务器出错，若多次失败请联系工作人员上报')
      })
    }
  }
};
</script>

<style scoped>
.wrapper-card {
  margin: 15px 0 15px 0;
  padding: 15px 30px 15px 30px;
  border: 1px solid rgb(226, 226, 226);
  background-color: #ffffff;
  box-shadow: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>