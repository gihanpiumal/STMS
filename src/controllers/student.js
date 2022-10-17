const studentModel = require("../models/student");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/responce_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");
const mongoose = require("mongoose");

////////////////////// ADD NEW STUDENT START /////////////////////////
exports.addStudent = async function (req, res) {
  let request = req.body;
  //   console.log(request);

  const schema = Joi.object({
    student_id: Joi.string().required().label("Staff ID"),
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().required().label("Last Name"),
    DOB: Joi.date().raw().required().label("DOB"),
    NIC: Joi.string()
      .required()
      .regex(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)
      .label("NIC")
      .messages({ "string.pattern.base": "Invalid NIC Number" }),
    phone: Joi.string()
      .required()
      .regex(
        /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
        "07xxxxxxxx"
      )
      .label("Mobile Number"),
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
    avatar: Joi.string().empty("").label("Profile Picture"),
    password: Joi.string().empty("").label("Password"),
    subject_list: Joi.array()
      // .items(
      //   Joi.object().keys({
      //     subject_id: Joi.string().required().label("Subject id"),
      //   })
      // )
      .empty("")
      .label("Subject id list"),
    category_id: Joi.string().required().label("Category"),
    registeredDate: Joi.date().raw().required().label("Registered Date"),
    access_level: Joi.string().required().label("Access Level"),
    access_status: Joi.string().required().label("Access Status"),
    isVerified: Joi.boolean().required().label("Verified"),
    OTPCode: Joi.number().optional().label("OTP"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("error");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let uniqueValidatorResponse = await uniqueValidator.findUnique(studentModel, [
    { email: request.email },
    { student_id: request.student_id },
    { NIC: request.NIC },
  ]);
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  //   upload.single('avatar')

  let newUser = studentModel(req.body);

  //   if (req.file) {
  //     newUser.avatar = req.file.path;
  //   }
  const saltRounds = 10;

  const hashPassword = "";

  bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
      throw saltError;
    } else {
      bcrypt.hash(newUser.password, salt, function (hashError, hash) {
        if (hashError) {
          throw hashError;
        } else {
          newUser.password = hash;

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
        }
      });
    }
  });
};

////////////////////// ADD STUDENT MEMBER END /////////////////////////

////////////////////// GET STUDENT START /////////////////////////

exports.getStudent = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.first_name === ""
        ? {}
        : {
            first_name: request.first_name,
          },
      request.last_name === ""
        ? {}
        : {
            last_name: request.last_name,
          },
      request.student_id === ""
        ? {}
        : {
            _id: {
              $eq: mongoose.Types.ObjectId(request.student_id),
            },
          },
      request.access_status === ""
        ? {}
        : {
            access_status: request.access_status,
          },
      request.email === ""
        ? {}
        : {
            email: request.email,
          },
    ],
  };

  let user = await studentModel.aggregate([
    { $match: condition },
    // {
    //   $lookup: {
    //     from: "userroles",
    //     localField: "userRoleId",
    //     foreignField: "_id",
    //     as: "userRole",
    //   },
    // },
    // {
    //   $unwind: {
    //     path: "$spec",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
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

//   ////////////////////// GET STUDENT END /////////////////////////

//   ////////////////////// UPDATE STUDENT START /////////////////////////

exports.updateStudent = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;

  const schema = Joi.object({
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().required().label("Last Name"),
    DOB: Joi.date().raw().required().label("DOB"),
    NIC: Joi.string()
      .required()
      .regex(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/)
      .label("NIC")
      .messages({ "string.pattern.base": "Invalid NIC Number" }),
    phone: Joi.string()
      .required()
      .regex(
        /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
        "07xxxxxxxx"
      )
      .label("Mobile Number"),
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
    avatar: Joi.string().empty("").label("Profile Picture"),
  });

  let validateResult = schema.validate(validationObject);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }
  let uniqueValidatorResponse = await uniqueValidator.findUniqueForUpdate(
    userId,
    studentModel,
    [{ email: request.email }, { NIC: request.NIC }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let user = await studentModel.findByIdAndUpdate(
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

//   ////////////////////// UPDATE STUDENT END /////////////////////////

//   ////////////////////// DELETE STUDENT START /////////////////////////

exports.deleteStudent = function (req, res) {
  studentModel.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
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

//   ////////////////////// DELETE STUDENT END /////////////////////////

//   ////////////////////// LOGIN STUDENT START /////////////////////////

exports.logingStudent = async function (req, res) {
  let request = req.body;

  const schema = Joi.object({
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
    password: Joi.string().required().label("password"),
  });

  let validateResult = schema.validate(request);
  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let user = await studentModel.findOne({ email: request.email });

  if (user && (await bcrypt.compare(request.password, user.password))) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: "Done Login",
        token: jwt.sign(
          {
            _id: user._id,
            email: user.email,
            access_level: user.access_level,
          },
          process.env.secretKey,
          { expiresIn: 30000 }
        ),
      })
    );
  } else {
    return res
      .status(401)
      .send(ApiResponse.getError("Invalid email or password"));
  }
};

//   ////////////////////// LOGIN STUDENT END /////////////////////////

//   ////////////////////// SEND OTP STUDENT START /////////////////////////

exports.sendOtpStudent = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;

  const schema = Joi.object({
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
  });

  let validateResult = schema.validate(request);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let email = request.email;
  let otp = await otp_verification.otpSend(email);

  let tempRequest = {
    OTPCode: otp.OTP,
  };

  if (otp.success) {
    let user = await studentModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: tempRequest,
      },
      { new: true }
    );

    return res.json(
      ApiResponse.getSuccess({
        details: "Check your email..",
      })
    );
  } else {
    return res
      .status(400)
      .json({ message: "can't send the OTP", error: otp.err });
  }
};

//   ////////////////////// SEND OTP STUDENT END /////////////////////////

//   ////////////////////// EMAIL VERIFICATION STUDENT START /////////////////////////

exports.emailVerificationStudent = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;

  const schema = Joi.object({
    OTP: Joi.number().optional().label("OTP"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let user = await studentModel.findById(userId);

  let tempRequest = {
    isVerified: true,
  };

  if (user.OTPCode == request.OTP) {
    let users = await studentModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: tempRequest,
      },
      { new: true }
    );
    return res.json(
      ApiResponse.getSuccess({
        details: "Email veryfied sucessfully",
      })
    );
  } else {
    return res.status(400).json({ message: "email is not veryfied" });
  }
};

//   ////////////////////// EMAIL VERIFICATION STUDENT END /////////////////////////

//   ////////////////////// RESET PASSWORD STUDENT START /////////////////////////

exports.resetPasswordStudent = async function (req, res) {
  let request = req.body;
  let _id = request._id;
  const saltRounds = 10;

  const schema = Joi.object({
    _id: Joi.string().required().label("ID"),
    OTP: Joi.number().optional().label("OTP"),
    newPassword: Joi.string().required().label("Password"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let tempRequest = {
    password: request.newPassword,
  };

  bcrypt.genSalt(saltRounds, async function (saltError, salt) {
    if (saltError) {
      throw saltError;
    } else {
      await bcrypt.hash(tempRequest.password, salt, function (hashError, hash) {
        if (hashError) {
          throw hashError;
        } else {
          tempRequest.password = hash;
          studentModel.findOne({ _id: _id }, async function (err, doc) {
            if (doc.OTPCode == request.OTP) {
              let users = await studentModel.findByIdAndUpdate(
                { _id: doc._id },
                {
                  $set: tempRequest,
                },
                { new: true }
              );
              return res.json(
                ApiResponse.getSuccess({
                  details: "Password Reset sucessfully",
                })
              );
            } else {
              return res.status(400).json({ message: "Password not reset" });
            }
          });
        }
      });
    }
  });
};
//   ////////////////////// RESET PASSWORD STUDENT END /////////////////////////
