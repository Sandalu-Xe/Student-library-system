import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log("Attempting to connect to MongoDB Atlas...");
      mongoose.set("strictQuery", true);
      // Wait max 5 seconds before timeout to fail quickly if blocked
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB connected successfully to Atlas!");
      return;
    } catch (error) {
      console.warn("Failed to connect to MongoDB Atlas. Error:", error.message);
      console.warn("Falling back to local MongoMemoryServer...");
    }
  }

  console.log("Starting MongoMemoryServer...");
  mongoServer = await MongoMemoryServer.create();
  mongoUri = mongoServer.getUri();

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected locally to In-Memory DB: ${mongoUri}`);
};

export default connectDB;
