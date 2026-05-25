const mongoose = require("mongoose");

const getMongoOptions = () => ({
  dbName: process.env.MONGO_DB_NAME || "vshop",
  serverSelectionTimeoutMS: 8000,
});

mongoose.set("bufferCommands", false);

const getMongoUri = (value) => String(value || "").trim();

const hasPlaceholderPassword = (uri) =>
  uri.includes("<db_password>") || uri.includes("%3Cdb_password%3E");

const isSrvDnsError = (error) =>
  error.message?.includes("querySrv") ||
  ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(error.code);

const connectDB = async ({ exitOnFailure = true } = {}) => {
  const primaryUri = getMongoUri(process.env.MONGO_URI);
  const directUri = getMongoUri(process.env.MONGO_URI_DIRECT);

  if (!primaryUri) {
    const error = new Error("MongoDB connection error: MONGO_URI is missing in backend/.env");
    console.error(error.message);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }

  if (hasPlaceholderPassword(primaryUri)) {
    const error = new Error("MongoDB connection error: replace <db_password> in backend/.env with the real Atlas database password");
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
