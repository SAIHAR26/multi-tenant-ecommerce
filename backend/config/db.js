const mongoose = require("mongoose");

const getMongoOptions = () => ({
  dbName: process.env.MONGO_DB_NAME || "vshop",
  serverSelectionTimeoutMS: 8000,
});

mongoose.set("bufferCommands", false);

const getMongoUri = (value) => String(value || "").trim();

const hasPlaceholderPassword = (uri) =>
  uri.includes("<db_password>") || uri.includes("%3Cdb_password%3E");

const connectDB = async ({ exitOnFailure = true } = {}) => {
  const mongoUri = getMongoUri(process.env.MONGO_URI);

  if (!mongoUri) {
    const error = new Error("MongoDB connection error: MONGO_URI is missing in backend/.env");
    console.error(error.message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }

  if (hasPlaceholderPassword(mongoUri)) {
    const error = new Error("MongoDB connection error: replace <db_password> in backend/.env with the real Atlas database password");
    console.error(error.message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }

  try {
    const connection = await mongoose.connect(mongoUri, getMongoOptions());

    console.log(`MongoDB Connected: ${connection.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;
