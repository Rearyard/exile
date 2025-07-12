import type { PublicUser } from "./user";
import type { PostContent } from "./content";

export enum FeedItemType {
    /**
     * Post is like a tweet or a post on social media.
     * It has a title, content, and a list of tags.
     */
    POST = 'POST',
}

export interface BaseFeedItem {
    id: string
    type: FeedItemType
    createdAt: string
    updatedAt: string
    author: PublicUser
}

export interface PostFeedItem extends BaseFeedItem {
    type: FeedItemType.POST
    content: PostContent
}