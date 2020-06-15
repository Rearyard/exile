<template>
  <div>
    <Row>
      <div>
        <Row>
          <h3 class="validation-result">当前自证审查结果：{{displayedResult}}</h3>
          <p v-if="!currentResult && validationResponse"><strong>审查回复：</strong>{{validationResponse}}</p>
        </Row>
        <Divider/>
        <Row>
            <p v-if="!currentResult">请修改您的自证内容并重新提交，以便我们再次审核。</p>
          <Input v-model="validationText" placeholder="建议您在本地编辑完成后再粘贴提交。" type="textarea" :rows="6" class="validation-input" :disabled="!!currentResult"/>
        </Row>
        <Row style="text-align: center;" v-if="!currentResult">
          <Button type="success">提交</Button>
        </Row>
      </div>
    </Row>
  </div>
</template>

<script>
import moment from 'moment'
import cookie from 'js-cookie'
export default {
  data() {
    return {
        currentResult: false,
        validationResponse: '你好，经过审核我们认为之前提交的内容不足以证明您属于您所选择的年龄范围，主要原因为：blablablabla~',
        validationText: 'Some self-proof text submitted before.',
    };
  },
  computed: {
      displayedResult() {
        return this.currentResult? '已通过':'未通过';
      }
  },
//   mounted(){
//   },
//   methods: {

//   }
};
</script>

<style scoped>
.validation-result {
    margin-bottom: 15px;
}
.validation-input {
    width: 100%;
    margin: 10px 0px;
}
</style>