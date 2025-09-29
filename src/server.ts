import app from "./app";
import { Server } from "http";
import { PrismaClient } from "@prisma/client";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;
export const prisma = new PrismaClient()

const startServer = async () => {
  server = app.listen(8000, () => {
    prisma.$connect()
    console.log("✅ prisma connected")
    console.log("✅ server is running");
  });
};

(async () => {
  await startServer();
  await seedAdmin()
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
