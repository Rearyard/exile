/* eslint-disable */
import {BaseResponse} from "@/types/api/config";
import {UserStructSimplified} from "./user";
import {API_PREFIX, BaseGetParameters, del, get, post, put} from "@/types/api/config";
import Axios from "axios";

/**
 * 性向分类
 */
export enum Category {
  Unknown, BG, BL, GL, Mixed, Others,
}

/**
 * 作品分级
 */
export enum Rating {
  G, PG13, R, NC17
}

/**
 * 作品警告
 */
export enum Warning {
  No = '不进行警告',
  Violence = '详细的暴力描写',
  MainDeath = '主要角色死亡',
  Rape = '强奸/非自愿性行为',
  Teen = '未成年人性行为',
  Unknown = '无警告内容'
}

/**
 * 定义评论结构
 */
export interface Comment {
  id: number;
  author: string;
  content: string;
  publish: number;//发布日期  //Date不是基础数据类型，改用时间戳（毫秒级）
  like: number; //赞数
}

/**
 * 定义章节结构
 */
export interface Chapter {
  cid: number;//章节id，从0开始
  title: string; //章节标题
  summary: string; //章节简介
  note: string; //注释
  publish: number; //发布日期  //Date不是基础数据类型，改用时间戳（毫秒级）
  edit: number; //最后编辑日期
  content: string;
  //不再包括评论，转而调用专门的API
  // comments:Comment[]
  commentCount: number;//评论数目
}

//这里的定义是指 Chapter中除去content字段
export type ChapterSimplified = Omit<Chapter, 'content'>

/**
 * 定义文章结构
 */

export interface ArticleStruct {
  aid: number;
  title: string;//标题
  summary: string; //简介
  note: string; //注释

  author: UserStructSimplified; //作者名
  rating: Rating;//作品分级
  warning: Warning[];
  fandom: string; //原作
  relationship: string[]; //CP名
  category: Category;//性向分类
  character: string[]; //人物
  tag: string[]; //其它说明tag
  view: number; //阅读量
  like: number; //赞数
  favorite: number; //收藏数
  wordCount: number; //字数
  chapters: ChapterSimplified[];
  // comments: Comment[] //评论已转移到章节下
}

export interface ArticleResponseStruct {
  id: number;
  title: string;
  summary: string;
  note: string;
  author: number;
  rating: string;
  warning: string;
  fandom: string;
  relationship: string;
  category: string;
  character: string;
  tag: string;
  view: number;
  like: number;
  favorite: number;
  wordCount: number;
  chapters: string;
  created: Date;
  last_edit: Date;
  deleted?: any;
}

//这里的定义是指 ArticleStruct中除去chapters字段
export type ArticleSimplified = Omit<ArticleStruct, 'chapters'>

/**
 * /article
 */

export namespace Article {

  /**
   * //获取文章信息（包括章节信息）
   * GET /article/:aid  //:aid是路由参数，文章id
   */
  export async function getDetail(aid: number | string) {
    let {article, author, chapters} = await Axios.get(`${API_PREFIX}/article/${aid}`).then(
      v => v.data
    );
    article = Object.fromEntries(Object.entries(article).map(([k, v]) => [k.replace('article_', ''), v])) as any
    return ({article, author, chapters})
  }

  export namespace Detail {
    export interface Response extends BaseResponse {
      article: ArticleResponseStruct;
      author: UserStructSimplified;
      chapters: ChapterSimplified;
    }
  }


  /**
   * 搜索
   * POST /article/search
   */
  export function search(request: Search.Request) {
    return post<Search.Response>('/article/search', request)
  }

  export namespace Search {
    export interface Request {
      query?: string;  // 在所有字段搜索, 包括 title, author, relationship,summary 等
      title?: string;  // 模糊搜索
      author?: string;  // 模糊搜索
      fandom?: string[];  // 为空不限, 模糊搜索
      relationship?: string[]; // 为空不限, 精确搜索
      category?: Category[];  // 分类
      tag?: string[]; // 为空不限, 精确搜索
      rating?: Rating[]; //作品分级
      offset: number;
      amount: number;
      orderBy: "recent" | "popular";
    }

    export interface Response extends BaseResponse {
      count: number;  // 搜索结果数
      articles: ArticleSimplified[];
    }
  }

  /**
   * PUT    /article       添加/修改文章（不包含章节）
   * DELETE /article/:aid  删除文章
   */
  export function putArticle(request: PutArticle.Request) {
    return put<PutArticle.Response>('/article', request)
  }

  export function deleteArticle(aid: number | string) {
    return del<PutArticle.Response>('/article/' + aid)
  }

  export namespace PutArticle {
    export interface Request {//仅用于PUT
      aid?: number; //留空新建
      title: string;//标题
      summary: string; //简介
      note: string; //注释
      rating: Rating;//作品分级
      warning: Warning[];
      fandom: string; //原作
      relationship: string[]; //CP名
      category: Category;//性向分类
      character: string[]; //人物
      tag: string[]; //其它说明tag
    }

    export interface Response extends BaseResponse {
      article: ArticleStruct;
    }
  }

}

/**
 * /article/:aid/
 */
export namespace Chapter {

  /** //获取章节内容
   GET /article/:aid?offset=[number]&amount=[number]
   */
  export function getChapters(aid: number | string, amount: number = 1, offset = 0) {
    return get<GetChapters.Response, BaseGetParameters>('/article/' + aid, {amount, offset})
  }

  export namespace GetChapters {
    export interface Response extends BaseResponse {
      chapters: Chapter[]; //从offset开始的amount个章节
    }
  }

  /**
   * PUT /article/:aid          添加/修改章节
   * DELETE /article/:aid/:cid  删除章节
   */
  export function putChapter(aid: number | string, request: PutChapter.Request) {
    return put<PutChapter.Response>('/article/' + aid, request)
  }

  export function deleteChapter(aid: number | string, cid: number | string) {
    return del<PutChapter.Response>(`/article/${aid}/${cid}`)
  }

  export namespace PutChapter {
    export interface Request { //仅用于PUT
      cid?: number;//章节id，留空新建
      title: string; //章节标题
      summary: string; //章节简介
      note: string; //注释

      content: string;
    }

    export interface Response extends BaseResponse {
      chapter: Chapter;
    }
  }
}

export namespace Comment {

  /**
   GET /article/:aid/:cid/comments?offset=[number]&amount=[number] //拉取评论
   PUT /article/:aid/:cid/comments  //cid是章节号 //添加/修改评论
   DELETE /article/:aid/:cid/comments/:id //删除评论
   */
  export function getComment(aid: number | string, cid: number | string, amount: number = 1, offset = 0) {
    return get<Response, BaseGetParameters>(`/article/${aid}/${cid}/comments`,
      {amount, offset})
  }

  export function putComment(aid: number | string, cid: number | string, request: Request) {
    return put<Response>(`/article/${aid}/${cid}/comments`, request)
  }

  export function deleteComment(aid: number | string, cid: number | string, id: number | string) {
    return del<Response>(`/article/${aid}/${cid}/comments/${id}`)
  }

  export interface Request { //仅用于PUT
    id?: number; //留空为添加
    content: string;
  }

  export interface Response extends BaseResponse {
    comments: Comment[]; //如果是PUT/DELETE，返回数组长度为1，仅包含新建/删除评论
  }
}

