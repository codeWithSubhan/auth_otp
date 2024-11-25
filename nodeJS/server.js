const toJSONPlugin = require("./utiles/sanitizeRes.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
mongoose.plugin(toJSONPlugin);

const app = require("./app.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABSE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("App is runing on http://localhost:3000");
});
