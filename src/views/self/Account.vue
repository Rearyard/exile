<template>
  <div>
      <!-- 修改内容 -->
      <div class="acc-info">
        <p class="info1"><span>昵称</span><i-input :value.sync="value" placeholder="请输入内容" style="width: 240px"></i-input></p>
        <p class="info1"><span>新密码</span><i-input :value.sync="value" placeholder="无需修改则留空" style="width: 240px"></i-input></p>
        <div class="info1 info2">
          <span>赞赏</span>
          <Switch @on-change="change"></Switch>
          <div class="award-img">
            <!-- 图片上传 -->
            <img src="" alt="">
            <!-- 提示图片上传文字 -->
            <div class="warp">
              <p>点击上传</p>
              <p>文件大小建议在2M以下</p>
              <p>收款码将在您开启赞赏功能后由赞赏按钮展示</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提交 -->
      <div class="btn">
        <i-button style="background:#9dd1a9; color:#fff;" size='large' shape="circle">提交</i-button>
      </div>
  </div>
</template>

<script>
export default {
  data () {
      return {
          value: ''
      }
  },
    methods: {
      change (status) {
          this.$Message.info('开关状态：' + status);
      }
  }
};
</script>

<style lang='less'>
    // 个人介绍
    .acc-info{
      .info1{
        height: 3;
        line-height: 3;
        border-bottom: 1px solid #ddd;
        font-size: 1.2rem;
        display: flex;
        span{
          width: 15rem;
        }
        input{
          margin-top: 0.7rem;
        }
      }
      .info2{
        border: 0;
        span{
          width: 8rem;
        }
        .award-img{
          display: flex;
          margin-top: 1rem;
          img{
            width: 10rem;
            height: 10rem;
            background: rgba(217, 217, 217, 1);
          }
          p{
            font-size: .9rem;
            line-height: 1.5;
            margin-left: 1rem;
            color: rgba(80, 80, 80, 0.62);
          }
        }
      }
    }
    // 提交按钮
    .btn{
      display: flex;
      justify-content: flex-end;
      margin-top: 3rem;
      margin-right: 3rem;
    }
</style>