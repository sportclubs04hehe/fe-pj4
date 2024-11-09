import { Photo } from "./photo.model";
import { PostVisibility } from "./post.model";

export interface PostResponse {
    id: any;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    photos: Photo[];
    visibility: PostVisibility;
}

export interface User {
    id: any;
    firstName: string;
    lastName: string;
}