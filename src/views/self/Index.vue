<template>
  <div>
    <Row>
        <i-col span="18" offset="3">
            <Breadcrumb separator=" > " style="margin-bottom: 2rem">
                <Breadcrumb-item href="/">
                    <Icon type="ios-home-outline"></Icon> 放逐地
                </Breadcrumb-item>
                <Breadcrumb-item>
                    <Icon type="pound"></Icon>个人中心
                </Breadcrumb-item>
            </Breadcrumb>
            
            <Row>
                <!-- 左侧菜单栏 -->
                <i-col span="6" class="nav-bar">
                    <router-link to="info" active-class="active">个人中心</router-link>
                    <router-link to="works" active-class="active">我的作品</router-link>
                    <router-link to="basic" active-class="active">基础设置</router-link>
                    <router-link to="account" active-class="active">修改密码</router-link>
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
        }
    },
    mounted(){
        if (this.$route.name=='Self') {
            this.$router.push(`/self/${this.$store.state.user.id}/info`)
        }
    },
    methods:{
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