/* eslint-disable */
import {UserStruct, UserStructSimplified} from "./user";
import {BaseResponse, get, post} from "@/types/api/config";

/**
 * /auth
 */

/**
 * POST /auth/login 登录
 * GET /auth/login 检查登录情况
 *
 * 无论是POST还是GET均返回 Login.Response
 */
export function checkLogin() {
  return get<Login.Response>('/auth/login')
}

export function login(username: string,
                      password: string,
                      captcha: string,) {
  return post<Login.Response, Login.Request>('/auth/login',
    {username, password, captcha})
}

export namespace Login {
  // POST
  export interface Request {
    username: string;
    password: string;
    captcha: string;
  }

  export interface Response extends BaseResponse {
    //登录失败或没有登录user项为空（也可以设置BaseResponse.status
    user?: UserStructSimplified;
  }
}

/**
 * GET /auth/captcha //验证码获取
 * POST /auth/captcha //验证码验证
 */
export function getCaptcha() {
  return get<Captcha.GetResponse>('/auth/captcha')
}

export function checkCaptcha(code: string) {
  return post<Captcha.PostResponse, Captcha.Request>('/auth/captcha',
    {code})
}

export namespace Captcha {
  //GET
  export interface GetResponse {
    src: string; //返回base64或svg或后端临时图片链接
  }

  //POST
  export interface Request {
    code: string;
  }

  export interface PostResponse extends BaseResponse {
    token: string;
  }
}

/**
 * //注册
 POST /auth/register
 */
export function register(request: Register.Request) {
  return post<Register.Response, Register.Request>('/auth/register',
    request)
}

export namespace Register {
  export interface Request {
    username: string;
    password: string;
    // rePassword: string, //此处建议不需要把重复密码传入后端，在前端检查即可 
    email: string;
    // nickName: string, //使用username而不再设nickName
    captcha: string;
    invCode: string;//邀请码
  }

  export interface Response extends BaseResponse {
    user: UserStructSimplified;
  }
}

/**
 * //密码重置（忘记）
 POST /auth/reset
 */
export function resetPassword(email: string) {
  return post<Reset.Response, Reset.Request>('/auth/reset', {email})
}

export namespace Reset {
  export interface Request {
    email: string;
  }

  export interface Response extends BaseResponse {
  }
}

