import express from "express";
import prisma from "~utils/database";
import { swaggerOptions } from "~utils/swagger";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import swagger from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import router from "~routes/Router";

var app = express();

// Swagger Documentation
const specs = swagger(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Security Headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Data parsing
app.use(json());
app.use(urlencoded({ extended: true }));

// Register Router

app.use(router);

prisma
  .$connect()
  .then(() => {
    console.log("Database connection created.");
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
  });

export default app;
