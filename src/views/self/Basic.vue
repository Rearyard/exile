<template>
  <div>
    <Row style="border-bottom:1px solid #ddd; padding-bottom:2rem">
        <i-col :xs="2" :sm="4" :md="6" :lg="8" style="font-size: .9rem;">昵称</i-col>
        <i-col :xs="20" :sm="16" :md="12" :lg="10">
          <i-input placeholder="请输入..."></i-input>
        </i-col>
    </Row>
    
    <Row  style="margin-top:2rem">
        <i-col :xs="2" :sm="4" :md="6" :lg="4" style="font-size: .9rem;">个人介绍</i-col>
        <i-col :xs="20" :sm="16" :md="12" :lg="18">
          <i-input style="width:100%" type="textarea" :autosize="{minRows: 8,maxRows: 12}" placeholder="请输入..."></i-input>
        </i-col>
    </Row>
    <!-- 提交 -->
      <div class="btn">
        <i-button style="background:#9dd1a9; color:#fff;" size='large' shape="circle">提交</i-button>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>