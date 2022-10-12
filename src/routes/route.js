const express = require("express");
let auth = require("../services/auth_service");
const router = express.Router();
let asyncMiddleware = require("./../services/async_middleware");

const staffAPI = require("../controllers/staff");
// const upload = require("../middleware/upload");

/////////////////////////////////// Staff API ////////////////////////////////////////////

router.post(
  "/api/staff/new/add",
  //   upload.single("avatar"),
  staffAPI.addStaffMember
); // add new staff menber

router.post("/api/staff/get_all", auth, staffAPI.getStaffMembers); // get all staff members

 router.put("/api/staff/update/:id", auth,  staffAPI.updateStaffMember); // update staff member

router.delete("/api/staff/delete/:id", auth,  staffAPI.deleteStaffMember); // delete user user

router.post("/api/staff/login", staffAPI.loging); // login

router.post("/api/staff/send_otp/:id", staffAPI.sendOtp); // delete user user

router.post("/api/staff/email_verification/:id", staffAPI.emailVerification); // email verification

router.post("/api/staff/reset_password", staffAPI.resetPassword); // reset password

module.exports = router;
