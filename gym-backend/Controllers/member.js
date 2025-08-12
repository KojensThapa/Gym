const Member = require('../Modals/member');
const Membership = require('../Modals/membership')

exports.getAllMember = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const members = await Member.find({ gym: req.gym._id });
        const totalMember = members.length;

        const limitedMembers = await Member.find({ gym: req.gym._id }).sort({ createdAt: -1 }).skip(skip).limit(limit); // .sort({createdAt}) it helps to show the recent add member in the top ok!!
        res.status(200).json({
            message: members.length ? "Fetched Successfully Memebers." : "No any Member Register Yet.",
            members: limitedMembers,
            totalMembers: totalMember
        })
    } catch (error) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}

function addMonthsToDate(months, joiningDate) {
    //get current year, months and day
    let today = joiningDate;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // months are 0 indexed
    const currentDay = today.getDate();

    //calculate the new year and months
    const futureMonth = currentMonth + months;
    const futureYear = currentYear + Math.floor(futureMonth / 12);

    // calculate the correct future months (modules for months)
    const adjustedMonth = futureMonth % 12;

    //set the date to the first of the future month
    const futureDate = new Date(futureYear, adjustedMonth, 1);

    //get the last day of the future month
    const lastDayOfFutureMonth = new Date(futureYear, adjustedMonth + 1, 0).getDate();

    //Adjust the day if current day exceeds the number of days in the new month
    const adjustedDay = Math.min(currentDay, lastDayOfFutureMonth);

    //Set the final adjust day
    futureDate.setDate(adjustedDay);

    return futureDate;
}

// function addMonthsToDate(months, joiningDate) {
//     // Create a new date to avoid modifying the original
//     const result = new Date(joiningDate);

//     // Get the current day (to handle month-end cases)
//     const currentDay = result.getDate();

//     // Add the months directly
//     result.setMonth(result.getMonth() + months);

//     // Handle month overflow (e.g., Jan 31 + 1 month = Feb 28/29)
//     if (result.getDate() !== currentDay) {
//         // The day overflowed (e.g., Jan 31 → March 3 instead of Feb 28)
//         // Move back to the last day of the correct month
//         result.setDate(0); // Sets to last day of previous month
//     }

//     return result;
// }

// exports.registerMember = async (req, res) => {
//     try {
//         const { name, mobileNo, address, membership, profilePic, joiningDate } = req.body;
//         const member = await Member.findOne({ gym: req.gym._id, mobileNo });
//         if (member) {
//             return res.status(409).json({ error: "Already registered with this Mobile No." });
//         }

//         const memberShip = await Membership.findOne({ gym: req.gym._id, _id: membership });
//         const membershipMonth = memberShip.months;
//         if (memberShip) {
//             let jngDate = new Date(joiningDate);
//             const nextBillDate = addMonthsToDate(membershipMonth, jngDate);
//             console.log(nextBillDate)
//             let newmember = new Member({ name, mobileNo, address, membership, gym: req.gym._id, profilePic, nextBillDate, lastPayment: joiningDate });

//             console.log(newmember)
//             await newmember.save();

//             res.status(200).json({ message: "Member Register Successfully." });

//         } else {
//             return res.status(409).json({ error: "No such kind of Membership is avaible." })
//         }


//     } catch (error) {
//         res.status(500).json({
//             error: "Server Error."
//         })
//     }
// }

exports.registerMember = async (req, res) => {
  try {
    const { name, mobileNo, address, membership, profilePic, joiningDate } = req.body;

    // ✅ If no date provided, use today's date
    let joining = joiningDate ? new Date(joiningDate) : new Date();
    joining.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Date must be today only (not past or future)
    if (joining.getTime() !== today.getTime()) {
      return res.status(400).json({ error: "Invalid Joining date." });
    }

    // ✅ Check if mobile number already exists
    const member = await Member.findOne({ gym: req.gym._id, mobileNo });
    if (member) {
      return res.status(409).json({ error: "Already registered with this Mobile No." });
    }

    // ✅ Validate membership exists
    const memberShip = await Membership.findOne({ gym: req.gym._id, _id: membership });
    if (!memberShip) {
      return res.status(409).json({ error: "No such kind of Membership is available." });
    }

    // ✅ Calculate next bill date
    const membershipMonth = memberShip.months;
    const nextBillDate = addMonthsToDate(membershipMonth, joining);

    const newmember = new Member({
      name,
      mobileNo,
      address,
      membership,
      gym: req.gym._id,
      profilePic,
      nextBillDate,
      lastPayment: joining,
    });

    await newmember.save();
    res.status(200).json({ message: "Member Registered Successfully." });

  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages[0] });
    }

    console.error(error);
    return res.status(500).json({ error: "Server Error." });
  }
};




// exports.searchMembers = async (req, res) => {
//     try {
//         const { searchTerm } = req.query;
//         // console.log('Gym Id', req.gym._id)
//         const member = await Member.find({
//             gym: req.gym._id,
//             $or: [{ name: { $regex: '^' + searchTerm, $options: 'i' } },
//             { mobileNo: { $regex: '^' + searchTerm, $options: 'i' } }
//             ]
//         });
//         // if (member.length === 0) {
//         //     return res.status(404).json({ error: 'No data available.' });
//         // }

//         res.status(200).json({
//             message: member.length ? 'Member fetched Sucessfully' : 'No such member Registered yet.',
//             members: member,
//             totalMember: member.length
//         })

//     } catch (error) {
//         res.status(500).json({
//             error: 'Server Error.'
//         })
//     }
// }


//Linear algorithm is used here
exports.searchMembers = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        // Fetch all members of the gym
        const allMembers = await Member.find({ gym: req.gym._id });

        // Convert search term to lowercase for case-insensitive search
        const lowerSearch = searchTerm.toLowerCase();

        //linear search
        const matchedMembers = allMembers.filter(member =>
            member.name.toLowerCase().startsWith(lowerSearch) ||
            member.mobileNo.toLowerCase().startsWith(lowerSearch)
        );
        
        //Send response
        res.status(200).json({
            message: matchedMembers.length ? 'Member fetched Successfully' : 'No such member Registered yet.',
            members: matchedMembers,
            totalMember: matchedMembers.length
        });

    } catch (error) {
        res.status(500).json({
            error: 'Server Error.'
        });
    }
};


exports.monthlyMember = async (req, res) => {
    try {
        const now = new Date();

        //using this Get the first day of the month (eg: 2024-11-30 00:00:00)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        //using this get the last day of the month  (eg: 2024-09-31 23:59:59)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const member = await Member.find({
            gym: req.gym._id,
            createdAt: {
                $gte: startOfMonth, //greater than or equal to first day of the month
                $lte: endOfMonth //less than or equal to last day of the month
            }
        }).sort({ createdAt: -1 }); // this is usally sort the currently registered at the top okk

        res.status(200).json({
            message: member.length ? 'Fetch Member Sucessfully.' : 'No any memeber is register in this month',
            members: member,
            totalMember: member.length
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error.' })
    }
}




// exports.expireWithin3Days = async (req, res) => {
//     try {
//         console.log("api within 3 days")
//         const today = new Date();
//         const nextThreeDays = new Date();
//         nextThreeDays.setDate(today.getDate() + 3);

//         const member = await Member.find({
//             gym: req.gym._id,
//             nextBillDate: {
//                 $gte: today,
//                 $lte: nextThreeDays
//             }
//         })

//         res.status(200).json({
//             message: member.length ? 'Fetch member Sucessfully which will expire in 3 days.' : "No Member is expiring in 3 days.",
//             members: member,
//             totalMembers: member.length
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Server Error.' })

//     }
// }

// linear search algorithm
exports.expireWithin3Days = async (req, res) => {
    try {
        console.log("API called: expireWithin3Days");

        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() + 3);

        // Step 1: Fetch all gym members
        const allMembers = await Member.find({ gym: req.gym._id });

        // Step 2: Filter using JS (algorithmic way)
        const expiringMembers = allMembers.filter(member => {
            const nextBillDate = new Date(member.nextBillDate);
            return nextBillDate >= today && nextBillDate <= nextThreeDays;
        });

        // Step 3: Send response
        res.status(200).json({
            message: expiringMembers.length
                ? 'Fetched members expiring within 3 days.'
                : 'No members are expiring in the next 3 days.',
            members: expiringMembers,
            totalMembers: expiringMembers.length
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error.' });
    }
};




// exports.expreWithin4To7Days = async (req, res) => {
//     try {
//         const today = new Date();
//         const next4Days = new Date();
//         next4Days.setDate(today.getDate() + 4);

//         const next7Days = new Date();
//         next7Days.setDate(today.getDate() + 7);

//         const member = await Member.find({
//             gym: req.gym._id,
//             nextBillDate: {
//                 $gte: next4Days,
//                 $lte: next7Days
//             }
//         });

//         res.status(200).json({
//             message: member.length? "Member Expire with in 4 to 7 Days fetch sucessfully.": "There is no any memeber which  is expire with in 4 to 7 Days.",
//             members: member,
//             totalMember: member.length
//         })
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Server Error." })
//     }
// }



// Linear search algorithm. 
exports.expreWithin4To7Days = async (req, res) => {
    try {
        console.log("API called: expireWithin4To7Days");

        const today = new Date();

        // Calculate date 4 and 7 days from today
        const next4Days = new Date();
        next4Days.setDate(today.getDate() + 4);

        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);

        // Step 1: Fetch all members from DB
        const allMembers = await Member.find({ gym: req.gym._id });

        // Step 2: Manual filtering using linear search
        const filteredMembers = allMembers.filter(member => {
            const billDate = new Date(member.nextBillDate);
            return billDate >= next4Days && billDate <= next7Days;
        });

        // Step 3: Send response
        res.status(200).json({
            message: filteredMembers.length
                ? "Members expiring within 4 to 7 days fetched successfully."
                : "No member is expiring within 4 to 7 days.",
            members: filteredMembers,
            totalMember: filteredMembers.length
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error." });
    }
};

exports.expiredMember = async(req, res) => {
    try {
        const today = new Date();

        const member = await Member.find({ gym: req.gym._id, status: "Active", 
            nextBillDate: {
                $lt: today
            }
        });

        res.status(200).json({
            message: member.length? "Expired member fetch sucessfully.": "There is no any Expired Member.",
            members: member,
            totalMember: member.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error.")
    }
}

exports.inactiveMember = async(req, res) => {
    try {
        const today = new Date();
        const member = await Member.find({ gym: req.gym._id, status: "Pending"});

        res.status(200).json({
            message: member.length? "Inactive member fetched sucessfully.": "There is no such inactive memeber.",
            members: member,
            totalMember: member.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error"})
    }
}


exports.getMembersDetails = async(req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findOne({ _id: id, gym: req.gym._id });

        if(!member) {  // Changed from !member.length to !member
            return res.status(404).json({  
                error: 'No member found with this id.'
            });
        }

        res.status(200).json({
            message: "Data fetched successfully.",
            member: member  
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error.' });
    }
}


exports.statusChange = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const member = await Member.findOne({ _id: id, gym: req.gym._id});

        if(!member) {
            return res.status(404).json({
                error: 'Not found any Member with this id.'
            })
        }

        member.status = status;
        await member.save();

        res.status(200).json({
            message: "Updated Status sucessfully.",
            memebers: member
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error.'})
    }
}


exports.updateMemberPlan = async(req, res) =>{
    try {
        const {id} = req.params;
        const { membership } = req.body;

        const memberShip = await Membership.findOne({ gym: req.gym._id, _id:membership});

        if(memberShip) {
            let getmonth = memberShip.months;
            let today = new Date();
            let nextBillDate = addMonthsToDate(getmonth, today);

            const member = await Member.findOne({ gym:req.gym._id, _id:id })
            if(member){
                member.nextBillDate = nextBillDate;
                member.lastPayment = today;

                await member.save();

                res.status(200).json({
                    message: "Update membership plan sucessfully.",
                    member: member
                })
            } else {
                return res.status(409).json({ error: "Not found the member"})
            }

        } else {
            return res.status(409).json({ error: " No such Data is found with this membership id."})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error.'})
    }

}