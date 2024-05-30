import { PORT } from "./secrets";
import { v1SwaggerDocs } from "./v1/utils/swagger";
import createServer from "./server";

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  v1SwaggerDocs(app, +PORT);
});
