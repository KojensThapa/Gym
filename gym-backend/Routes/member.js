const express = require('express');
const router = express.Router();
const MemberController = require('../Controllers/member');
const auth = require('../Auth/auth')

router.get('/all-member', auth, MemberController.getAllMember)
router.post('/register-member', auth, MemberController.registerMember)

router.get('/search-member', auth, MemberController.searchMembers)
router.get('/monthlyMember', auth, MemberController.monthlyMember)
router.get('/expire-within-3-days', auth, MemberController.expireWithin3Days)
router.get('/exipred-within-4-7-days', auth, MemberController.expreWithin4To7Days)
router.get('/expired-member', auth, MemberController.expiredMember)
router.get('/inactive-member', auth, MemberController.inactiveMember)

router.get('/get-member/:id', auth, MemberController.getMembersDetails)
router.post("/status-change/:id", auth, MemberController.statusChange)
router.put("/update-member-plan/:id", auth, MemberController.updateMemberPlan)


module.exports = router;
