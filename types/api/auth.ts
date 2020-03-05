/**
 * 定义基础返回接口
 */
import {UserStruct, UserStructSimplified} from "./user";

export interface BaseResponse {
  status: boolean
  msg?: string
}

/**
 * /auth
 */
export namespace Auth {
  /**
   * POST /auth/login 登录
   * GET /auth/login 检查登录情况
   *
   * 无论是POST还是GET均返回 Login.Response
   */
  export namespace Login {
    // POST
    export interface Request {
      username: string,
      password: string,
      captcha: string,
    }

    export interface Response extends BaseResponse {
      //登录失败或没有登录user项为空（也可以设置BaseResponse.status
      user?: UserStructSimplified
    }
  }
  /**
   * GET /auth/captcha //验证码获取
   * POST /auth/captcha //验证码验证
   */
  export namespace Captcha {
    //GET
    export interface GetResponse {
      src: string //返回base64或svg或后端临时图片链接
    }

    //POST
    export interface PostRequest {
      code: string
    }

    export interface PostResponse extends BaseResponse {
      token: string
    }
  }

  /**
   * //注册
   POST /auth/register
   */
  export namespace Register {
    export interface Request {
      username: string,
      password: string,
      // rePassword: string, //此处建议不需要把重复密码传入后端，在前端检查即可
      email: string,
      // nickName: string, //使用username而不再设nickName
      captcha: string,
      invCode: string,//邀请码
    }

    export interface Response extends BaseResponse {
      user: UserStructSimplified
    }
  }

  /**
   * //密码重置（忘记）
   POST /auth/reset
   */
  export namespace Reset {
    export interface Request {
      email: string
    }

    export interface Response extends BaseResponse {
    }
  }
}
