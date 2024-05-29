import prismaClient from "./v1/utils/prisma";
import firebaseClient from "./v1/utils/firebase";
import { AccountType } from "@prisma/client";

console.log("Seeder running!");

let accounts = [
  {
    name: "Admin",
    email: "admin@music.com",
    password: "password",
    accountType: AccountType.ADMIN,
  },
  {
    name: "User",
    email: "user@music.com",
    password: "password",
    accountType: AccountType.USER,
  },
  {
    name: "Artist",
    email: "artist@music.com",
    password: "password",
    accountType: AccountType.ARTIST,
  },
];

const seed = async () => {
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];

    let firebaseId;

    try {
      // check if user exists in firebase
      let existingUser = await firebaseClient
        .auth()
        .getUserByEmail(account.email);
      firebaseId = existingUser.uid;
    } catch (error) {
      // create user in firebase
      let user = await firebaseClient.auth().createUser({
        email: account.email,
        password: account.password,
      });

      firebaseId = user.uid;
    }

    // create user in prisma
    let user = await prismaClient.user.upsert({
      where: { firebaseId: firebaseId },
      update: {
        name: account.name,
        accountType: account.accountType,
      },
      create: {
        name: account.name,
        firebaseId: firebaseId,
        accountType: account.accountType,
      },
    });
  }
};

// create user in prisma

seed();
