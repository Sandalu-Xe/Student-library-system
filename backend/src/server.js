import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import seedDatabase from "./utils/seeder.js";

dotenv.config();

const port = process.env.PORT || 5001;

await connectDB();
await seedDatabase();

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

