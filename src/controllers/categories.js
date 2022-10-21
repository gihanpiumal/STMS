const categoryModel = require("../models/category");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");

////////////////////// ADD NEW CATEGORY START /////////////////////////
exports.addCategory = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    category_name: Joi.string().required().label("Category Name"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("error");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let uniqueValidatorResponse = await uniqueValidator.findUnique(
    categoryModel,
    [{ category_name: request.category_name }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let newUser = categoryModel(req.body);

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

// ////////////////////// ADD CATEGORY END /////////////////////////

// ////////////////////// GET CATEGORY START /////////////////////////

exports.getCategory = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.category_name === ""
        ? {}
        : {
            category_name: request.category_name,
          },
    ],
  };

  let user = await categoryModel.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "category_id",
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

// //   ////////////////////// GET CATEGORY END /////////////////////////

// //   ////////////////////// UPDATE CATEGORY START /////////////////////////

exports.updateCategory = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    category_name: Joi.string().required().label("Category Name"),
  });

  let validateResult = schema.validate(validationObject);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }
  let uniqueValidatorResponse = await uniqueValidator.findUniqueForUpdate(
    userId,
    categoryModel,
    [{ category_name: request.category_name }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let user = await categoryModel.findByIdAndUpdate(
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

// //   ////////////////////// UPDATE CATEGORY END /////////////////////////

// //   ////////////////////// DELETE CATEGORY START /////////////////////////

exports.deleteCategory = function (req, res) {
    categoryModel.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
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
  
  // //   ////////////////////// DELETE CATEGORY END /////////////////////////
