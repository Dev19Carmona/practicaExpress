const express = require("express");
const cors = require('cors');
const app = express();
const { config } = require("dotenv");
const router = require("./routes");
config();
const startServer = () => {
  app.use(cors());
  app.use(express.json());
  app.use("/api/v1", router);

  app.listen(process.env.PORT, () => {
    console.log(`SERVER ON: http://localhost:${process.env.PORT}`);
  });
};
module.exports = startServer;
