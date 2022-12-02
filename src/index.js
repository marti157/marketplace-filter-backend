import * as dotenv from "dotenv";
import express from "express";

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
