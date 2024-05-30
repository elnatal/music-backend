import { User } from "@prisma/client";
import chai from "chai";
import chaiHttp from "chai-http";
import createServer from "server";
import prismaClient from "v1/utils/prisma";
import { adminId, artistId, getToken, userId, genres } from "tests/helper";

chai.use(chaiHttp);
chai.should();

const app = createServer();

describe("Genre", () => {
  describe("POST /api/v1/genres", () => {
    let token = getToken(adminId);

    it("should create genre", (done) => {
      chai
        .request(app)
        .post("/api/v1/genres")
        .set("Authorization", `Bearer ${token}`)
        .send(genres[0])
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("genre");
          res.body.genre.should.have.property("id");
          res.body.genre.should.have.property("name").eql("R&B");
          res.body.genre.should.have.property("createdAt");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .post("/api/v1/genres")
        .set("Authorization", `Bearer InvalidToken`)
        .send(genres[0])
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });

    it("should return 401 if role is USER", (done) => {
      let token = getToken(userId);
      chai
        .request(app)
        .post("/api/v1/genres")
        .set("Authorization", `Bearer ${token}`)
        .send(genres[0])
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });

    it("should return 401 if role is ARTIST", (done) => {
      let token = getToken(artistId);
      chai
        .request(app)
        .post("/api/v1/genres")
        .set("Authorization", `Bearer ${token}`)
        .send(genres[0])
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });

    it("should return 400 if genre already exist", (done) => {
      let token = getToken(adminId);
      prismaClient.genre.create({ data: genres[0] }).finally(() => {
        chai
          .request(app)
          .post("/api/v1/genres")
          .set("Authorization", `Bearer ${token}`)
          .send(genres[0])
          .end((err, res) => {
            res.status.should.be.eql(400);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Genre already exists");
            done();
          });
      });
    });
  });

  describe("PUT /api/v1/genres/{id}", () => {
    let token = getToken(adminId);

    it("should update an existing genre", (done) => {
      prismaClient.genre.create({ data: genres[0] }).then((response) => {
        chai
          .request(app)
          .put(`/api/v1/genres/${response?.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ name: "NewGenreName" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("genre");
            res.body.genre.should.have.property("id");
            res.body.genre.should.have.property("name").eql("NewGenreName");
            res.body.genre.should.have.property("createdAt");
            done();
          });
      });
    });

    it("should return 404 if genre doesn't exist", (done) => {
      chai
        .request(app)
        .put(`/api/v1/genres/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "NewGenreName" })
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Genre not found");
          done();
        });
    });

    it("should return 400 if the new name already exist", (done) => {
      prismaClient.genre.createMany({ data: genres }).finally(() => {
        chai
          .request(app)
          .put(`/api/v1/genres/${genres[0].id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ name: genres[1].name })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Genre already exists");
            done();
          });
      });
    });
  });

  describe("GET /api/v1/genres", () => {
    let token = getToken(adminId);

    it("should return a list of genres with count", (done) => {
      prismaClient.genre.createMany({ data: genres }).then((response) => {
        chai
          .request(app)
          .get(`/api/v1/genres`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("count").eql(response.count);
            res.body.should.have.property("genres");
            res.body.genres.should.be.a("array");
            done();
          });
      });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .get(`/api/v1/genres`)
        .set("Authorization", `Bearer invalidToken`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("GET /api/v1/genres/{id}", () => {
    let token = getToken(adminId);

    it("should return a single genre", (done) => {
      prismaClient.genre.create({ data: genres[0] }).then((response) => {
        chai
          .request(app)
          .get(`/api/v1/genres/${response?.id}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("genre");
            res.body.genre.should.have.property("id").eql(response?.id);
            res.body.genre.should.have.property("name").eql(response?.name);
            res.body.genre.should.have
              .property("createdAt")
              .eql(response?.createdAt.toISOString());
            done();
          });
      });
    });

    it("should return 404 if genre doesn't exist", (done) => {
      chai
        .request(app)
        .get(`/api/v1/genres/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Genre not found");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      prismaClient.genre.create({ data: genres[0] }).then((response) => {
        chai
          .request(app)
          .get(`/api/v1/genres/${response?.id}`)
          .set("Authorization", `Bearer invalidToken`)
          .end((err, res) => {
            res.status.should.be.eql(401);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Unauthorized");
            done();
          });
      });
    });
  });

  describe("DELETE /api/v1/genres/{id}", () => {
    let token = getToken(adminId);

    it("should return a single genre", (done) => {
      prismaClient.genre.create({ data: genres[0] }).then((response) => {
        chai
          .request(app)
          .delete(`/api/v1/genres/${response?.id}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success").eql(true);
            done();
          });
      });
    });

    it("should return 404 if genre doesn't exist", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/genres/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Genre not found");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      prismaClient.genre.create({ data: genres[0] }).then((response) => {
        chai
          .request(app)
          .delete(`/api/v1/genres/${response?.id}`)
          .set("Authorization", `Bearer invalidToken`)
          .end((err, res) => {
            res.status.should.be.eql(401);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Unauthorized");
            done();
          });
      });
    });
  });

  afterEach((done) => {
    prismaClient.genre.deleteMany().finally(() => done());
  });
});
