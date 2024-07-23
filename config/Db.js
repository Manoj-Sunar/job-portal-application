import mongoose from "mongoose";

const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.DBC_STRING);
    console.log("database connection successfully");
  } catch (error) {
    console.log(`MongoDb Database connectivity error`);
  }
};

export default ConnectDb;
