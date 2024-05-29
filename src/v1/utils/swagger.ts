import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "../../secrets";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Music API",
      version: "V1",
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/v1/routes/*.ts", "./src/v1/schema/*.ts"],
};

const specs = swaggerJsdoc(options);

export const v1SwaggerDocs = (app: Express, port: Number) => {
  app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.json(specs);
  });

  console.log(
    `V1 Api doc is available at http://localhost:${port}/v1/api-docs`
  );
};

export default v1SwaggerDocs;
