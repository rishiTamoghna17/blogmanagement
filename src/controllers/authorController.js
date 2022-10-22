const mongoose = require("mongoose");
const authorModel = require("../model/authorModel");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");

//------------------------Authour Creation---------------------//

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const authors = async function (req, res) {
  try {
    let authorData = req.body;

    if (Object.keys(authorData).length === 0) {
      return res.status(400).send({ status: false, message: "Please give some data" });
    }
    if (!isValid(authorData.fname)) {
      return res.status(400).send({ status: false, message: "fname is missing or you left empty" });
    }
    if (!/^[a-z ,.'-]+$/i.test(authorData.fname)) {
      return res.status(400).send({status: false,message: "fname should be in alphabate",});
    }
    if (!isValid(authorData.lname)) {
      return res.status(400).send({ status: false, message: "lname is missing or you left empty" });
    }
    if (!/^[a-z ,.'-]+$/i.test(authorData.lname)) {
      return res.status(400).send({status: false, message: "lname should be in alphabate",});
    }
    if (!isValidTitle(authorData.title)) {
      return res.status(400).send({ status: false, message: "title is missing or you left empty" });
    }

    if (!isValid(authorData.email)) {
      return res.status(400).send({ status: false, message: "email is missing or you left empty" });
    }
    if (!validator.validate(authorData.email)) {
      return res.status(400).send({ status: false, message: "Please provide a valid email" });
    }
    const dbemail = await authorModel.findOne({ email: authorData.email });
    if (dbemail) {
      return res.status(400).send({ status: false, message: "email is already used" });
    }
    if (!isValid(authorData.password)) {
      return res.status(400).send({ status: false, message: "password is missing or you left empty" });
    }
    if (authorData.password.length < 4 || authorData.password.length >=10) {
      return res.status(400).send({ status: false, msg: "password length should be 4 to 10" })
   }

    let savedAuthor = await authorModel.create(authorData);
    return res.status(201).send({ msg: savedAuthor });
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//--------------------------authorlogin-----------------------

const authorlogin = async function (req, res) {
  let data = req.body;
  let email = data.email;
  let password = data.password;
  let author = await authorModel.findOne({email:email, password: password, });

  if (Object.keys(data).length == 0)
  return res.status(400).send({ status: false, msg: "email and password is required...!" })
  if (!email)
  return res.status(400).send({ status: false, msg: "email is required...!" });
  if (!password)
      return res.status(400).send({ status: false, msg: "password is required...!" })
  if (!author)
    return res.status(400).send({status: false, msg: "email or the password is incorerct",});

  let token = jwt.sign({
      userId: author._id.toString(),
      batch: "plutonium",
      organisation: "FunctionUp",}, "suraj_tamoghna_kashish_tanweer");

  res.setHeader("x-api-key", token); 
  return res.status(200).send({ status: true, token: token });
};

(module.exports.authors = authors), (module.exports.authorlogin = authorlogin);