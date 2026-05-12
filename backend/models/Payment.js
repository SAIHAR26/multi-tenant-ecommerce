const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
orderId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Order",
},
method: {
type: String,
enum: ["COD", "ONLINE"],
},
status: {
type: String,
default: "PENDING",
},
transactionId: {
type: String,
},
});
module.exports = mongoose.model("Payment", paymentSchema);