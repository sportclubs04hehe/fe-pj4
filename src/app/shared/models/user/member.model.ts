import { Photo } from "./photo.model"

export interface Member {
    id: string
    firstName: string
    lastName: string
    userName: string
    dateCreated: Date
    lastActive: Date
    age: number
    photoUrl: string
    knowAs: string
    gender: string
    introduction: string
    interests: string
    lookingFor: string
    city: string
    country: string
    photos: Photo[]
}

