const extraClassModel = require("../models/extraClass");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");

////////////////////// ADD NEW EXTRA CLASSES REQUEST START /////////////////////////
exports.addExtraClass = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    subject_id: Joi.string().required().label("Subject ID"),
    hall_id: Joi.string().required().label("Hall ID"),
    date: Joi.date().raw().required().label("Date"),
    startTime: Joi.string().required().label("Start Time"),
    endTime: Joi.string().required().label("End Time"),
    requestStatus: Joi.string().required().label("End Time"),
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

  let newUser = extraClassModel(req.body);

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

// ////////////////////// ADD EXTRA CLASSES REQUEST END /////////////////////////

// ////////////////////// GET EXTRA CLASSES REQUEST START /////////////////////////

exports.getExtraClass = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.subject_id === ""
        ? {}
        : {
            subject_id: request.subject_id,
          },
      request.hall_id === ""
        ? {}
        : {
            hall_id: request.hall_id,
          },
      request.date === ""
        ? {}
        : {
            date: request.date,
          },
      request.requestStatus === ""
        ? {}
        : {
            requestStatus: request.requestStatus,
          },
    ],
  };

  let user = await extraClassModel.aggregate([
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
        from: "halls",
        localField: "hall_id",
        foreignField: "_id",
        as: "Hall details",
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

// //   ////////////////////// GET EXTRA CLASSES REQUEST END /////////////////////////

// //   ////////////////////// UPDATE EXTRA CLASSES REQUEST START /////////////////////////

exports.updateExtraClass = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    subject_id: Joi.string().required().label("Subject ID"),
    hall_id: Joi.string().required().label("Hall ID"),
    date: Joi.date().raw().required().label("Date"),
    startTime: Joi.string().required().label("Start Time"),
    endTime: Joi.string().required().label("End Time"),
    requestStatus: Joi.string().required().label("End Time"),
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

  let user = await extraClassModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE EXTRA CLASSES REQUEST END /////////////////////////

// //   ////////////////////// DELETE EXTRA CLASSES REQUEST START /////////////////////////

exports.deleteExtraClass = function (req, res) {
  extraClassModel.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
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

// //   ////////////////////// DELETE EXTRA CLASSES REQUEST END /////////////////////////
