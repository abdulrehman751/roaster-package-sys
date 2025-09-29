import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URL,"jygjhgjgjkhjhfggh");
    
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDb Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
export default connectDB;