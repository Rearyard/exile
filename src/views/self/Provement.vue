<template>
  <div>
    <Row>
      <div>
        <Row>
          <h3 class="provement-result">当前自证审查结果：{{displayedResult}}</h3>
          <p v-if="!currentProvementResult && provementResponse"><strong>审查回复：</strong>{{provementResponse}}</p>
        </Row>
        <Divider/>
        <Row>
            <p v-if="!currentProvementResult">请修改您的自证内容并重新提交，以便我们再次审核。</p>
          <Input v-model="provementText" placeholder="建议您在本地编辑完成后再粘贴提交。" type="textarea" :rows="6" class="provement-input" :disabled="!!currentProvementResult"/>
        </Row>
        <Row style="text-align: center;" v-if="!currentProvementResult">
          <Button type="success" @click="addProvement">提交</Button>
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
        currentProvementResult: false,
        provementResponse: '你好，经过审核我们认为之前提交的内容不足以证明您属于您所选择的年龄范围，主要原因为：blablablabla~',
        provementText: 'Some self-proof text submitted before.',
    };
  },
  computed: {
      displayedResult() {
        return this.currentProvementResult? '已通过':'未通过';
      }
  },
  mounted(){
    this.judgeProvement();
  },
  methods: {
    judgeProvement() {
      this.$axios.get('/api/auth/provement/judge').then(res=> {
        console.log(res);
        this.currentProvementResult = res.data;
        if (!this.currentProvementResult) {
          this.getLastProvement();
        }
        this.$Spin.hide();
      }).catch(error => {
        console.log('Error status code: ' + error.response.status);
        this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
        });
      });
    },
    getLastProvement() {
      this.$axios.get('/api/auth/provement').then(res=> {
        console.log(res);
        const allProvements = res.data.provement;
        this.provementText = allProvements[allProvements.length-1];
      }).catch(error => {
        console.log('Error status code: ' + error.response.status);
        this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
        });
      });
    },
    addProvement(content) {
      const csrfToken = cookie.get("csrfToken");
      this.$axios.put('/api/auth/provement/edit', {content:content},
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        // TODO: check res.status
        this.$Message.success("您的自证材料已成功提交，请耐心等待我们的管理人员审核。");
        // this.closeProvementModal();
      }).catch(error=> {
        console.log('Error status code: ' + error.response.status);
        // TODO: check status code
        this.$Message.warning({
            content: '网络出现了一些问题，您的自证材料未能提交，请刷新重试。',
            duration: 10,
            closable: true
        });
        // this.closeProvementModal();
      });
    },

  }
};
</script>

<style scoped>
.provement-result {
    margin-bottom: 15px;
}
.provement-input {
    width: 100%;
    margin: 10px 0px;
}
</style>