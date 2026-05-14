const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
orderId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Order",
required: true,
},
method: {
type: String,
enum: ["COD", "ONLINE"],
required: true,
},
status: {
type: String,
default: "PENDING",
required: true,
},
transactionId: {
type: String,
},
}, {
timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);