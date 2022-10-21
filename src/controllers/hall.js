const hallModel = require("../models/hall");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");

////////////////////// ADD NEW HALL START /////////////////////////
exports.addHall = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    hall_name: Joi.string().required().label("Hall Name"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("error");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let uniqueValidatorResponse = await uniqueValidator.findUnique(
    hallModel,
    [{ hall_name: request.hall_name }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let newUser = hallModel(req.body);

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

// ////////////////////// ADD HALL END /////////////////////////

// ////////////////////// GET HALL START /////////////////////////

exports.getHall = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.hall_name === ""
        ? {}
        : {
            hall_name: request.hall_name,
          },
    ],
  };

  let user = await hallModel.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "hall_id",
        as: "subjects",
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

// //   ////////////////////// GET HALL END /////////////////////////

// //   ////////////////////// UPDATE HALL START /////////////////////////

exports.updateHall = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    hall_name: Joi.string().required().label("Hall Name"),
  });

  let validateResult = schema.validate(validationObject);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }
  let uniqueValidatorResponse = await uniqueValidator.findUniqueForUpdate(
    userId,
    hallModel,
    [{ hall_name: request.hall_name }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let user = await hallModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE HALL END /////////////////////////

// //   ////////////////////// DELETE HALL START /////////////////////////

exports.deleteHall = function (req, res) {
    hallModel.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
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
  
  // //   ////////////////////// DELETE HALL END /////////////////////////
