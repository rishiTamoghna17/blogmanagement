const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
 const blogModel = require("../model/blogModels");
 //const authorModel = require("../model/authorModels");


// --------------Authentication------------


const authenticate = async function (req, res, next) {
  
    try{
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(
            token,
            "suraj_tamoghna_kashish_tanweer"
          );
          if (!token) return res.send({ status: false, msg: "token must be present" });
          
          if (!decodedToken) {
            return res.send({ status: false, msg: "token is invalid" });
          }
          next();
    } catch(err){
      return res.status(500).send({ status: false, msg: err.messge });
    }
  }


//---------------------Authorization---------------------


const authorization = async function (req, res, next) {
  try {
    const token = req.headers['x-api-key'] //we call headers with name x-api-key
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    // let decodedToken = jwt.verify(token, "FunctionUp-radon")
    let decodedToken = jwt.verify(
                  token,
                  "suraj_tamoghna_kashish_tanweer"
                );
                console.log(decodedToken);
                let userLoggedIn = decodedToken.userId
    //let blogToBeModified = decodedToken.userId//problem
    console.log(userLoggedIn);
    let blog = req.params.blogId

    let blogData = await blogModel.findOne({ _id: blog })
    console.log(blogData.authorId.toString())
      //console.log(blogData)
    if (blogData.authorId.toString() != userLoggedIn) {
      return res.status(403).send({ status: false, msg: 'You are not authrized' })
    }
    next()
  }
  catch (error) {
      res.status(500).send({ status: false, Error: error.message })
  }
}
   module.exports = { authenticate, authorization };