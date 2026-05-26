const seedDatabase = require("./seedDatabase");

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
