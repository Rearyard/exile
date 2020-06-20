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
            <p v-if="!currentProvementResult">{{provementSuggestionText}}</p>
          <Input v-model="provementText" placeholder="建议您在本地编辑完成后再粘贴提交。" type="textarea" :rows="6" class="provement-input" :disabled="!!currentProvementResult || provementSubmitted||!provementReplied"/>
        </Row>
        <Row style="text-align: center;" v-if="!currentProvementResult">
          <Button type="success" @click="addProvement" :disabled="provementSubmitted||!provementReplied||provementItem.length>=2">{{provementItem.length>=2?'次数已用尽':'提交'}}</Button>
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
        provementItem:[],
        provementReplied:false,
        provementResponse: '',
        provementText: '',
        provementSubmitted: false,
        provementSuggestionText: '请修改您的自证内容并重新提交，以便我们再次审核。',
    };
  },
  computed: {
      displayedResult() {
        if (!this.provementReplied) {
          return '审核中'
        }
        return this.currentProvementResult? '已通过':'未通过';
      }
  },
  mounted(){
    this.judgeProvement();
  },
  methods: {
    showSpinner() {
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "search-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18
              }
            }),
            h(
              "div",
              {
                style: "color: rgb(100, 119, 113);"
              },
              "Loading..."
            )
          ]);
        }
      });
    },
    judgeProvement() {
      this.showSpinner();
      this.$axios.get('/api/auth/provement/judge').then(res=> {
        if (res.status == 200) {
          this.currentProvementResult = res.data;
        }
        this.getLastProvement();
      }).catch(error => {
        console.log('Error status code: ' + error.response.status);
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
          this.$Spin.hide();
        }
      );
    },
    getLastProvement() {
      this.$axios.get('/api/auth/provement').then(res=> {
        if (res.status == 200){
          const allProvements = res.data.provement;
          this.provementItem = allProvements
          if (allProvements.length > 0) {
            const lastProvement = allProvements[allProvements.length-1];
            this.provementText = lastProvement.content;
            this.provementReplied = lastProvement.replied;
            if (!this.provementReplied) {
              this.provementSuggestionText = '请耐心等待志愿者审核您的自证材料'
            }
            this.provementResponse = lastProvement.replied ? lastProvement.reply :'目前暂无对您的自证材料的回复。';
          } else {
            this.provementText = '当前未能查询到您之前提交的自证记录。';
          }
        }
        this.$Spin.hide();
      }).catch(error => {
        console.log('Error status code: ' + error.response.status);
        this.$Spin.hide();
        this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
        });
      });
    },
    addProvement() {
      const csrfToken = cookie.get("csrfToken");
      this.showSpinner();
      this.$axios.put('/api/auth/provement/edit', {content:this.provementText},
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        if (res.status === 200) {
          if (res.data.result) {
            this.getLastProvement()
          }
        }
        this.$Spin.hide();
      }).catch(error=> {
        console.log('Error status code: ' + error.response.status);
        if (error.response.status === 400){
          this.$Message.warning({
              content: '您的自证材料提交失败，请刷新重试。',
              duration: 10,
              closable: true
          });
        } else {
          this.$Message.warning({
              content: '网络出现了一些问题，您的自证材料未能提交，请刷新重试。',
              duration: 10,
              closable: true
          });
        }
        this.$Spin.hide();
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