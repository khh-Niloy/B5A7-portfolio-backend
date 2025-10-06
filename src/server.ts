import app from "./app";
import { Server } from "http";
// import { seedAdmin } from "./app/utils/seedAdmin";
import mongoose from "mongoose";
import { envVars } from "./app/config/envVars";

let server: Server;

const startServer = async () => {
  await mongoose.connect(envVars.MONGO_URI)
  server = app.listen(8000, () => {
    console.log("✅ mongoose connected")
    console.log("✅ server is running");
  });
};

(async () => {
  await startServer();
  // await seedAdmin()
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
