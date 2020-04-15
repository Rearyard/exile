<template>
  <div>
      <Row class="info-card avater-wrapper">
        <i-col span="8">
          <Badge text="Lv.1">
              <div class="center">
                <img :src="user.user_avatar_url" class="avatar" />
                <Upload
                  v-if="user.isMyself"
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
                  <div v-if="user.isMyself" class="outside">
                    <Icon type="ios-camera" />
                  </div>
                </Upload>
              </div>
            
            <Modal
              title="设置头像"
              v-model="avatarCropper"
              :mask-closable="false"
              :loading="loading"
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
                <Button type ="info" @click="uploadFile">确认</Button>
                <Button class = "button-cancel" @click="closeModal">取消</Button>
              </div>
            </Modal>
            <!-- <span v-else>
              <img src="https://chinocdn.cafuchino.cn/pic/202003091129722.png" class="avatar" />
            </span> -->
          </Badge>
        </i-col>
        <i-col span="14" offset="2">
          <Row>          
            <div class="username">
              <strong>{{user.user_nickname}}</strong>
            </div>
            <div style = "font-size: 0.7rem;" v-if="user.isMyself">
              UID：{{user.id}}
            </div>
          </Row>
          <div>
            {{user.myFollowing}} 关注
            <Divider type="vertical" />
            {{user.myFollowed}} 粉丝
          </div>
          <div style="margin-top:1rem; font-size:0.7rem">
            来到后花园已经{{user.user_registered}}天
          </div>
        </i-col>
      </Row>
      <Row class = "info-card">
        <Row style = "padding-left:0.5rem;">
          <i-col span="5">
            <div v-if = "user.isMyself"><strong>用户名： </strong></div>
            <strong>昵称：</strong>
          </i-col>
          <i-col span="13">
            <div v-if = "user.isMyself">
            {{user.user_login}}
            </div>
            {{user.user_nickname}} &nbsp;&nbsp;
            <Icon v-if="user.isMyself" type="ios-create-outline" size="20"/>
          </i-col>
          <i-col span="6">
            <span v-if="user.isMyself">
              <strong>>> 改密码</strong>
            </span>
          </i-col>
        </Row>
        <Row style = "padding-left:0.5rem;">
          <i-col span="5">
            <strong>简介： </strong>
          </i-col>
          <i-col span="19">
            {{user.user_signature}}&nbsp;&nbsp;
            <Icon v-if="user.isMyself" type="ios-create-outline" size="20"/>
          </i-col>
        </Row>
        <Row v-if="user.isMyself" style = "padding-left:0.5rem;">
          <i-col span="5">
            <strong>邮箱： </strong>
          </i-col>
          <i-col span="19">
            {{user.user_email}}
          </i-col>
        </Row>
      </Row>
      <Row v-if="user.isMyself" style = "padding: 0px 2px; margin-top: 5px;">
        <Button type="error" @click="postLogout" style="border-radius:10px" long>注销</Button>
      </Row>
    </div>
</template>

<script>
import cookie from 'js-cookie'
import { VueCropper }  from 'vue-cropper'
export default {
  data(){
    return{
      user:{},
      csrfToken: cookie.get("csrfToken"),
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
      previews: {},
      fileInfo: '',
      // 防止提交多次
      loading: false
    }
  },
  components: { 
    VueCropper 
  }, 
  mounted(){
    console.log(this.csrfToken)
    this.getUserInfo();
  },
  methods:{
    postLogout() {
      const csrfToken = cookie.get("csrfToken");
      this.$axios
        .post(
          "/api/auth/logout",
          {},
          {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true
          }
        )
        .then(res => {
          this.$router.push('/login')
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
        this.loading = true
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
          this.loading = false
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
            this.count = 0;
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
            this.count = 0;
            this.$Message.warning({
                content: '网络出现了一些问题，请刷新重试',
                duration: 10,
                closable: true
            });
          }
        })
      })
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
        console.log(res);
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
          this.count = 0;
          this.$Message.warning({
            content: '您访问的用户不存在',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
          this.$Spin.hide();
          this.jumpLogin();
        } else {
          this.$Spin.hide();
          this.count = 0;
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    }
  },
  watch:{
    '$route'(to, from) {
      console.log('change')
      if(to.params.uid != from.params.uid){
        this.getUserInfo();
      }
    }
  }
}
</script>

<style lang="less" scoped>
.center {
  display: block;
  position: relative;
  width: 5rem;
  height: 5rem;
  cursor: pointer;
  background-size: 100%;
  background-position: top left;
  border-radius: 100%;
  margin: 0 auto;
  -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.562);
}
.center:hover {
  box-shadow: 0px 5px 20px #000;
}
.center:hover .outside {
    -webkit-transform: rotate(-45deg) translate(0px) rotate(-315deg);
    -ms-transform: rotate(-45deg) translate(0px) rotate(-315deg);
    transform: rotate(-45deg) translate(0px) rotate(-315deg);
    background: rgba(22, 160, 133, 0.35);
    width: 5rem;
    letter-spacing: 0px;
    line-height: 5rem;
    height: 5rem;
    margin-top: -2.5rem;
    margin-left: -2.5rem;
    -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1), letter-spacing 1.5s ease-out;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1), letter-spacing 1.5s ease-out;
}
.center .outside {
    display: block;
    position: absolute;
    line-height: 2rem;
    text-align: center;
    letter-spacing: 4px;
    font-weight: 300;
    color: white;
    font-family: Oswald;
    border-radius: 100%;
    width: 2rem;
    height: 2rem;
    background: #16a084;
    left: 50%;
    top: 50%;
    margin-top: 0.5rem;
    margin-left: -5rem;
    -webkit-transform: rotate(-180deg) translate(-100px) rotate(180deg);
    -ms-transform: rotate(-180deg) translate(-100px) rotate(180deg);
    transform: rotate(-180deg) translate(-100px) rotate(180deg);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
    -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.center .outside i {
    letter-spacing: 0;
}
.info-card{
  width: 100%;
  border-radius: 18px;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(208, 208, 208, 0.3) inset,
  10px 0px 15px 5px rgba(208, 208, 208, 0.5);
  padding:1rem;
  margin-bottom: 0.3rem;
}
.avater-wrapper img{
  width:100%;
  border-radius: 200px;
}
.edit-button{
  border-radius: 18px;
}
.button-cancel:hover{
  border-color:rgba(186, 221, 210, 0.856);
  color: rgb(151, 192, 179);
}
#avatar-cropper{
  width: 100%;
  height: 100%;
}

</style>

