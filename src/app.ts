import express from "express";
import swagger from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import router from "~routes/Router";
import redis from "~utils/cache";
import prisma from "~utils/database";
import { swaggerOptions } from "~utils/swagger";

var app = express();

// Swagger Documentation
// This is generated before logging middleware because we don't need to log requests to swagger as we already log the actual requests made *from* swagger
const specs = swagger(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

import { json, urlencoded } from "body-parser";
import helmet from "helmet";
import { mw as requestIp } from "request-ip";
import LoggingMiddleware from "~middleware/LoggingMiddleware";
import { CreateRateLimit } from "~utils/ratelimit";

app.use(helmet()); // Security Headers
app.use(requestIp()); // Ensure client IP is attached to request
app.use(CreateRateLimit("global", 30, 60)); // Rate Limit
app.use(json()); // Parse body as JSON
app.use(urlencoded({ extended: true })); // Handle Encoded URL values automagically
app.use(LoggingMiddleware); // Logging

app.use(router); // Global Router

prisma
  .$connect()
  .then(() => {
    console.log("Database connection created.");
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
  });

redis.connect(() => {
  console.log("Cache connection created.");
});

export default app;
