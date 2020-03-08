<template>
  <div>
      <Row>
        <i-col :xs="2" :sm="4" :md="6" :lg="8">
          <img class="img" src="" alt="">
        </i-col>
        <!-- 等级 -->
        <i-col :xs="8" :sm="6" :md="4" :lg="3">
          <div class="grade">lv2</div>          
        </i-col>

        <i-col :xs="16" :sm="18" :md="8" :lg="8">
          <!-- 更改头像 -->
          <Row>
            <i-col :xs="24" :sm="16" :md="22" :lg="12">
              <p class="changeImg">更改头像</p>
            </i-col>
          </Row>
          <Row>
            <i-col :xs="24" :sm="24" :md="24" :lg="20">
              <p><span style="margin-left:0">0</span>粉丝</p>
              <p><span>0</span>关注</p>
              <p><span>0</span>创作</p>
            </i-col>
          </Row>
        </i-col>
    </Row>
      <div class="bottom-top" style="margin-top:3rem;">
        <p><span>昵称</span>CafuChino</p>
        <p><span>ID</span>00000001</p>
        <p><span>邮箱</span>admin@admin.com</p>
        <p><span>注册日期</span>2020.02.02</p>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='less'>
@box-bg:#d8d8d8;
@box-shadow-big: 0px 10px 15px 12px rgba(208,208,208,0.5);
@box-shadow-small: 0px 0px 15px 5px rgba(208,208,208,0.2);
@border-radius:18px;

// 右边

.img{
    width: 174px;
    height: 174px;
    border-radius: 50%;
    background: #999;
    margin-right: 1rem;
}
.grade{
    padding: 0 .5rem;
    height:20px;
    background: #ffc300;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    margin-right: 1rem;
}
  // 更改头像
  .changeImg{
    width: 8rem;
    height: 2.4rem;
    background: rgba(157, 209, 169, 1);
    font-size: 1.2rem;
    color:#fff;
    text-align: center;
    line-height: 2.4rem;
    border-radius: @border-radius;
    font-weight: bold;
    margin-bottom: 10px;
  }
  // 粉丝-创作-关注
  .atte-box{
    display: flex;
    line-height: 2;
    p{
      border-right: 1px solid #999;
      padding-right: 1rem;
    }
    span{
      font-weight: bold;
      margin: 0 1rem;
    }
  }
    // 个人介绍
  .bottom-top{
    p{
      line-height: 3;
      border-bottom: 1px solid #ddd;
      font-size: 1.2rem;
      display: flex;
    }
    span{
      width: 15rem;
    }
  }
</style>