import { Photo } from "./photo.model";

export interface PostResponse {
    id: any;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    photos: Photo[];
}

export interface User {
    id: any;
    firstName: string;
    lastName: string;
}