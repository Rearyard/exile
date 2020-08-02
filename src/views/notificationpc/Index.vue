<template>
  <div>
    <Row style="margin-top:2rem">
        <i-col span="18" offset="3">
            <Breadcrumb separator=" > " style="margin-bottom: 2rem">
                <Breadcrumb-item href="/">
                    <Icon type="ios-home-outline"></Icon> 后花园
                </Breadcrumb-item>
                <Breadcrumb-item>
                    <Icon type="pound"></Icon>消息中心
                </Breadcrumb-item>
            </Breadcrumb>
            <Row>
                <!-- 左侧菜单栏 -->
                <i-col span="5" class="nav-bar">
                    <router-link to="system" active-class="active">系统消息</router-link>
                    <router-link to="like" active-class="active">点赞({{message.likes}})</router-link>
                    <router-link to="comment" active-class="active">评论({{message.comments}})</router-link>
                </i-col>
                <i-col class="right" span="17" offset="1">
                    <!-- 右边二级路由 -->
                    <router-view></router-view>
                </i-col>
            </Row>
        </i-col>
    </Row>
  </div>
</template>

<script>
export default {
    data(){
        return{
            message:{}
        }
    },
    methods:{
        getMessage() {
        this.$Spin.show();
        this.$axios.get("/message/all").then( res => {
            if(res.status == 200){
            this.message = res.data;
            // console.log('message:', this.message.number)
            }
            this.$Spin.hide();
        }).catch(error=>{
            this.$Spin.hide();
        });
        },
    },
    mounted(){
        this.message.likes = 0;
        this.message.comments = 0;
        this.getMessage();
    }
};
</script>

<style lang='less' scoped>
@box-bg:#d8d8d8;
@box-shadow-big: 0px 10px 15px 12px rgba(208,208,208,0.5);
@box-shadow-small: 0px 0px 15px 5px rgba(208,208,208,0.2);
@border-radius:18px;
.nav-bar{
    box-shadow: @box-shadow-small;
    border-radius: @border-radius;
    background: #fff;
    padding: 1rem 0;
    a{
        display: block;
        line-height: 5rem;
        text-align: center;
        font-size: 1rem;
        cursor: pointer;
        color: #505050;
        transition: all 0.2s linear;
    }
    a:hover{
        background: #d8d8d8;
        color: #505050;
        border-radius: 8px;
    }
}
// 激活导航栏后的样式
.active{
    border-radius: 8px;
    background: #d8d8d8;    
}

.right{
    background: #fff;
    box-shadow: @box-shadow-small;
    border-radius: @border-radius;
    padding: 4rem;
}
</style>