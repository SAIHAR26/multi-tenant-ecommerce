const mongoose = require("mongoose");
require("dotenv").config();

const Store = require("../models/Store");
const User = require("../models/User");

const emptyBusiness = {
  gstNumber: "",
  businessRegistrationNumber: "",
  businessType: "",
  businessAddress: "",
  businessDocuments: [],
  panNumber: "",
};

const mergeBusiness = (...sources) =>
  sources.reduce(
    (merged, source = {}) => ({
      gstNumber: merged.gstNumber || source.gstNumber || "",
      businessRegistrationNumber:
        merged.businessRegistrationNumber || source.businessRegistrationNumber || "",
      businessType: merged.businessType || source.businessType || "",
      businessAddress: merged.businessAddress || source.businessAddress || "",
      businessDocuments:
        merged.businessDocuments.length > 0
          ? merged.businessDocuments
          : Array.isArray(source.businessDocuments)
            ? source.businessDocuments
            : [],
      panNumber: merged.panNumber || source.panNumber || "",
    }),
    { ...emptyBusiness }
  );

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const vendors = await User.find({ role: "vendor" });
  let updated = 0;

  for (const vendor of vendors) {
    let store = await Store.findOne({ vendorId: vendor._id }).sort({ createdAt: -1 });
    const business = mergeBusiness(vendor.business, store?.business);

    if (!store) {
      store = await Store.create({
        vendorId: vendor._id,
        storeName: vendor.store?.name || vendor.name,
        storeCategory: vendor.store?.category || "Marketplace",
        storeDescription: `${vendor.store?.name || vendor.name} on V SHOP`,
        location: vendor.location || "",
        business,
      });
      vendor.store = {
        ...(vendor.store?.toObject ? vendor.store.toObject() : vendor.store || {}),
        storeId: store._id,
        name: vendor.store?.name || store.storeName,
        category: vendor.store?.category || store.storeCategory,
      };
    } else {
      store.business = business;
      await store.save();
    }

    vendor.business = business;
    await vendor.save();
    updated += 1;
  }

  console.log(`Synchronized business information for ${updated} vendors.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
