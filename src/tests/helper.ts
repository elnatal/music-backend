import { AccountType } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "secrets";

export const adminId = "df5cd057-1d1a-4c15-97f9-3f4d089d8856";
export const userId = "df5cd057-1d1a-4c15-97f9-3f4d089d8857";
export const artistId = "df5cd057-1d1a-4c15-97f9-3f4d089d8858";

export const getToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "3h",
  });
};

export const testUsers = [
  {
    id: adminId,
    name: "Admin",
    accountType: AccountType.ADMIN,
    firebaseId: "adminId",
  },
  {
    id: userId,
    name: "User",
    accountType: AccountType.USER,
    firebaseId: "userId",
  },
  {
    id: artistId,
    name: "Michael Jackson",
    accountType: AccountType.ARTIST,
    firebaseId: "artistId",
  },
];

export const genres = [
  {
    id: "df5cd0w1-3b7d-4b1b-9b0d-1b1b1b1b1b1b",
    name: "R&B",
  },
  {
    id: "df5cd0w1-3b7d-4b1b-9b0d-1b1b1b1b1b1c",
    name: "Hip Hop",
  },
  {
    id: "df5cd0w1-3b7d-4b1b-9b0d-1b1b1b1b1b1d",
    name: "Afrobeat",
  },
];

export const songs = [
  {
    id: "df5cd0w1-3b7d-4b1b-9b0d-1b1b1b1b1b1b",
    title: "Don't stop 'til you get enough",
    fileUrl: "https://res.cloudinary.com/sample.mp3",
    genres: [genres[0].id],
  },
  {
    id: "df5cd0w1-3b7d-4b1b-9b0d-1b1b1b1b1b1c",
    title: "Billie Jean",
    fileUrl: "https://res.cloudinary.com/sample.mp3",
    genres: [genres[0].id],
  },
  {
    id: "df5cd0w1-3b7d-4b1b-9b0d-1b1b1b1b1b1d",
    title: "Thriller",
    fileUrl: "https://res.cloudinary.com/sample.mp3",
    genres: [genres[0].id],
  },
];
