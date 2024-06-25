import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express Task API",
      version: "0.1.0",
      description: "Simple CRUD API for creating users and tasks",
      contact: {
        name: "Hycord",
        url: "https://masen.dev",
        email: "hello@masen.dev",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/utils/swagger.yaml"],
};
