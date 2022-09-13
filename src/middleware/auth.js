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

    let decodedToken = jwt.verify(token, "suraj_tamoghna_kashish_tanweer", (err, decode)=>{
      if (err){
          return res.status(401).send({status: false, msg:"You have enter invalid token"})
      }(decode == true)
      next()
    })
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
    if (!mongoose.isValidObjectId(blog)){
      return res.status(400).send({ status: false, msg: 'Please enter correct blogId Id' })
  }
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
    
    const token = req.headers["x-api-key"]; // we call headers with name x-api-key
    if (!token)
      res.status(401).send({ status: false, msg: "missing a mandatory token😒" });
      let decodedToken = jwt.verify(token, "suraj_tamoghna_kashish_tanweer");
      let userLoggedIn = decodedToken.userId;
      let filter = {userLoggedIn,...data};
    const { authorId, category, tags, subcategory } = data
      let getRecord = await blogModel.findOne(filter)
      console.log(getRecord)
      console.log(userLoggedIn )
      let userId = getRecord.authorId.toString();
      console.log(userId)
      if(userId.toString() != userLoggedIn) {
        return res.status(403).send({ status: false, msg: "You are not authrized" });
      }
next();
}catch (error) {
  res.status(500).send({ status: false, Error: error.message });
}
}

module.exports = { authenticate, authorization,specialAuthorization };
