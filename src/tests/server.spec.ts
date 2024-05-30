import chai, { expect } from "chai";
import chaiHttp from 'chai-http';
import createServer from "server";

chai.use(chaiHttp);

const app = createServer();

describe("Server running", () => {
  it("should return 200 if server is running", (done) => {
    chai.request(app)
      .get("/")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
