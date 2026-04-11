import express from "express";
import "./src/utils/cron.js"
import connection from "./src/db/user.db.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./src/routes/user.route.js";
import contestRouter from "./src/routes/admin.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: ["https://frontend-desun-learn-and-eran.onrender.com",
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"]
}));

app.get('/', (req,res)=>{
  res.send("Hello everyone!!")
});


app.use("/app/v1/Learn", router);
app.use("/app/v1/Admin", contestRouter)

const Port = process.env.PORT || 8000;

connection();
app.listen(Port, () => {
  console.log(`this is my localhost ${Port}`);
});

