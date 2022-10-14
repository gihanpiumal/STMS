const PaymentSubjectModel = require("../models/subjectPayment");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");
const studentSubject = require("../models/studentSubject");

////////////////////// ADD NEW SUBJECT-PAYMENT START /////////////////////////
exports.addPaymentSubject = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    subject_id: Joi.string().required().label("Subject ID"),
    teacher_id: Joi.string().required().label("teacher ID"),
    year: Joi.string().required().label("Year"),
    month: Joi.string().required().label("Month"),
    amount: Joi.number().required().label("Ammount"),
    student_count: Joi.number().required().label("Student Count"),
    paid_student_count: Joi.number().required().label("Paid Student Count"),
    pending_payment_student_count: Joi.number()
      .required()
      .label("Pending Payment Student Count"),
    pending_amount: Joi.number().required().label("Pending Ammount"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("error");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  //   let uniqueValidatorResponse = await uniqueValidator.findUnique(subjectStudntModel, [
  //     { subject_id: request.subject_id },
  //     { subject_name: request.subject_name },
  //   ]);
  //   if (uniqueValidatorResponse) {
  //     return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  //   }

  let newUser = PaymentSubjectModel(req.body);

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

// ////////////////////// ADD SUBJECT-PAYMENT END /////////////////////////

// ////////////////////// GET SUBJECT-PAYMENT START /////////////////////////

exports.getPaymentSubject = async function (req, res) {
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
    ],
  };

  let user = await PaymentSubjectModel.aggregate([
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
        as: "teacher details",
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

// //   ////////////////////// GET SUBJECT-PAYMENT END /////////////////////////

// //   ////////////////////// UPDATE SUBJECT-PAYMENT START /////////////////////////

exports.updatePaymentSubject = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    amount: Joi.date().empty("").allow(null).label("Amount"),
    student_count: Joi.date().empty("").allow(null).label("Student Count"),
    paid_student_count: Joi.date()
      .empty("")
      .allow(null)
      .label("Paid Student Count"),
    pending_payment_student_count: Joi.date()
      .empty("")
      .allow(null)
      .label("Pending payment student count"),
    pending_amount: Joi.date().empty("").allow(null).label("Pending Amount"),
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

  let user = await PaymentSubjectModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE SUBJECT-PAYMENT END /////////////////////////

// //   ////////////////////// DELETE SUBJECT-PAYMENT START /////////////////////////

exports.deletePaymentSubject = function (req, res) {
  PaymentSubjectModel.findByIdAndRemove(req.params.id).exec(
    (err, deletedUser) => {
      if (err) {
        return res.status(400).json({ message: "Not deleted", err });
      }
      return res.json(
        ApiResponse.getSuccess({
          details: deletedUser,
        })
      );
    }
  );
};

// //   ////////////////////// DELETE SUBJECT-PAYMENT END /////////////////////////
