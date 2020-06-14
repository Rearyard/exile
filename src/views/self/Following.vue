<template>
  <div>
    <strong style="font-size:1rem;">我的关注（{{following.count}}）：</strong>
    <div v-if="following.count!=0" class="following-wrapper">
      <div
        v-for="user in following.author"
        :key="user.id"
        class="following-card"
      >
        <img v-show="user.user_avatar_url" :src = "user.user_avatar_url"/>
        <img v-show="user.user_avatar_url===null" src="https://chinocdn.cafuchino.cn/pic/202003091129722.png"/>
        <span style="line-height: 4rem; cursor: pointer;" @click="jumpUser(user.id)">{{user.user_nickname}}</span>
        <Button type = "info" v-if="isMyself" @click="followUser('unfollow', user.id)">取关</Button>
        <Button type = "info" v-else @click="jumpUser(user.id)">查看</Button>
      </div>
    </div>
    <div v-else>
      <p>还没有关注用户哦！</p>
    </div>
    <Page
      v-show = "following.count>10"
      :current.sync=followingPage
      :total=following.count
      @on-change="changeFollowingPage"
      style="margin-top:1rem; float: right;"
      simple
    />
  </div>
</template>

<script>
import cookie from 'js-cookie'
export default {
  data(){
    return{
      following: {},
      followingPage: 1,
      isMyself: false
    }
  },
  mounted(){
    this.getMyFollowing(0,10);
    if(this.$store.state.user.id == this.$route.params.uid){
      this.isMyself = true;
    }
  },
  methods: {
    getMyFollowing(offset, amount) {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
                'class': 'search-spin-icon-load',
                props: {
                    type: 'ios-loading',
                    size: 18
                }
            }),
            h('div', {
              'style': 'color: rgb(100, 119, 113);'
            },'Loading...')
          ])
        },
      });
      this.$axios.get(`/api/user/${this.$route.params.uid}/following`,{
        params: {
          offset: offset,
          amount: amount
        }    
      }).then(res => {
        this.$Spin.hide();
        console.log(res);
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200) {
            this.following=res.data;
          }
        }
      }).catch(error => {
        this.$Spin.hide();
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
          this.jumpLogin();
        } else {
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    changeFollowingPage(){
      this.getMyFollowing(10*(this.followingPage-1), 10);
    },
    followUser(operation, id){
      const csrfToken = cookie.get("csrfToken");
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
                'class': 'search-spin-icon-load',
                props: {
                    type: 'ios-loading',
                    size: 18
                }
            }),
            h('div', {
              'style': 'color: rgb(100, 119, 113);'
            },'Loading...')
          ])
        },
      });
      const data = {};
      if(operation === 'follow') {data.followedId = id}
      else if(operation === 'unfollow') {data.unfollowedId = id}
      else return;
      console.log(operation);
      this.$axios.post(
        `/api/user/${this.$store.state.user.id}/follow/user`, data,
        {
          'headers': { "x-csrf-token": csrfToken },
          'withCredentials': true,
        }
      ).then(res=>{
        this.$Spin.hide();
        if(res.status == 204){
          console.log('success')
          if(operation === 'follow'){this.$Message.success('关注成功')}
          if(operation === 'unfollow'){this.$Message.success('取关成功')}
          this.getMyFollowing(0,10);
        }
      }).catch(error => {
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.$Message.warning({
              content: '服务器出现了一些错误。',
              duration: 10,
              closable: true
          });
        } else if(error.response.status == 401){
          this.$Spin.hide();
          this.jumpLogin();
        } else if(error.response.status == 400){
          this.$Spin.hide();
          this.$Message.warning({
            content: `${error.response.data}`,
            duration: 10,
            closable: true
          });
        }else {
          this.$Spin.hide();
          this.$Message.warning({
              content: '服务器出错啦，请重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    jumpUser(id){
      const isMobile=this.$store.state.isMobile;
      if(isMobile){
        this.$router.push(`/selfmobile/${id}/info`)
      }else{
        this.$router.push(`/self/${id}/info`)
      }
    },
  }
}
</script>

<style scoped>

.following-wrapper{
  display: flex;
  display: -webkit-flex; /* Safari */
  -webkit-flex-direction: row-reverse; /* Safari 6.1+ */
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.following-card{
  width: 50%;
  height: 4rem;
  border-radius: 10px;
  background: rgba(180, 180, 180, 0.212);
  padding: 0px 8px 0px 8px;
  margin-bottom: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.following-card img{
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}


</style>
