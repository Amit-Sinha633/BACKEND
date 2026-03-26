import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connection = async () => {
  try {
    const mongoConnect = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("Something went wrong while connection");
  }
};

export default connection;
