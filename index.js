import express from "express";
import connection from "./src/db/user.db.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./src/routes/user.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://desunlearnanderan.netlify.app/"
    ],

    credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.get('/', (req,res)=>{
  res.send("ohh Lovely")
});
app.use("/app/v1/Learn", router);
const Port = process.env.PORT || 8000;
connection();
app.listen(Port, () => {
  console.log(`this is my localhost ${Port}`);
});
