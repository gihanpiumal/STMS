const teacherPaymentModel = require("../models/teacherPayment");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");

////////////////////// ADD NEW TEACHER PAYMENT REQUEST START /////////////////////////
exports.addTeacherPayment = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    teacher_id: Joi.string().required().label("Teacher ID"),
    subject_id: Joi.string().required().label("Subject ID"),
    year: Joi.string().required().label("Year"),
    month: Joi.string().required().label("Month"),
    paymentDate: Joi.date().raw().required().label("Payment Date"),
    amount: Joi.number().required().label("Amount"),
    studentCount: Joi.number().required().label("Student Count"),
    paymentState: Joi.string().empty("").allow(null).label("Payment State"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("error");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  //   let uniqueValidatorResponse = await uniqueValidator.findUnique(subjectModel, [
  //     { subject_id: request.subject_id },
  //     { subject_name: request.subject_name },
  //   ]);
  //   if (uniqueValidatorResponse) {
  //     return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  //   }

  let newUser = teacherPaymentModel(req.body);

  newUser.save((err, addedData) => {
    if (err) {
      return res.status(400).json(
        ApiResponse.getError({
          error: err,
        })
      );
    }
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: addedData,
      })
    );
  });
};

// ////////////////////// ADD TEACHER PAYMENT REQUEST END /////////////////////////

// ////////////////////// GET TEACHER PAYMENT REQUEST START /////////////////////////

exports.getTeacherPayment = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.subject_id === ""
        ? {}
        : {
            subject_id: request.subject_id,
          },
      request.teacher_id === ""
        ? {}
        : {
            teacher_id: request.teacher_id,
          },
      request.year === ""
        ? {}
        : {
            year: request.year,
          },
      request.month === ""
        ? {}
        : {
            month: request.month,
          },
      request.paymentDate === ""
        ? {}
        : {
            paymentDate: request.paymentDate,
          },
      request.paymentState === ""
        ? {}
        : {
            paymentState: request.paymentState,
          },
    ],
  };

  let user = await teacherPaymentModel.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "subjects",
        localField: "subject_id",
        foreignField: "subject_id",
        as: "subject details",
      },
    },
    {
      $unwind: {
        path: "$spec",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "teachers",
        localField: "teacher_id",
        foreignField: "teacher_id",
        as: "Teacher details",
      },
    },
    {
      $unwind: {
        path: "$spec",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  if (user) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: user,
      })
    );
  }
  return res.status(400).json(
    ApiResponse.getError({
      error: err,
    })
  );
};

// //   ////////////////////// GET TEACHER PAYMENT REQUEST END /////////////////////////

// //   ////////////////////// UPDATE TEACHER PAYMENT REQUEST START /////////////////////////

exports.updateTeacherPayment = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    year: Joi.string().required().label("Year"),
    month: Joi.string().required().label("Month"),
    paymentDate: Joi.date().raw().required().label("Payment Date"),
    amount: Joi.number().required().label("Amount"),
    studentCount: Joi.number().required().label("Student Count"),
    paymentState: Joi.string().empty("").allow(null).label("Payment State"),
  });

  let validateResult = schema.validate(validationObject);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }
  //   let uniqueValidatorResponse = await uniqueValidator.findUniqueForUpdate(
  //     userId,
  //     subjectModel,
  //     [{ subject_name: request.subject_name }]
  //   );
  //   if (uniqueValidatorResponse) {
  //     return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  //   }

  let user = await teacherPaymentModel.findByIdAndUpdate(
    { _id: userId },
    {
      $set: request,
    },
    { new: true }
  );

  let returnObject = user.toJSON();

  if (user) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: returnObject,
      })
    );
  }
};

// //   ////////////////////// UPDATE TEACHER PAYMENT REQUEST END /////////////////////////

// //   ////////////////////// DELETE TEACHER PAYMENT REQUEST START /////////////////////////

exports.deleteTeacherPayment = function (req, res) {
  teacherPaymentModel
    .findByIdAndRemove(req.params.id)
    .exec((err, deletedUser) => {
      if (err) {
        return res.status(400).json({ message: "Not deleted", err });
      }
      return res.json(
        ApiResponse.getSuccess({
          details: deletedUser,
        })
      );
    });
};

// //   ////////////////////// DELETE TEACHER PAYMENT REQUEST END /////////////////////////
