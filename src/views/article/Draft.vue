<template>
  <div>
    <Row style="margin-top:2rem">
      <i-col
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
            <Icon type="pound"></Icon>草稿箱
          </Breadcrumb-item>
        </Breadcrumb>
        <Row type="flex" justify="center" class="wrap-card main-card">
          <Spin
            size="large"
            fix
            v-if="loading"
            class="main-spin"
            style="margin-top: 50px;height: 200px;"
          >
            <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            <div>载入中...</div>
          </Spin>
          <iCol span="22">
            <List>
              <ListItem v-for="(item,index) in draftArray" :key="item.title">
                <ListItemMeta
                  :avatar="icon"
                  :title="item.title"
                  :description="miniContent(item.content)"
                />
                <template slot="action">
                  <li>
                    <a @click="jumpEdit(index)">编辑发布</a>
                  </li>
                  <li>
                    <a @click="deleteDraft(index)">删除</a>
                  </li>
                </template>
              </ListItem>
            </List>
          </iCol>
        </Row>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import cookie from "js-cookie";
export default {
  data() {
    return {
      icon: require("@/assets/favicon_green.png"),
      loading: false,
      draftArray: []
    };
  },
  computed: {
    csrfToken() {
      return cookie.get("csrfToken");
    }
  },
  methods: {
    miniContent(text) {
      const tagReg = /<[^>]*>|<\/[^>]*>/gm;
      String.prototype.replaceAll = function(s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
      };
      return (
        text
          .replace(tagReg, " ")
          .replaceAll("&nbsp;", " ")
          .substr(0, 140) + "..."
      );
    },
    getDrafts() {
      this.loading = true;
      this.$axios.get("/api/article/drafts").then(res => {
        this.draftArray = res.data.result;
        this.loading = false;
      });
    },
    jumpEdit(index) {
      this.$store.commit("setDraftTemp", this.draftArray[index]);
      this.$router.push({ path: "/article/edit", query: { draft: true } });
    },
    deleteDraft(index) {
      this.$axios
        .delete(
          "/api/article/drafts",
          { index },
          {
            headers: { "x-csrf-token": this.csrfToken },
            withCredentials: true
          }
        )
        .then(res => {
          if (res.data.result) {
            this.draftArray.splice(index, 1);
            this.$Notice.success({
              title: "删除成功"
            });
          } else {
            this.$Notice.error({
              title: "删除失败"
            });
          }
        })
        .catch(err => {
          this.$Notice.error({
            title: "删除失败"
          });
        });
    }
  },
  mounted() {
    this.getDrafts();
  }
};
</script>

<style scoped>
.wrap-card {
  width: 100%;
  line-height: 4rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
    0px 10px 15px 12px rgba(208, 208, 208, 0.5);
  border-radius: 18px;
  margin-top: 2rem;
  transition: all 0.3s ease-in-out;
}
.main-card {
  min-height: 200px;
}
.main-spin {
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