import { Photo } from "./photo.model"

export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateCreated: Date;
    lastActive: Date;
    age: number;
    photoUrl: string;
    knowAs: string;
    gender: string;
    isPrivate: boolean;
    introduction: string;
    interests: string;
    lookingFor: string;
    city: string;
    country: string;
    photos: Photo[];
}

