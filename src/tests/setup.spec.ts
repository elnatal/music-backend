import prismaClient from "v1/utils/prisma";
import { testUsers } from "./helper";

before((done) => {
  prismaClient.user
    .createMany({
      data: testUsers,
    })
    .then((_) => {})
    .finally(() => {
      done();
    });
});

after((done) => {
  prismaClient.user.deleteMany().finally(() => {
    done();
  });
});
