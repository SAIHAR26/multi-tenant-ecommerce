const mongoose = require("mongoose");

const getMongoOptions = () => ({
  dbName: process.env.MONGO_DB_NAME || "vshop",
});

const isSrvDnsError = (error) =>
  error.message?.includes("querySrv") ||
  ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(error.code);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      getMongoOptions()
    );

    console.log("MongoDB Connected");

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;