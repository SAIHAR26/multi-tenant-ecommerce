const mongoose = require("mongoose");
require("dotenv").config();

const Store = require("../models/Store");
const User = require("../models/User");

const businessProfiles = [
  {
    email: "vendor1@gmail.com",
    gstNumber: "36ABHCS1201K1Z5",
    registration: "TS-HYD-SS-2024-1201",
    type: "Private Limited",
    address: "Plot 18, Banjara Hills Road No. 12, Hyderabad, Telangana 500034",
    pan: "ABHCS1201K",
    documents: ["sole-sprint-gst-certificate.pdf", "sole-sprint-pan-card.pdf", "sole-sprint-registration.pdf"],
  },
  {
    email: "vendor2@gmail.com",
    gstNumber: "27ABHDD1202L1Z6",
    registration: "MH-MUM-DD-2024-1202",
    type: "Partnership",
    address: "Shop 204, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    pan: "ABHDD1202L",
    documents: ["denim-district-gst-certificate.pdf", "denim-district-pan-card.pdf", "denim-district-registration.pdf"],
  },
  {
    email: "vendor3@gmail.com",
    gstNumber: "29ABHCC1203M1Z7",
    registration: "KA-BLR-CC-2024-1203",
    type: "Limited Liability Partnership",
    address: "No. 42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    pan: "ABHCC1203M",
    documents: ["core-cotton-gst-certificate.pdf", "core-cotton-pan-card.pdf", "core-cotton-registration.pdf"],
  },
  {
    email: "vendor4@gmail.com",
    gstNumber: "07ABHFH1204N1Z8",
    registration: "DL-NDL-FH-2024-1204",
    type: "Private Limited",
    address: "Unit 12, Connaught Place, New Delhi, Delhi 110001",
    pan: "ABHFH1204N",
    documents: ["formal-house-gst-certificate.pdf", "formal-house-pan-card.pdf", "formal-house-registration.pdf"],
  },
  {
    email: "vendor5@gmail.com",
    gstNumber: "33ABHTP1205P1Z2",
    registration: "TN-CHN-TP-2024-1205",
    type: "Proprietorship",
    address: "28 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu 600086",
    pan: "ABHTP1205P",
    documents: ["trail-pack-co-gst-certificate.pdf", "trail-pack-co-pan-card.pdf", "trail-pack-co-registration.pdf"],
  },
  {
    email: "vendor6@gmail.com",
    gstNumber: "27ABHAO1206Q1Z3",
    registration: "MH-PUN-AO-2024-1206",
    type: "Private Limited",
    address: "Office 501, Baner Road, Pune, Maharashtra 411045",
    pan: "ABHAO1206Q",
    documents: ["audio-orbit-gst-certificate.pdf", "audio-orbit-pan-card.pdf", "audio-orbit-registration.pdf"],
  },
  {
    email: "vendor7@gmail.com",
    gstNumber: "32ABHWL1207R1Z4",
    registration: "KL-KOC-WL-2024-1207",
    type: "Limited Liability Partnership",
    address: "Marine Drive Commercial Complex, Kochi, Kerala 682031",
    pan: "ABHWL1207R",
    documents: ["wrist-lab-gst-certificate.pdf", "wrist-lab-pan-card.pdf", "wrist-lab-registration.pdf"],
  },
  {
    email: "vendor8@gmail.com",
    gstNumber: "08ABHLL1208S1Z9",
    registration: "RJ-JAI-LL-2024-1208",
    type: "Partnership",
    address: "MI Road Retail Plaza, Jaipur, Rajasthan 302001",
    pan: "ABHLL1208S",
    documents: ["lens-luxe-gst-certificate.pdf", "lens-luxe-pan-card.pdf", "lens-luxe-registration.pdf"],
  },
  {
    email: "vendor9@gmail.com",
    gstNumber: "33ABHAW1209T1Z1",
    registration: "TN-CHN-AW-2024-1209",
    type: "Private Limited",
    address: "T Nagar Fashion Street, Chennai, Tamil Nadu 600017",
    pan: "ABHAW1209T",
    documents: ["aurora-wardrobe-gst-certificate.pdf", "aurora-wardrobe-pan-card.pdf", "aurora-wardrobe-registration.pdf"],
  },
  {
    email: "vendor10@gmail.com",
    gstNumber: "27ABHVD1210U1Z5",
    registration: "MH-MUM-VD-2024-1210",
    type: "Proprietorship",
    address: "Phoenix Marketcity, Kurla West, Mumbai, Maharashtra 400070",
    pan: "ABHVD1210U",
    documents: ["velvet-dresses-gst-certificate.pdf", "velvet-dresses-pan-card.pdf", "velvet-dresses-registration.pdf"],
  },
  {
    email: "vendor11@gmail.com",
    gstNumber: "32ABHLL1211V1Z6",
    registration: "KL-KOC-LO-2024-1211",
    type: "Partnership",
    address: "Panampilly Nagar, Kochi, Kerala 682036",
    pan: "ABHLL1211V",
    documents: ["little-loom-gst-certificate.pdf", "little-loom-pan-card.pdf", "little-loom-registration.pdf"],
  },
  {
    email: "vendor12@gmail.com",
    gstNumber: "08ABHPP1212W1Z7",
    registration: "RJ-JAI-PP-2024-1212",
    type: "Private Limited",
    address: "C-Scheme Book Market, Jaipur, Rajasthan 302001",
    pan: "ABHPP1212W",
    documents: ["page-and-pine-gst-certificate.pdf", "page-and-pine-pan-card.pdf", "page-and-pine-registration.pdf"],
  },
];

const toBusiness = (profile) => ({
  gstNumber: profile.gstNumber,
  businessRegistrationNumber: profile.registration,
  businessType: profile.type,
  businessAddress: profile.address,
  panNumber: profile.pan,
  businessDocuments: profile.documents,
});

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || "vshop" });

  let updated = 0;

  for (const profile of businessProfiles) {
    const vendor = await User.findOne({ email: profile.email, role: "vendor" });
    if (!vendor) continue;

    const store = await Store.findOne({ vendorId: vendor._id });
    const business = toBusiness(profile);

    vendor.business = business;
    vendor.store = {
      ...(vendor.store?.toObject ? vendor.store.toObject() : vendor.store || {}),
      storeId: store?._id || vendor.store?.storeId,
      name: store?.storeName || vendor.store?.name || vendor.name,
      category: store?.storeCategory || vendor.store?.category || "Marketplace",
    };
    await vendor.save();

    if (store) {
      store.business = business;
      await store.save();
    }

    updated += 1;
  }

  console.log(`Filled business details for ${updated} existing vendors in ${mongoose.connection.name}.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
