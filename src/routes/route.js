const express = require("express");
let auth = require("../services/auth_service");
const router = express.Router();
let asyncMiddleware = require("./../services/async_middleware");

const staffAPI = require("../controllers/staff");
const studentAPI = require("../controllers/student");
const teacherAPI = require("../controllers/teachers");
const categoriesAPI = require("../controllers/categories");
const subjectsAPI = require("../controllers/subjects");
const subjectsStudentAPI = require("../controllers/studentSubject");
const paymentStudentAPI = require("../controllers/paymentStudent");
const paymentSubjectAPI = require("../controllers/paymentSubject");
const hallAPI = require("../controllers/hall");
const extraClassAPI = require("../controllers/extraClasses");
const paymentTeacherAPI = require("../controllers/paymentTeacher");
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

router.post("/api/student/new/add", auth, studentAPI.addStudent); // add new Student

router.post("/api/student/get_all", auth, studentAPI.getStudent); // get all Student

router.put("/api/student/update/:id", auth, studentAPI.updateStudent); // update Student

router.delete("/api/student/delete/:id", auth, studentAPI.deleteStudent); // delete Student

router.post("/api/student/login", studentAPI.logingStudent); // login Student

router.post("/api/student/send_otp/:id", studentAPI.sendOtpStudent); // send OTP Student

router.post(
  "/api/student/email_verification/:id",
  studentAPI.emailVerificationStudent
); // email verification Student

router.post("/api/student/reset_password", studentAPI.resetPasswordStudent); // reset password Student

/////////////////////////////////// Teachers API ////////////////////////////////////////////

router.post("/api/teacher/new/add", auth, teacherAPI.addTeacher); // add new Teacher

router.post("/api/teacher/get_all", auth, teacherAPI.getTeacher); // get all Teacher

router.put("/api/teacher/update/:id", auth, teacherAPI.updateTeacher); // update Teacher

router.delete("/api/teacher/delete/:id", auth, teacherAPI.deleteTeacher); // delete Teacher

router.post("/api/teacher/login", teacherAPI.logingTeacher); // login Teacher

router.post("/api/teacher/send_otp/:id", teacherAPI.sendOtpTeacher); // send OTP Teacher

router.post(
  "/api/teacher/email_verification/:id",
  teacherAPI.emailVerificationTeacher
); // email verification Teacher

router.post("/api/teacher/reset_password", teacherAPI.resetPasswordTeacher); // reset password Teacher

/////////////////////////////////// Categories API ////////////////////////////////////////////

router.post("/api/category/new/add", auth, categoriesAPI.addCategory); // add new Category

router.post("/api/category/get_all", auth, categoriesAPI.getCategory); // get all Category

router.put("/api/category/update/:id", auth, categoriesAPI.updateCategory); // update Category

router.delete("/api/category/delete/:id", auth, categoriesAPI.deleteCategory); // delete Category

/////////////////////////////////// Subjects API ////////////////////////////////////////////

router.post("/api/subject/new/add", auth, subjectsAPI.addSubject); // add new Subject

router.post("/api/subject/get_all", auth, subjectsAPI.getSubject); // get all Subject

router.put("/api/subject/update/:id", auth, subjectsAPI.updateSubject); // update Subject

router.delete("/api/subject/delete/:id", auth, subjectsAPI.deleteSubject); // delete Subject

/////////////////////////////////// Student Subjects API ////////////////////////////////////////////

router.post(
  "/api/student-subject/new/add",
  auth,
  subjectsStudentAPI.addSubjectStudent
); // add new Subject Student

router.post(
  "/api/student-subject/get_all",
  auth,
  subjectsStudentAPI.getSubjectStudent
); // get all Subject Student

router.put(
  "/api/student-subject/update/:id",
  auth,
  subjectsStudentAPI.updateSubjectStudent
); // update Subject Student

router.delete(
  "/api/student-subject/delete/:id",
  auth,
  subjectsStudentAPI.deleteSubjectStudent
); // delete Subject Student

/////////////////////////////////// Student Payment API ////////////////////////////////////////////

router.post(
  "/api/student-payment/new/add",
  auth,
  paymentStudentAPI.addPaymentStudent
); // add new Payment Student

router.post(
  "/api/student-payment/get_all",
  auth,
  paymentStudentAPI.getPaymentStudent
); // get all Payment Student

router.put(
  "/api/student-payment/update/:id",
  auth,
  paymentStudentAPI.updatePaymentStudent
); // update Payment Student

router.delete(
  "/api/student-payment/delete/:id",
  auth,
  paymentStudentAPI.deletePaymentStudent
); // delete Payment Student

/////////////////////////////////// Subject Payment API ////////////////////////////////////////////

router.post(
  "/api/subject-payment/new/add",
  auth,
  paymentSubjectAPI.addPaymentSubject
); // add new Payment Subject

router.post(
  "/api/subject-payment/get_all",
  auth,
  paymentSubjectAPI.getPaymentSubject
); // get all Payment Subject

router.put(
  "/api/subject-payment/update/:id",
  auth,
  paymentSubjectAPI.updatePaymentSubject
); // update Payment Subject

router.delete(
  "/api/subject-payment/delete/:id",
  auth,
  paymentSubjectAPI.deletePaymentSubject
); // delete Payment Subject

/////////////////////////////////// Hall API ////////////////////////////////////////////

router.post("/api/hall/new/add", auth, hallAPI.addHall); // add new Hall

router.post("/api/hall/get_all", auth, hallAPI.getHall); // get all Hall

router.put("/api/hall/update/:id", auth, hallAPI.updateHall); // update Hall

router.delete("/api/hall/delete/:id", auth, hallAPI.deleteHall); // delete Hall

/////////////////////////////////// Extra Classes API ////////////////////////////////////////////

router.post(
  "/api/extra-class-request/new/add",
  auth,
  extraClassAPI.addExtraClass
); // add new ExtraClass

router.post(
  "/api/extra-class-request/get_all",
  auth,
  extraClassAPI.getExtraClass
); // get all ExtraClass

router.put(
  "/api/extra-class-request/update/:id",
  auth,
  extraClassAPI.updateExtraClass
); // update ExtraClass

router.delete(
  "/api/extra-class-request/delete/:id",
  auth,
  extraClassAPI.deleteExtraClass
); // delete ExtraClass

/////////////////////////////////// Teacher Payment API ////////////////////////////////////////////

router.post(
  "/api/teacher-payment/new/add",
  auth,
  paymentTeacherAPI.addTeacherPayment
); // add new TeacherPayment

router.post(
  "/api/teacher-payment/get_all",
  auth,
  paymentTeacherAPI.getTeacherPayment
); // get all TeacherPayment

router.put(
  "/api/teacher-payment/update/:id",
  auth,
  paymentTeacherAPI.updateTeacherPayment
); // update TeacherPayment

router.delete(
  "/api/teacher-payment/delete/:id",
  auth,
  paymentTeacherAPI.deleteTeacherPayment
); // delete TeacherPayment

module.exports = router;
