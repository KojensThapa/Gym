const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    // },
    name: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
            return /^[A-Za-z\s]{3,15}$/.test(value);
        },
        message: 'Name must be 3–15 alphabetic characters only.'
    }
},
    // mobileNo: {
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function (value) {
    //       return /^\d{10}$/.test(value);
    //     },
    //     message: "Mobile number must be exactly 10 digits.",
    //   },
    // },
    mobileNo: {
  type: String,
  required: true,
  validate: {
    validator: function (value) {
      return /^98\d{8}$/.test(value);
    },
    message: "Mobile number must start with 98 and be exactly 10 digits.",
  },
},

    address: {
      type: String,
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "membership",
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gym",
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    lastPayment: {
      type: Date,
      default: new Date(),
    },
    nextBillDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const memberModel = mongoose.model("member", memberSchema);
module.exports = memberModel;
