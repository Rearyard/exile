<template>
  <div>
    <strong style="font-size:1rem;">我的关注（{{followed.count}}）：</strong>
    <div v-if="followed.count!=0" class="followed-wrapper">
      <div
        v-for="user in followed.author"
        :key="user.id"
        class="followed-card"
      >
        <img v-show="user.user_avatar_url" :src = "user.user_avatar_url"/>
        <img v-show="user.user_avatar_url===null" src="https://chinocdn.cafuchino.cn/pic/202003091129722.png"/>
        <span style="line-height: 4rem; cursor: pointer;" @click="jumpUser(user.id)">{{user.user_nickname}}</span>
        <Button type = "info">查看</Button>
      </div>
    </div>
    <div v-else>
      <p>还没有关注用户哦！</p>
    </div>
    <Page
      v-show = "followed.count>10"
      :current.sync=followedPage
      :total=followed.count
      @on-change="changeFollowedPage"
      style="margin-top:1rem; float: right;"
      simple
    />
  </div>
</template>

<script>
export default {
  data(){
    return{
      followed: {},
      followedPage: 1,
    }
  },
  mounted(){
    this.getMyFollowed(0,10);
  },
  methods: {
    getMyFollowed(offset, amount) {
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
      this.$axios.get(`/api/user/${this.$route.params.uid}/followed`, {
        params: {
          offset: offset,
          amount: amount
        }    
      }).then(res => {
        console.log(res);
        if(!res){
          this.$Spin.hide();
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.followed = res.data;
            this.$Spin.hide();
          }
        }
      }).catch(error => {
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
          this.$Spin.hide();
          this.jumpLogin();
        } else {
          this.$Spin.hide();
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    changeFollowedPage(){
      this.getMyFollowing(10*(this.followedPage-1), 10);
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
.followed-wrapper{
  display: flex;
  display: -webkit-flex; /* Safari */
  -webkit-flex-direction: row-reverse; /* Safari 6.1+ */
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.followed-card{
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

.followed-card img{
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}


</style>
