import express from 'express';
import cors from "cors"


const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.get("/status", (req, res) => {
  res.json({
    service: "Auth Service",
    status: "started",
    message: "Auth service is running successfully 🚀",
    port: PORT,
  });
});

const PORT = process.env.PORT || 6001;
const HOST = "localhost"

const server = app.listen(PORT, () => {
  console.log(`[ ready ] http://${HOST}:${PORT}`);

  // Optionally print same JSON in console too
  console.log({
    service: "Auth Service",
    status: "started",
    message: `Auth service running at http://${HOST}:${PORT}`,
  });
});

server.on("error", (err: any) => {
  console.error("Server failed to start ⚠️");
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error(err);
  }
  process.exit(1); // Optional: exit process if server fails
});
