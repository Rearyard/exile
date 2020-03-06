<template>
  <div>
    <Layout class="layout">
      <Affix>
      <Header class="layout-header-bar" :class="{'layout-header-bar-portable':portable}" v-if="!hideHeader">
        <Menu mode="horizontal" id="menu" theme="dark" active-name="0">
          <div class="wrapper-nav" v-if="!portable">
            <div class="wrapper-logo">
              <img id="logo" src="./assets/logo.png" alt />
            </div>
            <div class="nav-func">
              <div class="wrapper-link">
                <MenuItem name="0" class="link-item" to="/">首页</MenuItem>
                <MenuItem name="1" class="link-item" to="/article">同人</MenuItem>
                <MenuItem name="2" class="link-item" to="/join">技术交流</MenuItem>
              </div>
            </div>
            <div class="wrapper-func-right">
              <div class="wrapper-search">
                <iInput
                  v-model="searchQuery"
                  placeholder="搜索"
                  icon="md-search"
                  class="header-search"
                ></iInput>
              </div>
              <Avatar style="background-color: #87d068" icon="ios-person" />
              
              <span style="display:inline-block;margin: 0 20px 0 20px"><router-link to="/login" style='color:#fff'>登录</router-link></span>
              <div class="tab-quick-add" @click="addPassage">
                <Icon type="md-brush" style="font-size: 25px;position: relative;top: 12px;" />
              </div>
            </div>
          </div>
          <div class="wrapper-nav-portable" v-if="portable">
            <div class="wrapper-logo">
              <img id="logo" src="./assets/logo.png" alt />
            </div>
            <div class="wrapper-search wrapper-search-portable" v-if="portable">
              <iInput v-model="searchQuery" placeholder="搜索" icon="md-search" class="header-search"></iInput>
            </div>
          </div>
        </Menu>
      </Header>
      </Affix>
      <Content>
        <router-view />
      </Content>
      <Footer style="text-align:center">@后花园2020</Footer>
      <Affix :offset-bottom="0" v-if="portable">
        <div class="wrapper-bottom-nav">
          <Menu mode="horizontal">
            <Row type="flex" justify="space-around" align="middle">
              <iCol span="5" class="bottom-nav">
                <MenuItem name="p0" to='/'>
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
              <iCol span="5" class="bottom-nav">
                <MenuItem name="p1" to='/article'>
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
              <iCol span="5" class="bottom-nav">
                <MenuItem name="p2" to='/join'>
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
              <iCol span="5" class="bottom-nav">
                <MenuItem name="p3" to='/self'>
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
export default {
  name: "app",
  data() {
    return {
      searchQuery: ""
    };
  },
  computed: {
    portable() {
      return window.screen.width < 1024;
    },
    hideHeader(){
      const situation = ['Login',"Register","Active"]
      return situation.indexOf(this.$route.name)!=-1
    }
  },
  methods:{
    addPassage(){
      return true
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
  margin: 0 18px 0 0;
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
}
.wrapper-bottom-nav {
  box-shadow: 0px 0px 5px 1px #6868684f;
  height: 50px;
  background: #fff;
}
.bottom-nav{
  position: relative;
  bottom:4px
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
