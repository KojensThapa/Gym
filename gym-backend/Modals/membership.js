const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  months: {
    type: Number,
    required: true,
    min: [1, 'Months must be at least 1'],
    max: [12, 'Months cannot be more than 12']
  },
  price: {
    type: Number,
    required: true,
    min: [1, 'Price must be greater than 0']
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'gym',
    required: true
  }
}, { timestamps: true }); // corrected: use `timestamps`, not `time`

const modalMemberShip = mongoose.model('membership', MembershipSchema);
module.exports = modalMemberShip;
