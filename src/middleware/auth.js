const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const blogModel = require("../model/blogModels");
const authorController = require("../controllers/authorController");

// --------------Authentication------------

const authenticate = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(404).send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "suraj_tamoghna_kashish_tanweer");

    if (!decodedToken) {
      return res.status(403).send({ status: false, msg: "token is invalid" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.messge });
  }
};

//---------------------Authorization---------------------

const authorization = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"]; // we call headers with name x-api-key
    if (!token)
      res.status(401).send({ status: false, msg: "missing a mandatory token😒" });
    let decodedToken = jwt.verify(token, "suraj_tamoghna_kashish_tanweer");
    let userLoggedIn = decodedToken.userId;
    let blog = req.params.blogId
    let blogData = await blogModel.findOne({ _id: blog });
    console.log(blogData.authorId.toString());
    
    if (blogData.authorId.toString() != userLoggedIn) {
      return res.status(403).send({ status: false, msg: "You are not authrized" });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};
//---------------------Special Authorization---------------------
const specialAuthorization = async function (req, res, next){
  try {
    let data = req.query;
    let filter = {...data};
    const { authorId, category, tags, subcategory } = data
    const token = req.headers["x-api-key"]; // we call headers with name x-api-key
    if (!token)
      res.status(401).send({ status: false, msg: "missing a mandatory token😒" });
      let decodedToken = jwt.verify(token, "suraj_tamoghna_kashish_tanweer");
      let userLoggedIn = decodedToken.userId;
      let getRecord = await blogModel.findOne(filter)
      let userId = getRecord.authorId.toString();
      if(userId.toString() != userLoggedIn) {
        return res.status(403).send({ status: false, msg: "You are not authrized" });
      }
next();
}catch (error) {
  res.status(500).send({ status: false, Error: error.message });
}
}

module.exports = { authenticate, authorization,specialAuthorization };
