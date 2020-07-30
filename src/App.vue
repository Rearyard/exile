<template>
  <div>
    <Layout class="layout">
      <Affix style="width:100%">
        <Header
          class="layout-header-bar"
          :class="{'layout-header-bar-portable':portable}"
          v-if="!hideHeader"
        >
          <Menu
            mode="horizontal"
            id="menu"
            theme="dark"
            :active-name="activeTab"
            @on-select="storeTab"
          >
            <div class="wrapper-nav" v-if="!portable">
              <div class="wrapper-logo" @click="toIndex">
                <img id="logo" src="./assets/logo.png" alt />
              </div>
              <div class="nav-func">
                <div class="wrapper-link">
                  <MenuItem name="0" class="link-item" to="/">首页</MenuItem>
                  <MenuItem name="1" class="link-item" to="/article">同人</MenuItem>
                  <MenuItem name="2" class="link-item" to="/join">技术交流</MenuItem>
                </div>
              </div>
              <div class="wrapper-func-right" style="display:flex; align-items: center; height:64px">
                <div class="wrapper-search">
                  <iInput
                    @on-click="jumpSearchResult"
                    @on-enter="jumpSearchResult"
                    v-model="searchQuery"
                    placeholder="搜索"
                    icon="md-search"
                    class="header-search"
                  ></iInput>
                </div>
                <Badge :count="message.number" :overflow-count="99" :offset=[3,10]
                  style="display:flex; align-items: center; padding: 0px 10px 0px 0px">
                  <Icon @click="jumpNotificationPC()"
                    type="ios-notifications-outline" size="40"
                    style="cursor: pointer"
                  ></Icon>
                </Badge>
                <Avatar
                  :src="user.user_avatar_url"
                  style="background-color: #87d068;"
                  icon="ios-person"
                />
                <span style="display:inline-block;margin: 0 20px 0 20px">
                  <Dropdown>
                    <a v-if="user.id" style="color:#fff">{{user.user_nickname}}</a>
                    <DropdownMenu slot="list">
                      <DropdownItem divided>
                        <a @click="jumpUserCenter" style="color:black">个人中心</a>
                      </DropdownItem>
                      <DropdownItem divided>
                        <a @click="jumpNotificationPC" style="color:black">消息中心</a>
                      </DropdownItem>
                      <DropdownItem divided>
                        <a @click="postLogout" style="color:black">登出</a>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <a v-if="!user.id" @click="jumpLogin" style="color:#fff">登录</a>
                </span>
                <div class="tab-quick-add" @click="addPassage">
                  <Icon type="md-brush" style="font-size: 25px;position: relative;top: 12px;" />
                </div>
              </div>
            </div>
            <div class="wrapper-nav-portable" v-if="portable">
              <Row :gutter="16">
                <iCol span="8">
                  <img id="logo" src="./assets/logo.png" alt />
                </iCol>
                <iCol span="16">
                  <iInput
                    @on-click="jumpSearchResult"
                    @on-enter="jumpSearchResult"
                    v-model="searchQuery"
                    placeholder="搜索"
                    icon="md-search"
                    class="header-search"
                  ></iInput>
                </iCol>
              </Row>
            </div>
          </Menu>
        </Header>
      </Affix>
      <Content>
        <router-view />
      </Content>
      <Footer style="text-align:center">@后花园2020</Footer>
      <Affix :offset-bottom="0" v-if="portable&&!hideHeader">
        <div class="wrapper-bottom-nav">
          <Menu mode="horizontal" :active-name="activeTab" @on-select="storeTab">
            <Row type="flex" justify="space-around" align="middle">
              <iCol span="4" class="bottom-nav">
                <MenuItem name="p0" to="/">
                  <Row type="flex" justify="center">
                    <iCol class="bottom-nav-icon">
                      <Icon type="ios-home" :size="35" />
                    </iCol>
                    <iCol class="bottom-nav-text">
                      <span>主页</span>
                    </iCol>
                  </Row>
                </MenuItem>
              </iCol>
              <iCol span="4" class="bottom-nav">
                <MenuItem name="p1" to="/article">
                  <Row type="flex" justify="center">
                    <iCol class="bottom-nav-icon">
                      <Icon type="ios-paper" :size="30" />
                    </iCol>
                    <iCol class="bottom-nav-text">
                      <span>同人</span>
                    </iCol>
                  </Row>
                </MenuItem>
              </iCol>
              <iCol span="4" class="bottom-nav">
                <MenuItem name="p2" to="/joinmobile">
                  <Row type="flex" justify="center">
                    <iCol class="bottom-nav-icon">
                      <Icon type="md-git-branch" :size="30" />
                    </iCol>
                    <iCol class="bottom-nav-text">
                      <span>技术交流</span>
                    </iCol>
                  </Row>
                </MenuItem>
              </iCol>
              <iCol span="4" class="bottom-nav" >
                <MenuItem name="p5" to="/notification">
                  <Row type="flex" justify="center">
                    <iCol class="bottom-nav-icon">
                      <Badge :count="message.number" :overflow-count="99" :offset=[10,-2]>
                        <Icon type="md-mail" :size="30" />
                      </Badge>
                    </iCol>
                    <iCol class="bottom-nav-text">
                      <span>消息</span>
                    </iCol>
                  </Row>
                
                </MenuItem>
              </iCol>
              <iCol span="4" class="bottom-nav">
                <MenuItem name="p3" :to="{name: 'SelfMobileInfo', params: {uid: this.user.id}}">
                  <Row type="flex" justify="center">
                    <iCol class="bottom-nav-icon">
                      <Icon type="md-person" :size="30" />
                    </iCol>
                    <iCol class="bottom-nav-text">
                      <span>个人中心</span>
                    </iCol>
                  </Row>
                </MenuItem>
              </iCol>
            </Row>
          </Menu>
        </div>
      </Affix>
    </Layout>
  </div>
</template>

<script>
import cookie from "js-cookie";
import { mapState } from "vuex";
export default {
  name: "app",
  data() {
    return {
      activeTab: "0",
      searchQuery: "",
      message: {}
    };
  },
  computed: {
    ...mapState(["user"]),
    portable() {
      return window.screen.width < 1024;
    },
    hideHeader() {
      const situation = ["Login", "Register", "Active","Reset"];
      return situation.indexOf(this.$route.name) != -1;
    }
  },
  watch: {
    $route() {
      // console.log(this.$store)
      if (
        this.$store.state.user.user_status == 0 &&
        this.$route.name != "Active"
      ) {
        this.$router.push("/active");
      }
    }
  },
  methods: {
    toIndex() {
      this.$router.push("/");
    },
    storeTab(name) {
      sessionStorage.activeTab = name;
    },
    addPassage() {
      this.$router.push("/article/new");
      this.activeTab = "1";
      return true;
    },
    jumpLogin() {
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    _isMobile() {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      // console.log(flag);
      return flag ? 1 : 0;
    },
    postLogout() {
      const csrfToken = cookie.get("csrfToken");
      this.$axios
        .post(
          "/api/auth/logout",
          {},
          {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true
          }
        )
        .then(res => {
          this.$store.commit("clearUserInfo");
          this.$router.push("/login");
        });
    },
    getMessage() {
      this.$Spin.show();
      this.$axios.get("/message/all").then( res => {
        if(res.status == 200){
          this.message = res.data;
          this.message.number = res.data.likes + res.data.comments;
          // console.log('message:', this.message.number)
        }
        this.$Spin.hide();
      }).catch(error=>{
        this.$Spin.hide();
      });
    },
    jumpUserCenter() {
      // console.log(`user id is ${this.user.id}`);
      // this.$router.push(`/self/${this.user.id}/info`)
      this.$router.push({
        name: "SelfInfo",
        params: {
          uid: this.user.id
        }
      });
    },
    jumpMobileCenter() {
      this.$router.push({
        name: "SelfMobile",
        params: {
          uid: this.user.id
        }
      });
    },
    jumpSearchResult() {
      if (this.searchQuery === "") {
        console.log("please enter something");
      } else {
        this.$router.push({
          path: "/article/searchresult",
          query: {
            query: this.searchQuery
          }
        });
      }
    },
    jumpNotificationPC(){
      this.$router.push({
        path: '/pcnotification/system'
      })
    }
  },
  mounted() {
    const isMobile = this._isMobile();
    if (sessionStorage.activeTab) {
      this.activeTab = sessionStorage.activeTab;
    }
    this.$store.commit("setIsMobile", isMobile);
    // console.log(isMobile);
    if (!this.user.id) {
      this.$axios.get("/api/auth/callback").then(res => {
        if (res.data) {
          const user = res.data;
          this.$store.commit("setUserInfo", user);
        } else {
          // FIX: 修复可能出现的套娃问题
          setTimeout(() => {
            if (this.$route.name != "Register" && this.$route.name != "Login"&&this.$route.name!="Reset") {
              this.jumpLogin();
            }
          }, 500);
        }
      });
    } else {
      this.getMessage();
    }
  }
};
</script>

<style>
.layout {
  min-height: 100vh;
}
.layout-header-bar {
  background: #333333;
  color: #fff;
  box-shadow: 0px 0px 5px 1px #6868684f;
}
.layout-header-bar-portable {
  padding: 0 5px 0 5px !important;
}
#logo {
  height: 35px;
  margin-top: 12px;
}
#menu {
  background-color: #333333;
  color: #fff;
}
#menu::after {
  background: none;
}
.wrapper-nav {
  width: 95%;
  margin: 0 auto;
}
.wrapper-nav-portable {
  width: 100%;
}
.wrapper-logo {
  display: block;
  float: left;
  margin: 0 5px 0 0;
}
.nav-func {
  margin: 0 0 0 20px;
  height: inherit;
  display: block;
  float: left;
}
.layout .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item-active,
.layout .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item:hover {
  background: #ffffff24;
  border-radius: 5px;
}
.wrapper-logo {
  display: inline-block;
}
.wrapper-search {
  display: inline-block;
  margin: 0 8px 0 0;
}
.wrapper-search-portable {
  float: right;
}
.header-search input {
  background: #434343;
  color: #fff;
  border-radius: 2rem;
}
.wrapper-func-right {
  display: block;
  float: right;
}
.tab-quick-add {
  display: inline-block;
  width: 50px;
  text-align: center;
  height: 80px;
  background: #333333;
  box-shadow: 0px 0px 5px 1px #0000009c;
  border-radius: 5px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.tab-quick-add:hover {
  transform: scale(1.1);
}
.wrapper-bottom-nav {
  box-shadow: 0px 0px 5px 1px #6868684f;
  height: 50px;
  background: #fff;
}
.bottom-nav {
  position: relative;
  bottom: 4px;
}
.bottom-nav a {
  border-bottom: none !important;
}
.bottom-nav-icon {
  height: 30px;
}
.bottom-nav-text {
  height: 20px;
  position: absolute !important;
  top: 14px;
  font-size: 0.7em;
}
</style>
