const { isEmpty, isNull, isNil, } = require("lodash");
const config = require("../config/config");
const db = require("../models");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const currentTime = moment().unix();
const User = db.user;
const Op = db.Op;

exports.createUser = async (req, res) => {
  try {
    let { name, phone_number } = req.body;
    if (isEmpty(name), isEmpty(phone_number)) {
      return res.send({
        success: false,
        error: "Required Fields cannot be empty",
        body: null,
      });
    }

    const phoneNumber = await User.findOne({
      where: {
        phone_number: phone_number
      }
    });

    if (phoneNumber) {
      return res.send({
        success: false,
        error: "Failed! Phone Number is already in use!", body: null,
      });
    }

    const user = await User.create({
      name,
      phone_number
    });

    res.status(200).send({
      success: true,
      error: null,
      body: {
        user
      }

    });
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .send({
        success: false,
        error: "Something went wrong",
        body: null,
      });
  }

};

exports.generateOTP = async (req, res) => {
  try {
    let { phone_number } = req.body;
    if (isEmpty(phone_number)) {
      return res.send({
        success: false,
        error: "Required Fields cannot be empty",
        body: null,
      });
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false
    });

    let user = await User.findOne({
      where: {
        phone_number: phone_number
      }
    });

    if (isNull(user)) {
      return res.send({
        success: false,
        error: "User does not exist", body: null,
      });
    }

    let otp_expiration_date = moment.unix(currentTime).add(5, "minutes").unix();

    await user.update({
      otp,
      otp_expiration_date
    });

    res.status(200).send({
      success: true,
      error: null,
      body: {
        id: user.id,
        otp: user.otp
      }

    });
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .send({
        success: false,
        error: "Something went wrong",
        body: null,
      });
  }

};

exports.verifyOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.query;

    //check otp 
    if (isEmpty(otp)) {
      return res.send({ success: false, error: "otp required", body: null });
    }

    //find Otp
    const user = await User.findOne({ where: { id: id } });

    if (isNull(user) || user.otp_expiration_date <= moment().unix()) {
      return res
        .send({ success: false, error: "Invalid or Expired OTP", body: null });
    }

    if (otp != user.otp) {
      return res.send({ success: false, error: "Incorrect Otp", body: null });
    }
    res.status(200)
      .send({
        success: true,
        error: null,
        user
      });

  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .send({
        success: false,
        error: "Something went wrong",
        body: null,
      });
  }

}

