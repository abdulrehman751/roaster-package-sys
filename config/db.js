import mongoose from "mongoose";

const connectDB = async () => {
  try {
       console.log("🔌 Connecting to:", process.env.MONGO_URL); // Debug
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // stop process if connection fails
  }
};

export default  connectDB;
