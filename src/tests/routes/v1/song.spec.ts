import { User } from "@prisma/client";
import chai, { use } from "chai";
import chaiHttp from "chai-http";
import createServer from "server";
import prismaClient from "v1/utils/prisma";
import {
  adminId,
  artistId,
  genres,
  getToken,
  songs,
  userId,
} from "tests/helper";

chai.use(chaiHttp);
chai.should();

const app = createServer();

describe("Song", () => {
  beforeEach((done) => {
    prismaClient.genre.createMany({ data: genres }).finally(() => done());
  });

  describe("POST /api/v1/songs", () => {
    let token = getToken(artistId);

    it("should create song", (done) => {
      chai
        .request(app)
        .post("/api/v1/songs")
        .set("Authorization", `Bearer ${token}`)
        .send(songs[0])
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("song");
          res.body.song.should.have.property("id");
          res.body.song.should.have.property("title").eql(songs[0].title);
          res.body.song.should.have.property("fileUrl").eql(songs[0].fileUrl);
          res.body.song.should.have.property("artist");
          res.body.song.should.have.property("genres");
          res.body.song.should.have.property("likes");
          res.body.song.should.have.property("liked");
          res.body.song.should.have.property("createdAt");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .post("/api/v1/songs")
        .set("Authorization", `Bearer InvalidToken`)
        .send(songs[0])
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
        .post("/api/v1/songs")
        .set("Authorization", `Bearer ${token}`)
        .send(songs[0])
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });

    it("should return 401 if role is ADMIN", (done) => {
      let token = getToken(adminId);
      chai
        .request(app)
        .post("/api/v1/songs")
        .set("Authorization", `Bearer ${token}`)
        .send(songs[0])
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("PUT /api/v1/songs/{id}", () => {
    let token = getToken(artistId);

    it("should update an existing song", (done) => {
      let data = {
        id: songs[0].id,
        title: songs[0].title,
        fileUrl: songs[0].fileUrl,
        artistId,
      };
      prismaClient.song.create({ data }).then((response) => {
        chai
          .request(app)
          .put(`/api/v1/songs/${data.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ title: "NewSongTitle", genres: [genres[0].id] })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("song");
            res.body.song.should.have.property("id");
            res.body.song.should.have.property("title").eql("NewSongTitle");
            res.body.song.should.have.property("fileUrl");
            res.body.song.should.have.property("artist");
            res.body.song.should.have.property("genres");
            res.body.song.should.have.property("likes");
            res.body.song.should.have.property("liked");
            res.body.song.should.have.property("createdAt");
            done();
          });
      });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .put(`/api/v1/songs/id`)
        .set("Authorization", `Bearer invalidToken`)
        .send({ title: "NewSongTitle", genres: [genres[0].id] })
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });

    it("should return 404 if song doesn't exist", (done) => {
      chai
        .request(app)
        .put(`/api/v1/songs/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "NewSongTitle", genres: [genres[0].id] })
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Song not found");
          done();
        });
    });
  });

  describe("GET /api/v1/songs", () => {
    let token = getToken(adminId);

    it("should return a list of songs with count", (done) => {
      chai
        .request(app)
        .get(`/api/v1/songs`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("count");
          res.body.should.have.property("songs");
          res.body.songs.should.be.a("array");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .get(`/api/v1/songs`)
        .set("Authorization", `Bearer invalidToken`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("GET /api/v1/songs/liked-songs", () => {
    let token = getToken(adminId);

    it("should return a list of liked songs with count", (done) => {
      chai
        .request(app)
        .get(`/api/v1/songs/liked-songs`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("count");
          res.body.should.have.property("songs");
          res.body.songs.should.be.a("array");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .get(`/api/v1/songs/liked-songs`)
        .set("Authorization", `Bearer invalidToken`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("GET /api/v1/songs/{id}", () => {
    let token = getToken(adminId);

    it("should return a single song", (done) => {
      let data = {
        id: songs[0].id,
        title: songs[0].title,
        fileUrl: songs[0].fileUrl,
        artistId,
      };
      prismaClient.song.create({ data }).then((response) => {
        chai
          .request(app)
          .get(`/api/v1/songs/${response?.id}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("song");
            res.body.song.should.have.property("id").eql(data.id);
            res.body.song.should.have.property("title").eql(data.title);
            res.body.song.should.have.property("fileUrl").eql(data.fileUrl);
            res.body.song.should.have.property("artist");
            res.body.song.should.have.property("genres");
            res.body.song.should.have.property("likes");
            res.body.song.should.have.property("liked");
            res.body.song.should.have.property("createdAt");
            done();
          });
      });
    });

    it("should return 404 if song doesn't exist", (done) => {
      chai
        .request(app)
        .get(`/api/v1/songs/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Song not found");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .get(`/api/v1/songs/id`)
        .set("Authorization", `Bearer invalidToken`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("DELETE /api/v1/songs/{id}", () => {
    let token = getToken(artistId);

    it("should return a single song", (done) => {
      let data = {
        id: songs[0].id,
        title: songs[0].title,
        fileUrl: songs[0].fileUrl,
        artistId,
      };
      prismaClient.song.create({ data }).then((response) => {
        chai
          .request(app)
          .delete(`/api/v1/songs/${response?.id}`)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success").eql(true);
            done();
          });
      });
    });

    it("should return 404 if song doesn't exist", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/songs/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Song not found");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/songs/id`)
        .set("Authorization", `Bearer invalidToken`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("POST /api/v1/songs/{id}/like", () => {
    let token = getToken(userId);

    it("should like a song", (done) => {
      let data = {
        id: songs[0].id,
        title: songs[0].title,
        fileUrl: songs[0].fileUrl,
        artistId,
      };
      prismaClient.song.create({ data }).then((response) => {
        chai
          .request(app)
          .post(`/api/v1/songs/${response.id}/like`)
          .set("Authorization", `Bearer ${token}`)
          .send({ liked: true })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("liked").eql(true);
            done();
          });
      });
    });

    it("should remove like from a song", (done) => {
      let data = {
        id: songs[0].id,
        title: songs[0].title,
        fileUrl: songs[0].fileUrl,
        artistId,
      };
      prismaClient.song.create({ data }).then((response) => {
        chai
          .request(app)
          .post(`/api/v1/songs/${response.id}/like`)
          .set("Authorization", `Bearer ${token}`)
          .send({ liked: false })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("liked").eql(false);
            done();
          });
      });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .post(`/api/v1/songs/id/like`)
        .set("Authorization", `Bearer InvalidToken`)
        .send({ liked: true })
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });

    it("should return 404 if song doesn't exist", (done) => {
      chai
        .request(app)
        .post(`/api/v1/songs/unknownId/like`)
        .set("Authorization", `Bearer ${token}`)
        .send({ liked: true })
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Song not found");
          done();
        });
    });
  });

  afterEach((done) => {
    prismaClient.like.deleteMany().finally(() => {
      prismaClient.songGenre.deleteMany().finally(() => {
        prismaClient.genre.deleteMany().finally(() => {
          prismaClient.song.deleteMany().finally(() => {
            done();
          });
        });
      });
    });
  });
});
