const subjectModel = require("../models/subjects");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");

////////////////////// ADD NEW SUBJECTS START /////////////////////////
exports.addSubject = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    subject_id: Joi.string().required().label("Subject ID"),
    subject_name: Joi.string().required().label("Subject Name"),
    category_id: Joi.string().required().label("Category ID"),
    teacher_id: Joi.string().required().label("Teacher ID"),
    classDate: Joi.string().required().label("Class Date"),
    startTime: Joi.string().required().label("Start Time"),
    endTime: Joi.string().required().label("End Time"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("error");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let uniqueValidatorResponse = await uniqueValidator.findUnique(subjectModel, [
    { subject_id: request.subject_id },
    { subject_name: request.subject_name },
  ]);
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let newUser = subjectModel(req.body);

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

// ////////////////////// ADD SUBJECTS END /////////////////////////

// ////////////////////// GET SUBJECTS START /////////////////////////

exports.getSubject = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.subject_name === ""
        ? {}
        : {
            subject_name: request.subject_name,
          },
      request.category_id === ""
        ? {}
        : {
            category_id: request.category_id,
          },
      request.teacher_id === ""
        ? {}
        : {
            teacher_id: request.teacher_id,
          },
      request.classDate === ""
        ? {}
        : {
            classDate: request.classDate,
          },
    ],
  };

  let user = await subjectModel.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category details",
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
        foreignField: "_id",
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

// //   ////////////////////// GET SUBJECTS END /////////////////////////

// //   ////////////////////// UPDATE SUBJECTS START /////////////////////////

exports.updateSubject = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    subject_name: Joi.string().required().label("Subject Name"),
    category_id: Joi.string().required().label("Category ID"),
    teacher_id: Joi.string().required().label("Teacher ID"),
    classDate: Joi.string().required().label("Class Date"),
    startTime: Joi.string().required().label("Start Time"),
    endTime: Joi.string().required().label("End Time"),
  });

  let validateResult = schema.validate(validationObject);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }
  let uniqueValidatorResponse = await uniqueValidator.findUniqueForUpdate(
    userId,
    subjectModel,
    [{ subject_name: request.subject_name }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let user = await subjectModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE SUBJECTS END /////////////////////////

// //   ////////////////////// DELETE SUBJECTS START /////////////////////////

exports.deleteSubject = function (req, res) {
  subjectModel.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
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

// //   ////////////////////// DELETE SUBJECTS END /////////////////////////
