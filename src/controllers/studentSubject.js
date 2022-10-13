const subjectStudntModel = require("../models/studentSubject");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");
const studentSubject = require("../models/studentSubject");

////////////////////// ADD NEW STUDENT-SUBJECTS START /////////////////////////
exports.addSubjectStudent = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    student_id: Joi.string().required().label("Student ID"),
    subject_id: Joi.string().required().label("Subject ID"),
    enrollDate: Joi.date().raw().required().label("Enrall Date"),
    tempStopDate: Joi.date().empty("").allow(null).label("Temporay Stop Date"),
    admition: Joi.boolean().required().label("Admition"),
    studentAccess: Joi.boolean().required().label("Student Access"),
    reasonForStop: Joi.string().empty("").allow(null).label("Reason for stop"),
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

  let newUser = subjectStudntModel(req.body);

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

// ////////////////////// ADD STUDENT-SUBJECTS END /////////////////////////

// ////////////////////// GET STUDENT-SUBJECTS START /////////////////////////

exports.getSubjectStudent = async function (req, res) {
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
      request.admition === null
        ? {}
        : {
            admition: request.admition,
          },
      request.studentAccess === null
        ? {}
        : {
            studentAccess: request.studentAccess,
          },
    ],
  };

  let user = await subjectStudntModel.aggregate([
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

// //   ////////////////////// GET STUDENT-SUBJECTS END /////////////////////////

// //   ////////////////////// UPDATE STUDENT-SUBJECTS START /////////////////////////

exports.updateSubjectStudent = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  
  const schema = Joi.object({
    tempStopDate: Joi.date().empty("").allow(null).label("Temporay Stop Date"),
    studentAccess: Joi.boolean().required().label("Student Access"),
    reasonForStop: Joi.string().empty("").allow(null).label("Reason for stop"),
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

  let user = await subjectStudntModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE STUDENT-SUBJECTS END /////////////////////////

// //   ////////////////////// DELETE STUDENT-SUBJECTS START /////////////////////////

exports.deleteSubjectStudent = function (req, res) {
  subjectStudntModel.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
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

// //   ////////////////////// DELETE STUDENT-SUBJECTS END /////////////////////////
