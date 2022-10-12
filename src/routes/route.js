const express = require("express");
let auth = require("../services/auth_service");
const router = express.Router();
let asyncMiddleware = require("./../services/async_middleware");

const staffAPI = require("../controllers/staff");
const studentAPI = require("../controllers/student")
const teacherAPI = require("../controllers/teachers")
const categoriesAPI = require("../controllers/categories")
const subjectsAPI = require("../controllers/subjects")
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

/////////////////////////////////// Teachers API ////////////////////////////////////////////

router.post("/api/teacher/new/add",auth, teacherAPI.addTeacher); // add new Teacher

router.post("/api/teacher/get_all", auth, teacherAPI.getTeacher); // get all Teacher

router.put("/api/teacher/update/:id", auth, teacherAPI.updateTeacher); // update Teacher

router.delete("/api/teacher/delete/:id", auth, teacherAPI.deleteTeacher); // delete Teacher

router.post("/api/teacher/login", teacherAPI.logingTeacher); // login Teacher

router.post("/api/teacher/send_otp/:id", teacherAPI.sendOtpTeacher); // send OTP Teacher

router.post("/api/teacher/email_verification/:id", teacherAPI.emailVerificationTeacher); // email verification Teacher

router.post("/api/teacher/reset_password", teacherAPI.resetPasswordTeacher); // reset password Teacher

/////////////////////////////////// Categories API ////////////////////////////////////////////

router.post("/api/category/new/add",auth, categoriesAPI.addCategory); // add new Category

router.post("/api/category/get_all", auth, categoriesAPI.getCategory); // get all Category

router.put("/api/category/update/:id", auth, categoriesAPI.updateCategory); // update Category

router.delete("/api/category/delete/:id", auth, categoriesAPI.deleteCategory); // delete Category

/////////////////////////////////// Subjects API ////////////////////////////////////////////

router.post("/api/subject/new/add",auth, subjectsAPI.addSubject); // add new Subject

router.post("/api/subject/get_all", auth, subjectsAPI.getSubject); // get all Subject

router.put("/api/subject/update/:id", auth, subjectsAPI.updateSubject); // update Subject

router.delete("/api/subject/delete/:id", auth, subjectsAPI.deleteSubject); // delete Subject

module.exports = router;
