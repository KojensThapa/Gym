const Membership = require('../Modals/membership')

exports.addMemberShip = async (req, res) => {
  try {
    const { months, price } = req.body;

    const memberShip = await Membership.findOne({ gym: req.gym._id, months });

    if (memberShip) {
      memberShip.price = price;
      await memberShip.validate(); // Validate manually before saving
      await memberShip.save();
      res.status(200).json({ message: "Updated Successfully." });
    } else {
      const newMembership = new Membership({ price, months, gym: req.gym._id });
      await newMembership.save();
      res.status(200).json({ message: "Added Successfully." });
    }

  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(' ') });
    }

    console.log(error);
    res.status(500).json({ error: 'Server Error.' });
  }
};


exports.getmembership = async (req, res) => {
    try {
        console.log("getmemberhsip api is calling")
        const loggedInid = req.gym._id;
        const memberShip = await Membership.find({gym:loggedInid});
        res.status(200).json({
            message: "Membership fetched Successfully.",
            membership: memberShip
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server Error.'
        })
    }
}

// DELETE /membership/:id
exports.deleteMembership = async (req, res) => {
  try {
    console.log("deleteMembership is calling")
    const membershipId = req.params.id;

    const deleted = await Membership.findOneAndDelete({
      _id: membershipId,
      gym: req.gym._id, // ensures gym can only delete their own memberships
    });

    if (!deleted) {
      return res.status(404).json({ error: "Membership not found." });
    }

    res.status(200).json({ message: "Membership deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error." });
  }
};
