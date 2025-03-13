<template>
  <div>
    <Row style="margin-top:2rem">
      <i-col :xs="{ span: 20, offset: 2}" :sm="{ span: 18, offset:3 }" :md="{ span: 16, offset: 4 }" :lg="{ span: 14, offset: 5 }">
        <Breadcrumb separator=" > " style="margin-bottom: 0.8rem">
          <Breadcrumb-item href="/">
            <Icon type="ios-home-outline"></Icon>
            后花园
          </Breadcrumb-item>
          <Breadcrumb-item>
            <Icon type="pound"></Icon>
            个人中心
          </Breadcrumb-item>
        </Breadcrumb>
        <div class="nav-bar">
          <div class="basic-info" type="info">
            <router-link to="info" active-class="active-info">
              基本信息
            </router-link>
          </div>
          <div class="my-article" type="info">
            <router-link to="works" active-class="active-works">
              我的文章
            </router-link>
          </div>
          <div class="my-favourate" type="info">
            <router-link to="favorite" active-class="active-favourate">
              我的收藏
            </router-link>
          </div>
        </div>
        <Divider style="margin-top: 1rem; margin-bottom: 1rem; background: rgb(76, 95, 91, 0.5)" />
        <router-view></router-view>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default{

}
</script>

<style lang='less' scoped>

.basic-info{
  width: 33%;
  height: 100%;
  line-height: 1.5rem;
  text-align:center;
  border-radius: 18px 0 0 18px;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
  -10px 10px 15px 5px rgba(208, 208, 208, 0.3);
  a{
    display: block;
    width:100%;
    line-height: 2rem;
    height:100%;
    text-align: center;
    cursor: pointer;
    color: #505050;
    transition: all 0.2s linear;
    
  }
  a:hover{
    background: #d8d8d8b2;
    color: #505050;
    //transform: scale(1.02);
    border-radius: 18px 0 0 18px;
  }
}
.my-article{
  width: 33%;
  height: 100%;
  text-align:center;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
  10px 10px 15px 5px rgba(208, 208, 208, 0.3);
  a{
    display: block;
    width:100%;
    line-height: 2rem;
    height:100%;
    text-align: center;
    cursor: pointer;
    color: #505050;
    transition: all 0.2s linear;
  }
  a:hover{
    background: #d8d8d8b2;
    color: #505050;
    //transform: scale(1.02);
  }
}
.my-favourate{
  width: 34%;
  height: 100%;
  text-align:center;
  border-radius: 0 18px 18px 0;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
  10px 0px 15px 5px rgba(208, 208, 208, 0.3);
  a{
    display: block;
    width:100%;
    line-height: 2rem;
    height:100%;
    text-align: center;
    cursor: pointer;
    color: #505050;
    transition: all 0.2s linear;
  }
  a:hover{
    background: #d8d8d8b2;
    color: #505050;
    //transform: scale(1.02);
    border-radius: 0 18px 18px 0;
  }
}
.active-info{
  background: #d8d8d8b2;
  border-radius: 18px 0px 0px 18px;
}
.active-works{
  background: #d8d8d8b2;
}
.active-favourate{
  background: #d8d8d8b2;
  border-radius: 0px 18px 18px 0px;
}
.nav-bar{
  margin: auto;
  width: 100%;
  height:100%;
  display: flex;
  border-radius: 18px;
  border: white 2.5px solid;
}

</style>

