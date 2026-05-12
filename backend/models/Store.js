const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema({
vendorId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
storeName: {
type: String,
required: true,
},
storeDescription: {
type: String,
},
storeCategory: {
type: String,
},
storeLogo: {
type: String,
},
storeBanner: {
type: String,
},
location: {
type: String,
},
});
module.exports = mongoose.model("Store", storeSchema);