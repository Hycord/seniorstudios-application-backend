import "./utils/paths";
import app from "./app";
import prisma from "~utils/database";
import env from "~utils/env";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const server = app.listen(env.PORT, async () => {
  console.log(`Server running on port ${env.PORT}`);
});

// Handle process being killed.
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, async () => {
    console.log("Shutting down server gracefully");
    await prisma.$disconnect();
    if (server.listening) server.close();
  }),
);
