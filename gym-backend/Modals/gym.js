const mongoose = require('mongoose');
const dns = require('dns');

const gymSchema = new mongoose.Schema({
    // email: {
    //     type: String,
    //     required: true,
    //     match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    // },
  

email: {
  type: String,
  required: true,
  validate: {
    validator: function (email) {
      // Basic format check first
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return false;
      }

      // Extract domain from email
      const domain = email.split('@')[1];

      // Return a promise that resolves true/false for MX records
      return new Promise((resolve) => {
        dns.resolveMx(domain, (err, addresses) => {
          if (err || addresses.length === 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },
    message: 'Email domain does not exist or has no MX records.'
  }
},
    // userName: {
    //     type: String,
    //     unique: true,
    //     required: true,
    // },
   userName: {
    type: String,
    unique: true,
    required: true,
    validate: {
        validator: function (value) {
            // Check length
            if (typeof value !== 'string' || value.length < 3 || value.length > 15) {
                return false;
            }

            // Reject if all characters are digits
            if (/^\d+$/.test(value)) {
                return false;
            }

            // Reject if contains special symbols
            if (/[^A-Za-z0-9_ ]/.test(value)) {
                return false;
            }

            return true;
        },
        message: 'Username must be String between 3 to 15 character.'
    }
},


    password: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
            const errors = [];

            if (value.length < 6 ) {
                errors.push("Password at least 6 character.");
            }
            if (!/[A-Z]/.test(value)) {
                errors.push("Password must have at least one uppercase letter.");
            }
            if (!/[a-z]/.test(value)) {
                errors.push("Password must have at least one lowercase letter.");
            }
            if (!/\d/.test(value)) {
                errors.push("Password must have at least one number.");
            }
            const specialChars = (value.match(/[!@#$%^&*]/g) || []);
            if (specialChars.length < 2) {
                errors.push("Password must have at least two special characters (!@#$%^&*).");
            }

            if (errors.length > 0) {
                // This causes validation error on .save()
                throw new Error(errors.join(' '));
            }

            return true;
        }
    }
}
,
    profilePic: {
        type: String,
        required: true
    },
    // gymName: {
    //     type: String,
    //     required: true,
    // },
    gymName: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
        // Only letters (uppercase/lowercase) and spaces, 3 to 30 characters
        return /^[A-Za-z\s]{3,30}$/.test(value);
        },
        message: 'Invalid Gym Name. Only String ok!'
    }
    },

    resetPasswordToken: {
        type: String,
        // required: true,
    },
    resetPasswordExpires: {
        type: Date,
    }
},{timestamps: true})

const modal = mongoose.model("gym", gymSchema);
module.exports = modal;