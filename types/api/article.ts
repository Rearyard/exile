import {BaseResponse} from "./auth";
import {UserStructSimplified} from "./user";


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
  G, PG13, NC17
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
  id: number
  author: string
  content: string
  publish: number//发布日期  //Date不是基础数据类型，改用时间戳（毫秒级）
  like: number //赞数
}

/**
 * 定义章节结构
 */
export interface Chapter {
  cid: number//章节id，从0开始
  title: string, //章节标题
  summary: string, //章节简介
  publish: number, //发布日期  //Date不是基础数据类型，改用时间戳（毫秒级）
  edit: number, //最后编辑日期
  content: string
  //不再包括评论，转而调用专门的API
  // comments:Comment[]
  commentCount: number//评论数目
}

//这里的定义是指 Chapter中除去content字段
export type ChapterSimplified = Omit<Chapter, 'content'>

/**
 * 定义文章结构
 */

export interface ArticleStruct {
  aid: number
  title: string,//标题
  summary: string, //简介
  author: UserStructSimplified, //作者名
  rating: Rating,//作品分级
  warning: Warning[]
  fandom: string, //原作
  relationship: string, //CP名
  category: Category,//性向分类
  character: string[] //人物
  tag: string[] //其它说明tag
  view: number //阅读量
  like: number, //赞数
  favorite: number, //收藏数
  wordCount: number, //字数
  chapters: ChapterSimplified[]
  // comments: Comment[] //评论已转移到章节下
}


//这里的定义是指 ArticleStruct中除去chapters字段
export type ArticleSimplified = Omit<ArticleStruct, 'chapters'>

/**
 * /article
 */

export namespace Article {
  /**
   * //获取文章列表
   * GET /article/list?offset=[number]&amount=[number]
   */
  export namespace List {
    export interface Response extends BaseResponse {
      articles: ArticleSimplified[]
    }
  }
  /**
   * //获取文章信息（包括章节信息）
   * GET /article/:aid  //:aid是路由参数，文章id
   */
  export namespace Detail {
    export interface Response extends BaseResponse {
      article: ArticleStruct
    }
  }
  /**
   * 搜索
   * POST /article/search
   */
  export namespace Search {
    export interface Request {
      query?: string,  // 在所有字段搜索, 包括 title, author, relationship,summary 等
      title?: string,  // 模糊搜索
      author?: string,  // 模糊搜索
      fandom?: string,  // 为空不限, 模糊搜索
      relationship?: string, // 为空不限, 模糊搜索
      category?: Category[],  // 分类
      tag?: string[], // 为空不限, 模糊搜索
      rating?: Rating[] //作品分级
      offset: number,
      amount: number,
      orderBy: "recent" | "popular"
    }

    export interface Response extends BaseResponse {
      count: number,  // 搜索结果数
      articles: ArticleSimplified[]
    }
  }

  /**
   * PUT    /article       添加/修改文章（不包含章节）
   * DELETE /article/:aid  删除文章
   */
  export namespace PutArticle {
    export interface Request {//仅用于PUT
      aid?: number //留空新建
      title: string,//标题
      summary: string, //简介
      rating: Rating,//作品分级
      warning: Warning[]
      fandom: string, //原作
      relationship: string, //CP名
      category: Category,//性向分类
      character: string[] //人物
      tag: string[] //其它说明tag
    }

    export interface Response extends BaseResponse {
      article: ArticleStruct
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
  export namespace GetChapters {
    export interface Response extends BaseResponse {
      chapters: Chapter[] //从offset开始的amount个章节
    }
  }
  /**
   * PUT /article/:aid          添加/修改章节
   * DELETE /article/:aid/:cid  删除章节
   */
  export namespace PutChapter {
    export interface Request { //仅用于PUT
      cid?: number//章节id，留空新建
      title: string, //章节标题
      summary: string, //章节简介
      content: string
    }
    export interface Response extends BaseResponse {
      chapter: Chapter
    }
  }
}

export namespace Comment {

  /**
   PUT /article/:aid/:cid/comments  //cid是章节号 //添加/修改评论
   GET /article/:aid/:cid/comments?offset=[number]&amount=[number] //拉取评论
   DELETE /article/:aid/:cid/comments/:id //删除评论
   */
  export interface Request { //仅用于PUT
    id?: number //留空为添加
    content: string
  }

  export interface Response extends BaseResponse {
    comments: Comment[] //如果是PUT/DELETE，返回数组长度为1，仅包含新建/删除评论
  }
}

