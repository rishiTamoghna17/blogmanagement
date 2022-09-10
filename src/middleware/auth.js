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

    let data = req.query
    let filter = { ...data }   //stores the query params in the object obj-destructure-object literals
    let checkBlog = await blogModel.findOne(filter)

    if (!checkBlog)
        return res.status(404).send({ status: false, msg: "no such blog exist...! " })

    if (checkBlog.isDeleted === true)
        return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

    let blogId = checkBlog._id
    let deleteBlog = await blogModel.findOneAndUpdate(
        filter,
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true, upsert: true }
    ) 
    res.status(201).send({ status: true, data: deleteBlog })

} catch (err) {
    res.status(500).send({ status: false, msg: err.message })
}

}


module.exports = { authenticate, authorization,specialAuthorization };
