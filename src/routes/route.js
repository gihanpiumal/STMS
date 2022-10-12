const express = require("express");
let auth = require("../services/auth_service");
const router = express.Router();
let asyncMiddleware = require("./../services/async_middleware");

const staffAPI = require("../controllers/staff");
const studentAPI = require("../controllers/student")
// const upload = require("../middleware/upload");

/////////////////////////////////// Staff API ////////////////////////////////////////////

router.post(
  "/api/staff/new/add",
  //   upload.single("avatar"),
  staffAPI.addStaffMember
); // add new staff menber

router.post("/api/staff/get_all", auth, staffAPI.getStaffMembers); // get all staff members

router.put("/api/staff/update/:id", auth, staffAPI.updateStaffMember); // update staff member

router.delete("/api/staff/delete/:id", auth, staffAPI.deleteStaffMember); // delete staff member

router.post("/api/staff/login", staffAPI.loging); // login

router.post("/api/staff/send_otp/:id", staffAPI.sendOtp); // send OTP staff member

router.post("/api/staff/email_verification/:id", staffAPI.emailVerification); // email verification staff member

router.post("/api/staff/reset_password", staffAPI.resetPassword); // reset password staff member

/////////////////////////////////// Student API ////////////////////////////////////////////

router.post("/api/student/new/add",auth, studentAPI.addStudent); // add new Student

router.post("/api/student/get_all", auth, studentAPI.getStudent); // get all Student

router.put("/api/student/update/:id", auth, studentAPI.updateStudent); // update Student

router.delete("/api/student/delete/:id", auth, studentAPI.deleteStudent); // delete Student

router.post("/api/student/login", studentAPI.logingStudent); // login Student

router.post("/api/student/send_otp/:id", studentAPI.sendOtpStudent); // send OTP Student

router.post("/api/student/email_verification/:id", studentAPI.emailVerificationStudent); // email verification Student

router.post("/api/student/reset_password", studentAPI.resetPasswordStudent); // reset password Student

module.exports = router;
