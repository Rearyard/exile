<template>
  <div>
    <Row style="margin-bottom:2em">
      <iCol span="6">
          <Badge text="Lv.1">
              <div class="center">
                <img :src="user.user_avatar_url" class="avatar" />
              </div>

          </Badge>
      </iCol>
      <iCol span="10" offset="2">
        <Upload
          v-show="user.isMyself"
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handeleBeforeUpload"
          accept="image/*"
          action=" "
        >
          <Button
            v-show="user.isMyself"
            type="success"
            size="large"
            shape="circle"
          >
            更改头像
          </Button>
        </Upload>
        <Modal
          title="设置头像"
          v-model="avatarCropper"
          :mask-closable="false"
          fullscreen
        >
          <div id="avatar-cropper">
            <vueCropper
              ref="cropper"
              :img="cropperOption.img"
              :outputSize="cropperOption.size"
              :outputType="cropperOption.outputType"
              :info="true"
              :full="cropperOption.full"
              :canMove="cropperOption.canMove"
              :canMoveBox="cropperOption.canMoveBox"
              :original="cropperOption.original"
              :autoCrop="cropperOption.autoCrop"
              :fixed="cropperOption.fixed"
              :fixedNumber="cropperOption.fixedNumber"
              :centerBox="cropperOption.centerBox"
              :infoTrue="cropperOption.infoTrue"
              :fixedBox="cropperOption.fixedBox"
              :maxImgSize="1500"
            ></vueCropper>
          </div>
          <div slot = "footer">
            <Button type ="info" :loading="avatarLoading" @click="uploadFile">确认</Button>
            <Button class = "button-cancel" @click="closeModal">取消</Button>
          </div>
        </Modal>
        <Row v-show="!user.isMyself" style="height: 2rem;"></Row>
        <Row type="flex" justify="space-around" align="middle" class="wrapper-count">
          <iCol span="6" class="count-item">
            <span class="count">{{user.myFollowed}} </span>粉丝 
          </iCol>
          <Divider type="vertical" />
          <iCol span="6" class="count-item">
            <span class="count">{{user.myFollowing}}</span>关注
          </iCol>
        </Row>
        <Row class="description">
          <i-col span="6">
          简介：
          </i-col>
          <i-col span ="18">
            <span v-if="!editsignature"> 
              {{user.user_signature}}
              <Icon
                @click="editSignature"
                v-show="user.isMyself"
                type="ios-create-outline"
                size="24"
              />
            </span>
            <span v-else>
              <iInput
                v-model = "signature"
                @on-enter="changeUserInfo"
                :disabled="inputLoading"
                placeholder="请输入新的简介"
                :autosize="{minRows: 2,maxRows: 4}" 
                style="width: 80%;"
                icon="md-close"
                @on-click="cancelChangeSignature"
              >
              </iInput>
              <Button type="info" @click="changeUserInfo" icon = "md-checkmark" />
            </span>
          </i-col>
        </Row>
        <Row style="font-size:1.1rem; padding-top:1rem">
          <i-col offset="12" span="12">
            <span v-show="user.isMyself" style="cursor: pointer" @click="openPswModal">
              <strong>>>>修改密码</strong>
            </span>
          </i-col>
        </Row>
        <Modal
          title="修改密码"
          v-model="pswModal"
          :mask-closable="false"
        >
          <Steps :current=pswStep  style="margin-bottom:2rem;">
              <Step title="输入密码" content=""></Step>
              <Step title="确认密码" content=""></Step>
              <Step title="新密码" content=""></Step>
          </Steps>
          <Divider />
          <Row class="info-row" v-if="pswStep == 0">
            <p>请输入旧密码：</p>
            <Input
              style="margin-top:1rem"
              type="password"
              password 
              v-model="oldpsw"
              placeholder="无需修改则留空"
            />       
          </Row>  
          <Row class="info-row"  v-if="pswStep == 1">
            <p>请输入新密码：</p>
            <Input
              style="margin-top:1rem"
              type="password"
              password 
              v-model="newpsw"
              placeholder="无需修改则留空"
            />
          </Row>              
          <Row class="info-row"  v-if="pswStep == 2">
            <p>请再重复一遍新密码：</p>
            <Input
              style="margin-top:1rem"
              type="password"
              password 
              v-model="newpswConfirm"
              placeholder="无需修改则留空"
            />
          </Row>
          <div slot = "footer">
            <Button
              @click="pswNextStep"
              type ="info"
              :loading = pswLoading
            >
              <span v-if="pswStep<2">继续</span>
              <span v-else>确认</span>
            </Button>
            <Button class = "button-cancel" @click="closePswModal">关闭</Button>
          </div>
        </Modal>
      </iCol>
    </Row>
    <Row class='info-row'>
      <iCol span="12">昵称</iCol>
      <iCol span="12">
        <span v-if="!editname">
          {{user.user_nickname}}
          <Icon
            @click="editNickname"
            v-show="user.isMyself"
            type="ios-create-outline"
            style="cursor: pointer;"
            size="24"         
          />
        </span>
        <span v-else>
          <iInput
            @on-enter="changeUserInfo"
            :disabled="inputLoading"
            v-model = "nickname"
            placeholder="请输入新的昵称"
            class = "editname"
            style="width: 80%;"
            icon="md-close"
            @on-click="cancelChangeName"
          >
          </iInput>
          <Button type="info" @click="changeUserInfo" icon = "md-checkmark" />
        </span>
      </iCol>
    </Row>
    <Divider />
    <div  v-show="user.isMyself">
      <Row class='info-row'>
        <iCol span="12">用户名</iCol>
        <iCol span="12">{{user.user_login}}</iCol>
      </Row>
      <Divider />
    </div>
    <div  v-show="user.isMyself">
      <Row class='info-row' v-show="user.isMyself">
        <iCol span="12">邮箱</iCol>
        <iCol span="12">{{user.user_email}}</iCol>
      </Row>
      <Divider />
    </div>
    <Row class='info-row'>
      <iCol span="12">注册日期</iCol>
      <iCol span="12">{{user.user_registered}}</iCol>
    </Row>
    <Divider />
  </div>
</template>

<script>
import cookie from 'js-cookie'
import { VueCropper }  from 'vue-cropper'

export default {
  data(){
    return {
      user:{},
      avatarCropper: false,
      cropperOption: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      avatarLoading: false,
      editname: false,
      editsignature: false,
      inputLoading: false,
      nickname: '',
      signature: '',
      pswModal: false,
      pswStep:0,
      oldpsw: '',
      newpsw: '',
      newpswConfirm:'',
      pswLoading: false,
    }
  },
  components: { 
    VueCropper 
  }, 
  mounted() {
    this.getUserInfo();
  },
  methods: {
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    getUserInfo() {
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
      this.$axios.get(`/api/user/${this.$route.params.uid}`).then(res => {
        // console.log(res);
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.user = res.data;
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
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    handeleBeforeUpload(file){
      if(this.user.isMyself){
        this.fileInfo =file;
        const data = window.URL.createObjectURL(new Blob([file]));
        this.cropperOption.img = data;
        this.avatarCropper=true;
        return false;//取消自动上传
      }
    },
    handleSuccess(){
      console.log('upload success')
    },
    handleFormatError(){
      console.log('upload format error')
      this.$Message.warning({
        content: '仅支持jpg, jepg, png格式的图片',
        duration: 10,
        closable: true
      });
    },
    handleMaxSize(){
      console.log('upload max size');
      this.$Message.warning({
        content: '图片的最大尺寸不能超过2M',
        duration: 10,
        closable: true
      });
    },
    closeModal(){
      this.avatarCropper=false;
      console.log(this.avatarCropper);
    },
    uploadFile(){
      const csrfToken = cookie.get("csrfToken");
      console.log(`fileinfo${this.fileInfo.name}`);
      this.$refs.cropper.getCropBlob((data) => {
        // console.log(data);
        this.avatarLoading = true
        this.$refs.upload.clearFiles() 
        const formData=new FormData();
        const files = new window.File(
          [data],
          this.fileInfo.name,
          {type: this.fileInfo.type}
        )
        formData.append('files',files);
        this.$axios.post(
          '/api/file/avatar', formData,
          {
            'headers': { "x-csrf-token": csrfToken },
            'withCredentials': true,
            'Content-Type':'multipart/form-data'
          }
        ).then(res=>{
          this.avatarLoading = false
          if(res.status == 200){
              console.log('success')
              this.$Message.success('设置成功');
              this.closeModal();
              this.$router.go(0);
          }
        }).catch(error => {
          if(error.response.status == 500){
            console.log('500 Internal Server Error')
            this.$Spin.hide();
            this.$Message.warning({
                content: '服务器出现了一些错误。',
                duration: 10,
                closable: true
            });
          } else if(error.response.status == 403){
            this.$Spin.hide();
            this.jumpLogin();
          } else {
            this.$Spin.hide();
            this.$Message.warning({
                content: '上传的图片格式不正确',
                duration: 10,
                closable: true
            });
          }
        })
      })
    },
    editNickname(){
      this.editname=true;
    },
    editSignature(){
      this.editsignature = true;
    },
    cancelChangeName(){
      this.editname = false;
    },
    cancelChangeSignature(){
      this.editsignature = false;
    },
    changeUserInfo(){
      const csrfToken = cookie.get("csrfToken");
      const data = {
        nickname: this.nickname,
        signature: this.signature,
      }
      if(this.nickname === ''&&this.signature === ''){
        this.$Message.warning({
          content: '请勿输入空数据',
          duration: 10,
          closable: true
        });
        return;
      }
      this.inputLoading = true;
      this.$axios.put(`/api/user/${this.$route.params.uid}`, data,
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        if(res.status == 204) {
          this.$Message.success({
            content: '修改成功',
            duration: 10,
            closable: true
          });
          this.editname=false;
          this.editsignature=false;
          this.inputLoading = false;
          this.nickname = '';
          this.signature = '';
          this.getUserInfo();
        }
      }).catch(error => {
        this.inputLoading = false;
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Message.error({
            content: '服务器出现了一些问题，请确保输入正确格式的数据',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
          this.$Spin.hide();
          this.jumpLogin();
        } else if(error.response.status == 405){
          this.$Message.error({
            content: '您没有权限进行此操作',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 412){
          this.$Message.error({
            content: '请输入合法的字符串',
            duration: 10,
            closable: true
          });
        } else {
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    openPswModal(){
      console.log('change password');
      this.pswModal = true;
    },
    pswNextStep(){
      console.log(`psw step: ${this.pswStep}`);
      let data = {};
      if(this.pswStep == 0){
        if(this.oldpsw === ''){
          this.$Message.warning({
            content: '请勿输入空字符串',
            duration: 10,
            closable: true
          });
        } else {
          data = {
            oldpsw: this.oldpsw,
          }
          this.submitPassword(data);
        }
      } else if(this.pswStep == 1){
        if(this.oldpsw!=this.newpsw){
          this.pswStep++;
        }else{
          this.$Message.warning({
            content: '新密码不能和旧密码一样',
            duration: 10,
            closable: true
          });
        }
      } else if(this.pswStep == 2){
        if(this.newpsw != this.newpswConfirm){
          this.$Message.warning({
            content: '两次输入的密码不一致',
            duration: 10,
            closable: true
          });
        } else {
          data = {
            oldpsw: this.oldpsw,
            newpsw: this.newpswConfirm
          };
          this.submitPassword(data);
        }
      }
    },
    submitPassword(data){
      this.pswLoading = true;
      const csrfToken = cookie.get("csrfToken");
      this.$axios.put(`/api/user/${this.$route.params.uid}/password`, data,
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        this.pswLoading = false;
        if(res.status == 204) {
          if(this.pswStep == 0){
            this.$Message.success({
              content: '密码正确',
              duration: 10,
              closable: true
            });
            this.pswStep++;
          } else if(this.pswStep == 2){
            this.$Message.success({
              content: '修改成功',
              duration: 10,
              closable: true
            });
            this.pswStep = 0;
            this.closePswModal()
          }
        }
      }).catch(error => {
        this.pswLoading = false;
        if(error.response.status == 403){
          this.jumpLogin();
        } else if(error.response.status == 405){
          this.$Message.error({
            content: '您没有权限进行此操作',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 412){
          this.$Message.error({
            content: '输入的密码不正确',
            duration: 10,
            closable: true
          });
        } else {
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
        return true;
      });
    },
  },
  watch:{
    '$route'(to, from) {
      console.log('change')
      if(to.params.uid != from.params.uid){
        this.getUserInfo();
      }
    }
  }
};
</script>

<style lang='less' scoped>
@box-bg: #d8d8d8;
@box-shadow-big: 0px 10px 15px 12px rgba(208, 208, 208, 0.5);
@box-shadow-small: 0px 0px 15px 5px rgba(208, 208, 208, 0.2);
@border-radius: 18px;

// 右边
.wrapper-avatar {
  width: 100%;
}
.wrapper-avatar img {
  width: 100%;
  border-radius: 200px;
}
.wrapper-count {
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  margin: 1em 0 1em 0;
}
.count {
  margin: 0 10px 0 0;
}
.description {
  display: block;
  margin-top: 1.5rem;
  margin-left: 1rem;
  color: #9e9e9e;
  font-size: 1rem;
}
.info-row{
  font-size: 1.3em;
}
.img {
  width: 174px;
  height: 174px;
  border-radius: 50%;
  background: #999;
  margin-right: 1rem;
}
.grade {
  padding: 0 0.5rem;
  height: 20px;
  background: #ffc300;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  margin-right: 1rem;
}
// 更改头像
.changeImg {
  width: 8rem;
  height: 2.4rem;
  background: rgba(157, 209, 169, 1);
  font-size: 1.2rem;
  color: #fff;
  text-align: center;
  line-height: 2.4rem;
  border-radius: @border-radius;
  font-weight: bold;
  margin-bottom: 10px;
}
// 粉丝-创作-关注
.atte-box {
  display: flex;
  line-height: 2;
  p {
    border-right: 1px solid #999;
    padding-right: 1rem;
  }
  span {
    font-weight: bold;
    margin: 0 1rem;
  }
}
// 个人介绍
.bottom-top {
  p {
    line-height: 3;
    border-bottom: 1px solid #ddd;
    font-size: 1.2rem;
    display: flex;
  }
  span {
    width: 15rem;
  }
}
.center {
  display: block;
  position: relative;
  width: 200px;
  height: 200px;
  background-size: 100%;
  background-position: top left;
  border-radius: 100%;
  margin: 0 auto;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.562);
}
.avatar{
  border-radius: 100%;
  width: 100%
}
#avatar-cropper{
  width: 100%;
  height: 100%;
}
</style>