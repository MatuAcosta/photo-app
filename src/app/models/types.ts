import { UserCredential, User } from "@angular/fire/auth";

export type UserAuth = {
    email: string | null;
    accessToken: string | Promise<string>
}

export type UserDTO = {
    email: string | null;
    username: string | null;
}


export type ResponseGeneric = {
    error: boolean;
    message: string;
}

export type PictureDTO = {
    url: string;
    username: string;
    description: string;
    createdAt: string;
    topic: string;
    likes: number;
}

export type TopicDTO = {
    topic: string;
    date: string;
}