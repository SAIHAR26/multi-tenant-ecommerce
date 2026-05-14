const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
vendorId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
storeName: {
type: String,
required: true,
}, 
storeDescription: {
type: String,
required: true,
},
storeCategory: {
type: String,
required: true,
},
storeLogo: {
type: String,
},
storeBanner: {
type: String,
},
location: {
type: String,
required: true,
},
}, {
timestamps: true
});

module.exports = mongoose.model("Store", storeSchema);