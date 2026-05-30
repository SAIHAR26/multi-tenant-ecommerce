const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = mongoose.connection.db.admin();
  const { databases } = await admin.listDatabases();
  const results = [];

  for (const database of databases) {
    const db = mongoose.connection.client.db(database.name);
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      if (!["users", "stores", "vendors"].includes(collection.name)) continue;

      const docs = db.collection(collection.name);
      const total = await docs.countDocuments();
      const vendorRoleCount = await docs.countDocuments({ role: "vendor" });
      const vendorLikeCount = await docs.countDocuments({
        $or: [
          { role: "vendor" },
          { role: /vendor/i },
          { "store.name": { $exists: true, $ne: "" } },
          { storeName: { $exists: true, $ne: "" } },
        ],
      });

      results.push({
        database: database.name,
        collection: collection.name,
        total,
        vendorRoleCount,
        vendorLikeCount,
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
