const PaymentStudntModel = require("../models/studentPayment");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");
const studentSubject = require("../models/studentSubject");

////////////////////// ADD NEW STUDENT-PAYMENT START /////////////////////////
exports.addPaymentStudent = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    student_id: Joi.string().required().label("Student ID"),
    subject_id: Joi.string().required().label("Subject ID"),
    staff_member_id: Joi.string().required().label("Staff Member ID"),
    year: Joi.string().required().label("Year"),
    month: Joi.string().required().label("Month"),
    PaymentDate: Joi.date().empty("").allow(null).label("Payment Date"),
    amount: Joi.number().required().label("Ammount"),
    payment_state: Joi.boolean().required().label("Payment State"),
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

  let newUser = PaymentStudntModel(req.body);

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

// ////////////////////// ADD STUDENT-PAYMENT END /////////////////////////

// ////////////////////// GET STUDENT-PAYMENT START /////////////////////////

exports.getPaymentStudent = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.student_id === ""
        ? {}
        : {
            student_id: request.student_id,
          },
      request.subject_id === ""
        ? {}
        : {
            subject_id: request.subject_id,
          },
      request.staff_member_id === ""
        ? {}
        : {
            staff_member_id: request.staff_member_id,
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
      request.payment_state === null
        ? {}
        : {
            payment_state: request.payment_state,
          },
    ],
  };

  let user = await PaymentStudntModel.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "_id",
        as: "student details",
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
        from: "subjects",
        localField: "subject_id",
        foreignField: "_id",
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
        from: "staffusers",
        localField: "staff_member_id",
        foreignField: "_id",
        as: "staff member details",
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

// //   ////////////////////// GET STUDENT-PAYMENT END /////////////////////////

// //   ////////////////////// UPDATE STUDENT-PAYMENT START /////////////////////////

exports.updatePaymentStudent = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    PaymentDate: Joi.date().empty("").allow(null).label("Payment Date"),
    payment_state: Joi.boolean().required().label("Payment State"),
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

  let user = await PaymentStudntModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE STUDENT-PAYMENT END /////////////////////////

// //   ////////////////////// DELETE STUDENT-PAYMENT START /////////////////////////

exports.deletePaymentStudent = function (req, res) {
  PaymentStudntModel
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

// //   ////////////////////// DELETE STUDENT-PAYMENT END /////////////////////////
