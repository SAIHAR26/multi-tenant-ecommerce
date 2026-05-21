const mongoose = require("mongoose");

const getMongoOptions = () => ({
  dbName: process.env.MONGO_DB_NAME || "vshop",
});

const isSrvDnsError = (error) =>
  error.message?.includes("querySrv") ||
  ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(error.code);

const connectDB = async ({ exitOnFailure = true } = {}) => {
  const primaryUri = process.env.MONGO_URI;
  const directUri = process.env.MONGO_URI_DIRECT;

  if (!primaryUri) {
    const error = new Error("MongoDB connection error: MONGO_URI is missing in backend/.env");
    console.error(error.message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }

  try {
    const connection = await mongoose.connect(primaryUri, getMongoOptions());

    console.log(`MongoDB Connected: ${connection.connection.name}`);
  } catch (error) {
    if (primaryUri.startsWith("mongodb+srv://") && directUri && isSrvDnsError(error)) {
      console.warn("MongoDB SRV DNS lookup failed. Retrying with MONGO_URI_DIRECT fallback...");

      try {
        const connection = await mongoose.connect(directUri, getMongoOptions());

        console.log(`MongoDB Connected: ${connection.connection.name}`);
        return;
      } catch (directError) {
        console.error("MongoDB direct connection error:", directError.message);

        if (exitOnFailure) {
          process.exit(1);
        }

        throw directError;
      }
    }

    console.error("MongoDB connection error:", error.message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;
