MONGO_URI=mongodb+srv://lasyapaladugula_db_user:lasya1226@cluster0.36hjtsn.mongodb.net/vshop?retryWrites=true&w=majority&appName=Cluster0

const getMongoOptions = () => ({
  dbName: process.env.MONGO_DB_NAME || "vshop",
});

const isSrvDnsError = (error) =>
  error.message?.includes("querySrv") ||
  ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(error.code);

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const directUri = process.env.MONGO_URI_DIRECT;

  if (!primaryUri) {
    console.error("MongoDB connection error: MONGO_URI is missing in backend/.env");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(primaryUri, getMongoOptions());

    console.log(`MongoDB Connected: ${connection.connection.name}`);
  } catch (error) {
    if (primaryUri.startsWith("mongodb+srv://") && directUri && isSrvDnsError(error)) {
      console.warn(
        "MongoDB SRV DNS lookup failed. Retrying with MONGO_URI_DIRECT fallback..."
      );

      try {
        const connection = await mongoose.connect(directUri, getMongoOptions());

        console.log(`MongoDB Connected: ${connection.connection.name}`);
        return;
      } catch (directError) {
        console.error("MongoDB direct connection error:", directError.message);
        process.exit(1);
      }
    }

    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

JWT_SECRET=mysecretkey