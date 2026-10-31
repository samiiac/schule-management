import { app } from "./app.js";
import { prisma } from "./prisma/client.js";

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`uni man runnin on localhost:${PORT}`);
});
let shuttingDown = false;
const shutdown = async (signal) => {
  if (shuttingDown) {
    return;
  }
   console.log(`${signal} received, shutting down...`);
  shuttingDown = true;
  server.close(async () => {
    console.log("Server Closed.")
    try {
      await prisma.$disconnect();
      console.log("Cleanup Complete. Exiting")
      process.exit(0);
    } catch (error) {
      console.log("Error while cleaning up");
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.log("force exit");
    process.exit(1);
  }, 8000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
