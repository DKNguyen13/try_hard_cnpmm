import express, { Application } from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/configdb";
import db from "./models";
import "dotenv/config";

const app: Application = express();

// Config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config view engine
viewEngine(app);

// Init web routes
initWebRoutes(app);

// Connect to DB
connectDB()
  .then(() => {
    // Sync models -> tạo bảng nếu chưa có
    db.sequelize
      .sync({ alter: true }) // { force: true } nếu muốn drop & tạo lại
      .then(() => {
        console.log("All models were synchronized successfully.");
      })
      .catch((err: unknown) => {
        console.error("Error syncing models:", err);
      });
  })
  .catch((err: unknown) => {
    console.error("Unable to connect to DB:", err);
  });

const port: number = parseInt(process.env.PORT || "8088", 10);

app.listen(port, () => {
  console.log(`Backend Nodejs is running on the port: ${port}`);
});
