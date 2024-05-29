var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
