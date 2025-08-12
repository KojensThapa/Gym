const Gym = require('../Modals/gym');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
// const { findOne } = require('../Modals/member');

exports.register = async (req, res) => {
    try {
        const { userName, email, gymName, profilePic, password } = req.body;

        const isExist = await Gym.findOne({ userName });

        if (isExist) {
            return res.status(400).json({
                error: "User already exists. Try another username."
            });
        }

        const newGym = new Gym({
            userName,
            email,
            gymName,
            profilePic,
            password // hashing after validation
        });

        // Will trigger validation before saving
        await newGym.validate();

        const hashPassword = await bcrypt.hash(password, 10);
        newGym.password = hashPassword;

        await newGym.save();
        

        res.status(201).json({
            message: "User created successfully.",
            success: "yes",
            data: newGym
        });
        

    } catch (error) {
        // Handle Mongoose ValidationError
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(" ") });
        }

        // Other errors
        res.status(500).json({ error: "Server error." });
    }
};



const cookieOption = {
    httpOnly: true,
    secure: false, // set true in the production
    sameSite: 'Lax'

}

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        console.log(userName, password);
        const gym = await Gym.findOne({ userName});
        if (gym && await bcrypt.compare(password, gym.password) ) {

            const token = jwt.sign({gym_id: gym._id}, process.env.JWT_SecretKey);

            res.cookie("cookie_token", token, cookieOption);

            // console.log("Token: ", token);
            
            res.status(201).json({ message: "Login Sucessfully.", sucess: "Yes", gym, token});

        } else {
            res.status(400).json({ error: "Invalid creditials."})
        }

    } catch (error) {
        res.status(500).json({ error: 'Server Error.' })
    }
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

exports.sendOtp = async(req, res) => {
    try {
        const { email } = req.body;
        
        // Basic email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Please provide a valid email address." });
        }

        const gym = await Gym.findOne({ email });

        if(gym) {
            // get random number using crypto
            const buffer = crypto.randomBytes(4); // get random bytes
            const token = buffer.readInt32BE(0) % 900000 + 100000; //module to get the 6 digits number
            console.log(token);

            gym.resetPasswordToken = token;
            gym.resetPasswordExpires = Date.now() + 3600000;

            try {
                await gym.save();
            } catch (saveError) {
                return res.status(500).json({ error: "Failed to save OTP." });
            }

            //for email sending 
            const mailOption = {
                from: process.env.SENDER_EMAIL, // Use the same email as in transporter
                to: email, // Use the email from req.body
                subject: 'Password Reset',
                text: `You requested a password reset. Your OTP is: ${token}`
            };

            transporter.sendMail(mailOption, (error, info) => {
                if(error) {
                    console.error('Email send error:', error);
                    res.status(500).json({ error: 'Failed to send OTP email.', errorMsg: error.message })
                } else {
                    res.status(200).json({ message: "OTP Sent to Your Email." })
                }
            });

        } else {
            res.status(400).json({ error: "Gym not found with given Email." })
        }

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: "Server Error.", details: error.message });
    }
}

exports.checkOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;
        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!gym) {
            return res.status(400).json({ error: 'Otp is invalid or has Expired.'});
        } 
        res.status(200).json({ message: 'OTP is sucessfully Verified.'})

    } catch (error) {
        res.status(500).json({error: 'Server Error.'})
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const gym = await Gym.findOne({email});
        if(!gym) {
            return res.status(400).json({ error: "Some Technical Error, Please try again."});
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        gym.password = hashPassword;
        gym.resetPasswordToken = undefined;
        gym.resetPasswordExpires = undefined;

        await gym.save();

        res.status(200).json({ message: 'Password reset Sucessfully.'})

    } catch (error) {
        res.status(500).json({error: 'Server Error.'})
    }
}

exports.checking = async (req, res) => {
    console.log("auth api calling");
}

exports.logout = async (req, res) => {
    res.clearCookie('cookie_token', cookieOption).json({ message: "Logout Sucessfully."});
}