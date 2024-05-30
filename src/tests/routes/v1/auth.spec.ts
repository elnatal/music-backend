import chai from "chai";
import chaiHttp from "chai-http";
import createServer from "server";
import { adminId, getToken } from "tests/helper";

chai.use(chaiHttp);
chai.should();

const app = createServer();

describe("Auth", () => {
  describe("GET /api/v1/auth/me", () => {
    it("should return the authenticated user if a valid token is provided", (done) => {
      let token = getToken(adminId);
      chai
        .request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.should.be.a("object");
          res.body.should.have.property("user");
          res.body.user.should.have.property("id").eql(adminId);
          done();
        });
    });

    it("should return unauthorized if invalid valid token is provided", (done) => {
      let token = getToken("invalid id");
      chai
        .request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Unauthorized");
          done();
        });
    });
  });
});
