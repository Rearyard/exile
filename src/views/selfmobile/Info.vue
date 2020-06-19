<template>
  <div>
      <Row class="info-card avater-wrapper">
        <i-col span="8">
          <Badge text="Lv.1">
              <div class="center">
                <img :src="user.user_avatar_url" class="avatar" />
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
                  <div v-show="user.isMyself" class="outside">
                    <Icon type="ios-camera" />
                  </div>
                </Upload>
              </div>
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
                <Button type ="info" :loading="loading" @click="uploadFile">确认</Button>
                <Button class = "button-cancel" @click="closeModal">取消</Button>
              </div>
            </Modal>
          </Badge>
        </i-col>
        <i-col span="14" offset="2">
          <Row>          
            <div class="username">
              <strong>{{user.user_nickname}}</strong>
              <Button v-show="!user.isMyself && user.isFollowed" shape="circle" type="info" size="small" @click="followUser('unfollow', user.id)">
                - 取关
              </Button>
              <Button v-show="!user.isMyself && !user.isFollowed" shape="circle" type="info" size="small" @click="followUser('follow', user.id)">
                + 关注
              </Button>
            </div>
            <div style = "font-size: 0.7rem;" v-show="user.isMyself">
              UID：{{user.id}}
            </div>
          </Row>
          <div>
            <strong @click="openFollowingModal">{{user.myFollowing}}</strong> 关注
            <Divider type="vertical" />
            <strong @click="openFollowedModal">{{user.myFollowed}}</strong> 粉丝
            <Modal
              :closable=false
              v-model="followingModal"
              :mask-closable="false"
              fullscreen
            >
              <div slot="header" class="following-header">
                <Icon type="ios-arrow-back" size="20" @click="closeFollowingModal"/>
                <p>我的关注（{{following.count}}）</p>
              </div>
              <div v-if="following.count!=0" class="following-wrapper">
                  <div
                    v-for="item in following.author"
                    :key="item.id"
                    class="following-card"
                  >
                    <img v-show="item.user_avatar_url" :src = "item.user_avatar_url"/>
                    <img v-show="item.user_avatar_url===null" src="https://chinocdn.cafuchino.cn/pic/202003091129722.png"/>
                    <span style="line-height: 4rem;" @click="jumpUser(item.id)">{{item.user_nickname}}</span>
                    <Button type = "info" @click="followUser('unfollow', item.id)" v-if="user.isMyself">取关</Button>
                    <Button type = "info" @click="jumpUser(item.id)" v-else>查看</Button>
                  </div>
              </div>
              <div v-else>
                <p>还没有关注用户哦！</p>
              </div>
              <div slot="footer">
                <Page
                  v-show = "following.count>10"
                  :current.sync=followingPage
                  :total=following.count
                  @on-change="changeFollowingPage"
                  simple
                />
              </div>
            </Modal>
            <Modal
              :closable=false
              v-model="followedModal"
              :mask-closable="false"
              fullscreen
            >
              <div slot="header" class="following-header">
                <Icon type="ios-arrow-back" size="20" @click="closeFollowedModal"/>
                <p>我的粉丝（{{followed.count}}）</p>
              </div>
              <div v-if="followed.count!=0" class="following-wrapper">
                <div
                  v-for="user in followed.author"
                  :key="user.id"
                  class="following-card"
                >
                  <img v-show="user.user_avatar_url" :src = "user.user_avatar_url"/>
                  <img v-show="user.user_avatar_url===null" src="https://chinocdn.cafuchino.cn/pic/202003091129722.png"/>
                  <span style="line-height: 4rem;" @click="jumpUser(user.id)">{{user.user_nickname}}</span>
                  <Button type = "info" @click="jumpUser(user.id)">查看</Button>
                </div>
              </div>
              <div v-else>
                <p>还没有粉丝哦！</p>
              </div>
              <div slot="footer">
                <Page
                  v-show = "followed.count>10"
                  :current.sync=followedPage
                  :total=followed.count
                  @on-change="changeFollowedPage"
                  simple
                />
              </div>
            </Modal>
            
          </div>
          <div style="margin-top:1rem; font-size:0.7rem">
            来到后花园已经{{registerTimeFormated}}
          </div>
        </i-col>
      </Row>
      <Row class = "info-card">
        <Row style = "padding-left:0.5rem;">
          <i-col span="5">
            <div v-show="user.isMyself"><strong>用户名： </strong></div>
            <strong>昵称：</strong>
          </i-col>
          <i-col span="13">
            <div v-show="user.isMyself">
            {{user.user_login}}
            </div>
            <span v-if="!editname">
              {{user.user_nickname}}&nbsp;&nbsp;
              <Icon
                @click="editNickname"
                v-show="user.isMyself"
                type="ios-create-outline"
                size="20"         
              />
            </span>
            <span v-else>
              <iInput
                @on-blur="cancelChangeName"
                @on-enter="changeUserInfo"
                :disabled="inputLoading"
                v-model = "nickname"
                placeholder="请输入新的昵称"
                size = "small"
                class = "editname"
              >
                <Button
                  @click="changeUserInfo"
                  slot="append"
                  icon="ios-arrow-dropleft"
                ></Button>
              </iInput>
            </span>
          </i-col>
          <i-col span="6">
            <span v-show="user.isMyself" @click="openPswModal">
              <strong>>> 改密码</strong>
            </span>
            <Modal
              title="修改密码"
              v-model="pswModal"
              :mask-closable="false"
              fullscreen
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
              <Button
                @click="pswNextStep"
                style = "float:right; margin-top:1rem"
                type ="info"
                :loading = pswLoading
              >
                <span v-if="pswStep<2">继续</span>
                <span v-else>确认</span>
              </Button>
              <div slot = "footer">
                <Button class = "button-cancel" @click="closePswModal">关闭</Button>
              </div>
            </Modal>
          </i-col>
        </Row>
        <Row style = "padding-left:0.5rem;">
          <i-col span="5">
            <strong>简介： </strong>
          </i-col>
          <i-col span="19">
            <span v-if="!editsignature">
              {{user.user_signature}}&nbsp;&nbsp;
              <Icon
                @click="editSignature"
                v-show="user.isMyself"
                type="ios-create-outline"
                size="20"
              />
            </span>
            <span v-else>
              <iInput
                v-model = "signature"
                @on-blur="cancelChangeSignature"
                @on-enter="changeUserInfo"
                :disabled="inputLoading"
                placeholder="请输入新的简介"
                icon="ios-arrow-dropleft"
                size = "small"
                class = "editname"
              >
                <Button
                  @click="changeUserInfo"
                  slot="append"
                  icon="ios-arrow-dropleft"
                ></Button>
              </iInput>
            </span>
          </i-col>
        </Row>
        <Row v-show="user.isMyself" style = "padding-left:0.5rem;">
          <i-col span="5">
            <strong>邮箱： </strong>
          </i-col>
          <i-col span="19">
            {{user.user_email}}
          </i-col>
        </Row>
      </Row>
      <Row class="info-card" v-show="user.isMyself">
        <Row style="padding-left:0.5rem;">
            <Modal
              v-if="!currentProvementResult"
              v-model="provementModal"
              title="自证结果"
              :mask-closable="false"
              :loading="provementLoading"
              fullscreen>
              <p><strong>审查回复：</strong>{{provementResponse}}</p>
              <Divider />
              <p style="margin-bottom: 10px;">请修改您的自证内容并重新提交，以便我们再次审核。</p>
              <Input v-model="provementText" placeholder="建议您在本地编辑完成后再粘贴提交。" type="textarea" :rows="6" class="provement-input" />
              <div slot="footer">
                <Button class = "button-cancel" @click="closeProvementModal">取消</Button>
                <Button type="success" @click="addProvement" :loading="provementLoading">提交</Button>
                </div>
            </Modal>
            <i-col span="7">
              <strong>自证结果：</strong>
            </i-col>
            <i-col span="17">
            <span>
              {{displayedProvementResult}}
              <Icon v-if="!currentProvementResult" @click="openProvementModal" size="20" type="ios-create-outline" style="vertical-align: top;"/>
            </span>
            </i-col>
          </Row>
      </Row>
      <Row v-show="user.isMyself" style = "padding: 0px 2px; margin-top: 5px;">
        <Button type="error" @click="postLogout" style="border-radius:10px" long>登出</Button>
      </Row>
    </div>
</template>

<script>
import moment from 'moment'
import cookie from 'js-cookie'
import { VueCropper }  from 'vue-cropper'
export default {
  data(){
    return{
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
      previews: {},
      fileInfo: '',
      // 防止提交多次
      loading: false,
      editname: false,
      editsignature: false,
      nickname: '',
      signature: '',
      inputLoading: false,
      pswModal: false,
      pswStep:0,
      oldpsw: '',
      newpsw: '',
      newpswConfirm:'',
      pswLoading: false,
      followingModal: false,
      following: {},
      followingPage: 1,
      followingLoading: '加载中',
      followedModal: false,
      followed: {},
      followedPage: 1,
      userFollowed: 0,
      currentProvementResult: false,
      provementResponse: '你好，经过审核我们认为之前提交的内容不足以证明您属于您所选择的年龄范围，主要原因为：blablablabla~',
      provementText: 'Some self-proof text submitted before.',
      provementModal: false,
      provementLoading: false,
    }
  },
  components: { 
    VueCropper 
  }, 
  computed: {
    registerTimeFormated(){
      moment.locale('zh-cn');
      return moment(this.user.user_registered).toNow(true)
    },
    displayedProvementResult() {
        return this.currentProvementResult? '已通过':'未通过';
      }
  },
  mounted(){
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
    closePswModal(){
      this.pswModal = false;
    },
    openProvementModal() {
      this.provementModal = true;
    },
    closeProvementModal() {
      this.provementLoading = false;
      this.provementModal = false;
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
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.user = res.data;
            this.judgeProvement();
          }
        }
      }).catch(error => {
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Spin.hide();
          this.$Message.warning({
            content: '访问的用户不存在',
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
    jumpLogin(){
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    jumpUser(id){
      const isMobile=this.$store.state.isMobile;
      if(isMobile){
        this.$router.push(`/selfmobile/${id}/info`)
      }else{
        this.$router.push(`/self/${id}/info`)
      }
    },
    getMyFollowing(offset, amount) {
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
      this.$axios.get(`/api/user/${this.$route.params.uid}/following`,{
        params: {
          offset: offset,
          amount: amount
        }    
      }).then(res => {
        this.$Spin.hide();
        console.log(res);
        if(!res){
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200) {
            this.following=res.data;
          }
        }
      }).catch(error => {
        this.$Spin.hide();
        if(error.response.status == 500){
          console.log('500 Internal Server Error')
          this.$Message.warning({
            content: '网络出现了一些问题，请刷新重试',
            duration: 10,
            closable: true
          });
        } else if(error.response.status == 403){
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
    getMyFollowed(offset, amount) {
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
      this.$axios.get(`/api/user/${this.$route.params.uid}/followed`, {
        params: {
          offset: offset,
          amount: amount
        }    
      }).then(res => {
        console.log(res);
        if(!res){
          this.$Spin.hide();
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        } else {
          if(res.status == 200){
            this.followed = res.data;
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
          this.$Spin.hide();
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
        }
      });
    },
    judgeProvement() {
      this.$axios.get('/api/auth/provement/judge').then(res=> {
        if (res.status == 200) {
          this.currentProvementResult = res.data;
        }
        if (!this.currentProvementResult) {
          this.getLastProvement();
        } else {
          this.$Spin.hide();
        }
      }).catch(error => {
        console.log('Error status code: ' + error.response.status);
        if (error.response.status === 401) {
          this.$Spin.hide();
          this.jumpLogin();
        } else {
          this.$Message.warning({
              content: '网络出现了一些问题，请刷新重试',
              duration: 10,
              closable: true
          });
          this.$Spin.hide();
        }
      });
    },
    getLastProvement() {
      this.$axios.get('/api/auth/provement').then(res=> {
        if (res.status == 200){
          const allProvements = res.data.provement;
          if (allProvements.length > 0) {
            const lastProvement = allProvements[allProvements.length-1];
            this.provementText = lastProvement.content;
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
      this.provementLoading = true;
      const csrfToken = cookie.get("csrfToken");
      this.$axios.put('/api/auth/provement/edit', {content:this.provementText},
        {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        }
      ).then(res => {
        // TODO: check res.status
        if (res.status === 200 && res.data.result) {
          this.provementSubmitted = res.data.result;
          this.$Message.success("您的自证材料已成功提交，请耐心等待我们的管理人员审核。");
        } else {
          this.$Message.warning('您的自证材料未提交成功，请刷新后重试。');
        }
        this.closeProvementModal();
      }).catch(error=> {
        console.log('Error status code: ' + error.response.status);
        if (error.response.status === 401) {
          this.jumpLogin();
        } else if (error.response.status === 400){
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
        this.closeProvementModal();
      });
    },
    openFollowingModal(){
      this.followingModal = true;
      this.followingPage = 1;
      this.getMyFollowing(0,10);
    },
    closeFollowingModal(){
      this.followingModal = false;
      this.followingPage=1;
    },
    changeFollowingPage(){
      this.getMyFollowing(10*(this.followingPage-1), 10);
    },
    changeFollowedPage(){
      this.getMyFollowed(10*(this.followedPage-1), 10);
    },
    openFollowedModal(){
      this.followedModal = true;
      this.followedPage = 1;
      this.getMyFollowed(0,10);
    },
    closeFollowedModal(){
      this.followedModal = false;
    },
    handleReachBottom(){
      if(this.followingList.length < this.user.myFollowing) {
        return new Promise(() => {
          console.log(this.followingList.length);
          console.log(this.user.myFollowing);
          this.getMyFollowing(10*this.followingPage, 10);
          this.followingPage = this.followingPage + 1;
        })
      } else {
        console.log('已到达底部');
        this.followingLoading = "没有更多关注啦"
      }
    },
    followUser(operation, id){
      const csrfToken = cookie.get("csrfToken");
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
      const data = {};
      if(operation === 'follow') {data.followedId = id}
      else if(operation === 'unfollow') {data.unfollowedId = id}
      else return;
      console.log(operation);
      this.$axios.post(
        `/api/user/${this.$store.state.user.id}/follow/user`, data,
        {
          'headers': { "x-csrf-token": csrfToken },
          'withCredentials': true,
        }
      ).then(res=>{
        this.$Spin.hide();
        if(res.status == 204){
          console.log('success')
          if(operation === 'follow'){this.$Message.success('关注成功')}
          if(operation === 'unfollow'){this.$Message.success('取关成功')}
          if(this.followingModal){
            this.getMyFollowing(0,10);
            this.followingPage = 1;
          } else {
            this.getUserInfo();
          }
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
        } else if(error.response.status == 401){
          this.$Spin.hide();
          this.jumpLogin();
        } else if(error.response.status == 400){
          this.$Spin.hide();
          this.$Message.warning({
            content: `${error.response.data}`,
            duration: 10,
            closable: true
          });
        }else {
          this.$Spin.hide();
          this.$Message.warning({
              content: '服务器出错啦，请重试',
              duration: 10,
              closable: true
          });
        }
      });
    }
  },
  watch:{
    '$route'(to, from) {
      console.log('change')
      if(to.params.uid != from.params.uid){
        this.closeFollowingModal()
        this.closeFollowedModal()
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
.username{
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  -webkit-flex-direction: row; /* Safari 6.1+ */
  justify-content: space-between;
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
.editname{
  width: auto;
}
.info-row{
  font-size: 1rem;
}
.following-header{
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: row;
  -webkit-flex-direction: row; /* Safari 6.1+ */
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  align-items:center;
}
.following-wrapper{
  display: flex;
  display: -webkit-flex; /* Safari */
  -webkit-flex-direction: row; /* Safari 6.1+ */
  flex-direction: row;
  flex-wrap: wrap;
}
.following-card{
  width: 100%;
  height: 4rem;
  border-radius: 10px;
  background: rgba(180, 180, 180, 0.212);
  padding: 0px 1rem 0px 1rem;
  margin-bottom: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
}
.provement-input {
  width:100%;
}
</style>

