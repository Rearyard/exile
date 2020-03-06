import {ArticleSimplified} from "./article";
import {BaseResponse} from "./auth";

export interface UserStructSimplified {
  uid: number;
  username: string;  //用户名
  info: string; //个人介绍
  grade: number;      //用户等级
  avatar: string;  //个人头像
  followingCount: number; //关注数量
  followedCount: number; //粉丝数量
  articlesCount: number; //作品数量
}

export interface UserStruct extends UserStructSimplified {
  //注意，默认这里的关注、粉丝和作品只返回有限个，完整列表请调用其他API
  following: UserStructSimplified[]; //关注
  followed: UserStructSimplified[];   //粉丝
  articles: ArticleSimplified[];  //作品
  ctime: number;    //注册时间 //Date不是基础数据类型，改用时间戳（毫秒级）
  donation: string; //打赏二维码
}

/**
 * /user
 */
export namespace User {
  /**
   //个人中心页面
   GET /user/:uid  //要查询的用户id,
   */
  export namespace User {
    export interface Response extends BaseResponse {
      user: UserStruct;
    }
  }
  /**
   * //修改个人信息
   POST /user/:uid/edit
   */
  export namespace Edit {
    export interface Request {
      username?: string;  //用户名
      info?: string; //个人介绍
      avatar?: string;  //个人头像
      oldPassword?: string; //如果要修改以下敏感信息，需要输入旧密码认证
      password?: string; //新密码
      donation?: string; //打赏二维码
    }

    export type Response = BaseResponse
  }
  /**
   * 获取关注
   * GET /user/:uid/following?offset=[number]&amount=[number]
   */
  export namespace Following {
    export interface Response extends BaseResponse {
      count: number;//总数
      users: UserStructSimplified[];
    }
  }
  /**
   * 获取粉丝
   * GET /user/:uid/followed?offset=[number]&amount=[number]
   */
  export namespace Followed {
    export interface Response extends BaseResponse {
      count: number;//总数
      users: UserStructSimplified[];
    }
  }
  /**
   * 获取作品
   * GET /user/:uid/article?offset=[number]&amount=[number]
   */
  export namespace Article {
    export interface Response extends BaseResponse {
      count: number;//总数
      articles: ArticleSimplified[];
    }
  }


}