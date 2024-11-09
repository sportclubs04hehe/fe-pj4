export interface PostRequest {
    content: string;
    visibility: PostVisibility
}

export enum PostVisibility {
    PUBLIC = 'PUBLIC',
    FRIENDS = 'FRIENDS',
    PRIVATE = 'PRIVATE',
}