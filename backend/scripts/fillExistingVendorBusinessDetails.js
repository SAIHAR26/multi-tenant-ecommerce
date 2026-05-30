const mongoose = require("mongoose");
require("dotenv").config();

const Store = require("../models/Store");
const User = require("../models/User");

const vendorBusinessDetails = {
  "fashionhub@gmail.com": {
    phone: "+91 98765 12001",
    location: "Hyderabad",
    store: {
      name: "Fashion Hub",
      category: "Fashion",
      bankDetails: "Fashion Hub Retail, A/C 54821009321, IFSC HDFC0004321",
    },
    business: {
      gstNumber: "36AAFCF4821K1Z8",
      businessRegistrationNumber: "TS-HYD-FH-2024-1187",
      businessType: "Private Limited",
      businessAddress: "Plot 42, Jubilee Hills Road No. 10, Hyderabad, Telangana 500033",
      panNumber: "AAFCF4821K",
      businessDocuments: [
        "fashion-hub-gst-certificate.pdf",
        "fashion-hub-pan-card.pdf",
        "fashion-hub-registration-certificate.pdf",
      ],
    },
  },
  "urbanwear@gmail.com": {
    phone: "+91 98765 12002",
    location: "Bangalore",
    store: {
      name: "Urban Wear",
      category: "Clothing",
      bankDetails: "Urban Wear Traders, A/C 77291004566, IFSC ICIC0002845",
    },
    business: {
      gstNumber: "29AAUCU9135L1Z3",
      businessRegistrationNumber: "KA-BLR-UW-2024-2094",
      businessType: "Limited Liability Partnership",
      businessAddress: "No. 18, Brigade Road, Ashok Nagar, Bengaluru, Karnataka 560001",
      panNumber: "AAUCU9135L",
      businessDocuments: [
        "urban-wear-gst-certificate.pdf",
        "urban-wear-pan-card.pdf",
        "urban-wear-registration-certificate.pdf",
      ],
    },
  },
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let updated = 0;

  for (const [email, details] of Object.entries(vendorBusinessDetails)) {
    const vendor = await User.findOne({ email, role: "vendor" });
    if (!vendor) continue;

    vendor.phone = vendor.phone || details.phone;
    vendor.location = vendor.location || details.location;
    vendor.store = {
      ...(vendor.store?.toObject ? vendor.store.toObject() : vendor.store || {}),
      ...details.store,
    };
    vendor.business = details.business;

    const store = await Store.findOneAndUpdate(
      { vendorId: vendor._id },
      {
        storeName: details.store.name,
        storeCategory: details.store.category,
        storeDescription: `${details.store.name} premium seller profile`,
        location: details.location,
        business: details.business,
      },
      { returnDocument: "after", upsert: true, runValidators: true }
    );

    vendor.store.storeId = store._id;
    await vendor.save();
    updated += 1;
  }

  console.log(`Filled business details for ${updated} existing vendors.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
