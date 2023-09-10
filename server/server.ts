import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();

// Path: server/server.ts

// createServer() takes a requestListener callback function
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
  connectDB();
});
