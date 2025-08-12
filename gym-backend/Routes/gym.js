const express = require('express');
const router = express.Router();
const gymController = require("../Controllers/gym")
const auth = require('../Auth/auth')

router.post('/register', gymController.register);
router.post('/login', gymController.login);
router.post('/reset-password/sendOtp', gymController.sendOtp);
router.post('/reset-password/checkOtp', gymController.checkOtp);
router.post('/resetPassword', gymController.resetPassword);

router.get('/checking', auth, gymController.checking);

module.exports = router;

