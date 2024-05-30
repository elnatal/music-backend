import chai from "chai";
import chaiHttp from "chai-http";
import createServer from "server";
import { adminId, getToken, userId } from "tests/helper";

chai.use(chaiHttp);
chai.should();

const app = createServer();

describe("User", () => {
  describe("PUT /api/v1/users", () => {
    let token = getToken(userId);

    it("should update the authenticated user profile", (done) => {
      chai
        .request(app)
        .put("/api/v1/users")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "NewName" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("user");
          res.body.user.should.have.property("id").eql(userId);
          res.body.user.should.have.property("name").eql("NewName");
          res.body.user.should.have.property("accountType").eql("USER");
          res.body.user.should.have.property("dateOfBirth");
          res.body.user.should.have.property("createdAt");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .put("/api/v1/users")
        .set("Authorization", `Bearer InvalidToken`)
        .send({ name: "NewName" })
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });

  describe("PUT /api/v1/users/{id}", () => {
    let token = getToken(adminId);

    it("should update an existing user", (done) => {
      chai
        .request(app)
        .put(`/api/v1/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ accountType: "ARTIST" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("user");
          res.body.user.should.have.property("id").eql(userId);
          res.body.user.should.have.property("name");
          res.body.user.should.have.property("accountType").eql("ARTIST");
          res.body.user.should.have.property("dateOfBirth");
          res.body.user.should.have.property("createdAt");
          done();
        });
    });

    it("should return 404 if user doesn't exist", (done) => {
      chai
        .request(app)
        .put(`/api/v1/users/unknownId`)
        .set("Authorization", `Bearer ${token}`)
        .send({ accountType: "ARTIST" })
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("User not found");
          done();
        });
    });
  });

  describe("GET /api/v1/users", () => {
    let token = getToken(adminId);

    it("should return a list of users with count", (done) => {
      chai
        .request(app)
        .get(`/api/v1/users`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("count").eql(3);
          res.body.should.have.property("users");
          res.body.users.should.be.a("array");
          done();
        });
    });

    it("should return 401 if invalid token is provided", (done) => {
      chai
        .request(app)
        .get(`/api/v1/users`)
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
