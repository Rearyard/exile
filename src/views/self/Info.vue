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
        <Row>
          <iCol span="16">
            <h1>{{user.user_nickname}}</h1>
          </iCol>
          <iCol span="4">
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
              <Button v-show="user.isMyself" type="success" size="large" shape="circle">更改头像</Button>
            </Upload>
            <Button
              v-show="!user.isMyself && user.isFollowed"
              type="success"
              size="large"
              shape="circle"
              @click="followUser('unfollow', user.id)"
            >取消关注</Button>
            <Button
              v-show="!user.isMyself && !user.isFollowed"
              type="success"
              size="large"
              shape="circle"
              @click="followUser('follow', user.id)"
            >添加关注</Button>
          </iCol>
        </Row>
        <Modal title="设置头像" v-model="avatarCropper" :mask-closable="false" fullscreen>
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
          <div slot="footer">
            <Button type="info" :loading="avatarLoading" @click="uploadFile">确认</Button>
            <Button class="button-cancel" @click="closeModal">取消</Button>
          </div>
        </Modal>
        <Row v-show="!user.isMyself" style="height: 2rem;"></Row>
        <Row type="flex" justify="space-around" align="middle" class="wrapper-count">
          <iCol span="6" class="count-item">
            <span class="count">{{user.myFollowed}}</span>粉丝
          </iCol>
          <Divider type="vertical" />
          <iCol span="6" class="count-item">
            <span class="count">{{user.myFollowing}}</span>关注
          </iCol>
        </Row>
        <Row class="description">
          <i-col span="6">简介：</i-col>
          <i-col span="18">
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
                v-model="signature"
                @on-enter="changeUserInfo"
                :disabled="inputLoading"
                placeholder="请输入新的简介"
                :autosize="{minRows: 2,maxRows: 4}"
                style="width: 80%;"
                icon="md-close"
                @on-click="cancelChangeSignature"
              ></iInput>
              <Button type="info" @click="changeUserInfo" icon="md-checkmark" />
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
        <Modal title="修改密码" v-model="pswModal" :mask-closable="false">
          <Steps :current="pswStep" style="margin-bottom:2rem;">
            <Step title="输入密码" content></Step>
            <Step title="确认密码" content></Step>
            <Step title="新密码" content></Step>
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
          <Row class="info-row" v-if="pswStep == 1">
            <p>请输入新密码：</p>
            <Input
              style="margin-top:1rem"
              type="password"
              password
              v-model="newpsw"
              placeholder="无需修改则留空"
            />
          </Row>
          <Row class="info-row" v-if="pswStep == 2">
            <p>请再重复一遍新密码：</p>
            <Input
              style="margin-top:1rem"
              type="password"
              password
              v-model="newpswConfirm"
              placeholder="无需修改则留空"
            />
          </Row>
          <div slot="footer">
            <Button @click="pswNextStep" type="info" :loading="pswLoading">
              <span v-if="pswStep<2">继续</span>
              <span v-else>确认</span>
            </Button>
            <Button class="button-cancel" @click="closePswModal">关闭</Button>
          </div>
        </Modal>
      </iCol>
    </Row>
    <Row class="info-row">
      <iCol span="10">昵称</iCol>
      <iCol span="14">
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
            v-model="nickname"
            placeholder="请输入新的昵称"
            class="editname"
            style="width: 80%;"
            icon="md-close"
            @on-click="cancelChangeName"
          ></iInput>
          <Button type="info" @click="changeUserInfo" icon="md-checkmark" />
        </span>
      </iCol>
    </Row>
    <Divider />
    <div v-show="user.isMyself">
      <Row class="info-row">
        <iCol span="10">生日</iCol>
        <iCol span="14">
          <span>
            {{birthdayFormated}}
            <Icon
              @click="provementModal=true"
              v-show="user.isMyself"
              type="ios-create-outline"
              style="cursor: pointer;"
              size="24"
            />
            <a style="font-size:0.8rem; padding-left:1rem" href="/question#what_can_i_see" target="_blank"> &nbsp;&nbsp;>>允许查看的文章分级</a>
          </span>
        </iCol>
      </Row>
      <Modal
        @on-cancel="closeProvementModal"
        v-model="provementModal"
        :mask-closable="false"
        title="修改生日"
        :loading="provementLoading">
        <div v-if="allProvements.length>1">
          <p> 抱歉，您只拥有一次重新提交自证的机会。（如果需要修改生日，也需重新提交自证）。</p>
        </div>
        <div v-else>
          <p>您的年龄是: 
            <DatePicker type="date" placeholder="Select date" size="small" style="width:10rem;" :start-date="new Date(2000, 1, 1)" @on-change="changeBirthday"></DatePicker>
            {{userAgeUpdated?userAgeUpdated+'岁':'请选择'}}
          </p>
          <p>需要提交的相应自证材料是：{{permissionRules[authority].provement_item?permissionRules[authority].provement_item:'无'}}</p>
          <Divider style="margin-top: 1rem; margin-bottom: 1rem;" />
          <p style="margin-bottom: 10px"><strong>为了修改生日，您需要重新提交自证。</strong></p>
          <p style="margin-bottom: 10px">PS：每位用户仅有一次重新提交自证的机会（如果您要修改生日，也会消耗掉这次机会。）</p>
          <Input v-model="provementText" placeholder="建议您在本地编辑完成后再粘贴提交。" type="textarea" :rows="6" class="provement-input" />
          </div>
          <div slot="footer">
            <div v-show="allProvements.length<2">
              <Button class = "button-cancel" @click="closeProvementModal">取消</Button>
              <Button type="success" @click="addProvement" :loading="provementLoading">提交</Button>
            </div>
          </div>
      </Modal>
      <Divider />
    </div>
    <div v-show="user.isMyself">
      <Row class="info-row">
        <iCol span="10">用户名</iCol>
        <iCol span="14">{{user.user_login}}</iCol>
      </Row>
      <Divider />
    </div>
    <div v-show="user.isMyself">
      <Row class="info-row" v-show="user.isMyself">
        <iCol span="10">邮箱</iCol>
        <iCol span="14">{{user.user_email}}</iCol>
      </Row>
      <Divider />
    </div>
    <Row class="info-row">
      <iCol span="10">注册日期</iCol>
      <iCol span="14">{{formatedData}}</iCol>
    </Row>
    <Divider />
  </div>
</template>

<script>
import cookie from "js-cookie";
import { VueCropper } from "vue-cropper";
import moment from "moment";

export default {
  data() {
    return {
      user: {},
      avatarCropper: false,
      cropperOption: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
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
      nickname: "",
      signature: "",
      pswModal: false,
      pswStep: 0,
      oldpsw: "",
      newpsw: "",
      newpswConfirm: "",
      pswLoading: false,
      provementModal: false,
      birthdayUpdated: new Date(),
      userAgeUpdated: 0,
      provementText: "",
      provementLoading: false,
      permissionRules: [],
      allProvements: [],
    };
  },
  components: {
    VueCropper
  },
  computed: {
    formatedData() {
      return moment(this.user.user_registered).format("LL");
    },
    birthdayFormated(){
      moment.locale('zh-cn');
      return moment(this.user.user_birth).format('LL');   // 2020年6月22日
    },
    authority() {
      for (const key in this.permissionRules) {
          const element = this.permissionRules[key];
          if (element.min_age<=this.userAgeUpdated&&this.userAgeUpdated<=element.max_age) {
            return Number(key);
        }
      }
      return 0;
    },
  },
  mounted() {
    this.getUserInfo();
    this.getProvementQuestion();
    this.getAllProvement();
  },
  methods: {
    jumpLogin() {
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    changeBirthday(birthday, format){
      this.birthdayUpdated = birthday;
      this.userAgeUpdated = parseInt(moment(birthday).fromNow());
    },
    closeProvementModal() {
      this.provementLoading = false;
      this.provementModal = false;
      this.userAgeUpdated = parseInt(moment(this.user.user_birth).fromNow());
    },
    getProvementQuestion(){
      this.$axios.get('/api/auth/register/info').then((res)=>{
        this.permissionRules = res.data.permissionRules;
      })
    },
    getAllProvement() {
      this.$Spin.show()
      this.$axios.get('/api/auth/provement').then(res=> {
        if (res.status == 200){
          this.allProvements = res.data.provement;
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
        // console.log('edit birthday');
        // console.log(typeof(this.birthdayUpdated))
        // const birthday = new Date(this.birthdayUpdated)
      if(!this.userAgeUpdated){
        this.$Message.warning('请选择生日。');
        return
      }
      if(!this.provementText){
        this.$Message.warning('请填写自证');
        return
      }
      this.provementLoading = true;
      this.$axios.put('/api/user/edit/birthday', 
        {
          birthday: this.birthdayUpdated,
          content: this.provementText
        },
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
        this.getUserInfo();
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
      })
    },    
    getUserInfo() {
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
      this.$axios
        .get(`/api/user/${this.$route.params.uid}`)
        .then(res => {
          // console.log(res);
          if (!res) {
            this.$Spin.hide();
            this.$Message.warning({
              content: "网络出现了一些问题，请刷新重试",
              duration: 10,
              closable: true
            });
          } else {
            if (res.status == 200) {
              this.user = res.data;
              this.$Spin.hide();
            }
          }
        })
        .catch(error => {
          if (error.response.status == 500) {
            console.log("500 Internal Server Error");
            this.$Spin.hide();
            this.$Message.warning({
              content: "网络出现了一些问题，请刷新重试",
              duration: 10,
              closable: true
            });
          } else if (error.response.status == 403) {
            this.$Spin.hide();
            this.jumpLogin();
          } else {
            this.$Spin.hide();
            this.$Message.warning({
              content: "网络出现了一些问题，请刷新重试",
              duration: 10,
              closable: true
            });
          }
        });
    },
    handeleBeforeUpload(file) {
      if (this.user.isMyself) {
        this.fileInfo = file;
        const data = window.URL.createObjectURL(new Blob([file]));
        this.cropperOption.img = data;
        this.avatarCropper = true;
        return false; //取消自动上传
      }
    },
    handleSuccess() {
      console.log("upload success");
    },
    handleFormatError() {
      console.log("upload format error");
      this.$Message.warning({
        content: "仅支持jpg, jepg, png格式的图片",
        duration: 10,
        closable: true
      });
    },
    handleMaxSize() {
      console.log("upload max size");
      this.$Message.warning({
        content: "图片的最大尺寸不能超过2M",
        duration: 10,
        closable: true
      });
    },
    closeModal() {
      this.avatarCropper = false;
      console.log(this.avatarCropper);
    },
    uploadFile() {
      const csrfToken = cookie.get("csrfToken");
      console.log(`fileinfo${this.fileInfo.name}`);
      this.$refs.cropper.getCropBlob(data => {
        // console.log(data);
        this.avatarLoading = true;
        this.$refs.upload.clearFiles();
        const formData = new FormData();
        const files = new window.File([data], this.fileInfo.name, {
          type: this.fileInfo.type
        });
        formData.append("files", files);
        this.$axios
          .post("/api/file/avatar", formData, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
            "Content-Type": "multipart/form-data"
          })
          .then(res => {
            this.avatarLoading = false;
            if (res.status == 200) {
              console.log("success");
              this.$Message.success("设置成功");
              this.closeModal();
              this.$router.go(0);
            }
          })
          .catch(error => {
            if (error.response.status == 500) {
              console.log("500 Internal Server Error");
              this.$Spin.hide();
              this.$Message.warning({
                content: "服务器出现了一些错误。",
                duration: 10,
                closable: true
              });
            } else if (error.response.status == 403) {
              this.$Spin.hide();
              this.jumpLogin();
            } else {
              this.$Spin.hide();
              this.$Message.warning({
                content: "上传的图片格式不正确",
                duration: 10,
                closable: true
              });
            }
          });
      });
    },
    editNickname() {
      this.editname = true;
    },
    editSignature() {
      this.editsignature = true;
    },
    cancelChangeName() {
      this.editname = false;
    },
    cancelChangeSignature() {
      this.editsignature = false;
    },
    changeUserInfo() {
      const csrfToken = cookie.get("csrfToken");
      const data = {
        nickname: this.nickname,
        signature: this.signature
      };
      if (this.nickname === "" && this.signature === "") {
        this.$Message.warning({
          content: "请勿输入空数据",
          duration: 10,
          closable: true
        });
        return;
      }
      this.inputLoading = true;
      this.$axios
        .put(`/api/user/${this.$route.params.uid}`, data, {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        })
        .then(res => {
          if (res.status == 204) {
            this.$Message.success({
              content: "修改成功",
              duration: 10,
              closable: true
            });
            this.editname = false;
            this.editsignature = false;
            this.inputLoading = false;
            this.nickname = "";
            this.signature = "";
            this.getUserInfo();
          }
        })
        .catch(error => {
          this.inputLoading = false;
          if (error.response.status == 500) {
            console.log("500 Internal Server Error");
            this.$Message.error({
              content: "服务器出现了一些问题，请确保输入正确格式的数据",
              duration: 10,
              closable: true
            });
          } else if (error.response.status == 403) {
            this.$Spin.hide();
            this.jumpLogin();
          } else if (error.response.status == 405) {
            this.$Message.error({
              content: "您没有权限进行此操作",
              duration: 10,
              closable: true
            });
          } else if (error.response.status == 412) {
            this.$Message.error({
              content: "请输入合法的字符串",
              duration: 10,
              closable: true
            });
          } else {
            this.$Message.warning({
              content: "网络出现了一些问题，请刷新重试",
              duration: 10,
              closable: true
            });
          }
        });
    },
    openPswModal() {
      // console.log('change password');
      this.pswModal = true;
    },
    closePswModal() {
      this.pswModal = false;
    },
    pswNextStep() {
      console.log(`psw step: ${this.pswStep}`);
      let data = {};
      if (this.pswStep == 0) {
        if (this.oldpsw === "") {
          this.$Message.warning({
            content: "请勿输入空字符串",
            duration: 10,
            closable: true
          });
        } else {
          data = {
            oldpsw: this.oldpsw
          };
          this.submitPassword(data);
        }
      } else if (this.pswStep == 1) {
        if (this.oldpsw != this.newpsw) {
          this.pswStep++;
        } else {
          this.$Message.warning({
            content: "新密码不能和旧密码一样",
            duration: 10,
            closable: true
          });
        }
      } else if (this.pswStep == 2) {
        if (this.newpsw != this.newpswConfirm) {
          this.$Message.warning({
            content: "两次输入的密码不一致",
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
    submitPassword(data) {
      this.pswLoading = true;
      const csrfToken = cookie.get("csrfToken");
      this.$axios
        .put(`/api/user/${this.$route.params.uid}/password`, data, {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        })
        .then(res => {
          this.pswLoading = false;
          if (res.status == 204) {
            if (this.pswStep == 0) {
              this.$Message.success({
                content: "密码正确",
                duration: 10,
                closable: true
              });
              this.pswStep++;
            } else if (this.pswStep == 2) {
              this.$Message.success({
                content: "修改成功",
                duration: 10,
                closable: true
              });
              this.pswStep = 0;
              this.closePswModal();
            }
          }
        })
        .catch(error => {
          this.pswLoading = false;
          if (error.response.status == 403) {
            this.jumpLogin();
          } else if (error.response.status == 405) {
            this.$Message.error({
              content: "您没有权限进行此操作",
              duration: 10,
              closable: true
            });
          } else if (error.response.status == 412) {
            this.$Message.error({
              content: "输入的密码不正确",
              duration: 10,
              closable: true
            });
          } else {
            this.$Message.warning({
              content: "网络出现了一些问题，请刷新重试",
              duration: 10,
              closable: true
            });
          }
          return true;
        });
    },
    followUser(operation, id) {
      const csrfToken = cookie.get("csrfToken");
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
      const data = {};
      if (operation === "follow") {
        data.followedId = id;
      } else if (operation === "unfollow") {
        data.unfollowedId = id;
      } else return;
      console.log(operation);
      this.$axios
        .post(`/api/user/${this.$store.state.user.id}/follow/user`, data, {
          headers: { "x-csrf-token": csrfToken },
          withCredentials: true
        })
        .then(res => {
          this.$Spin.hide();
          if (res.status == 204) {
            console.log("success");
            if (operation === "follow") {
              this.$Message.success("关注成功");
            }
            if (operation === "unfollow") {
              this.$Message.success("取关成功");
            }
            if (this.followingModal) {
              this.getMyFollowing(0, 10);
              this.followingPage = 1;
            } else {
              this.getUserInfo();
            }
          }
        })
        .catch(error => {
          if (error.response.status == 500) {
            console.log("500 Internal Server Error");
            this.$Spin.hide();
            this.$Message.warning({
              content: "服务器出现了一些错误。",
              duration: 10,
              closable: true
            });
          } else if (error.response.status == 401) {
            this.$Spin.hide();
            this.jumpLogin();
          } else if (error.response.status == 400) {
            this.$Spin.hide();
            this.$Message.warning({
              content: `${error.response.data}`,
              duration: 10,
              closable: true
            });
          } else {
            this.$Spin.hide();
            this.$Message.warning({
              content: "服务器出错啦，请重试",
              duration: 10,
              closable: true
            });
          }
        });
    }
  },
  watch: {
    $route(to, from) {
      // console.log('change')
      if (to.params.uid != from.params.uid) {
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
.info-row {
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
.avatar {
  border-radius: 100%;
  width: 100%;
}
#avatar-cropper {
  width: 100%;
  height: 100%;
}
</style>