const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


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
    try{
        let token = req.headers["x-api-key"];
       if (!token) {
         return res.status(400).send({ status: false, msg: "Token must be present" });
       }
       let decodedToken = jwt.verify(token, "suraj_tamoghna_kashish_tanweer")
   
     let blogToBeModified = req.params.blogId;
     let authorLoggedin = decodedToken.authorId;
   
     let isValid = mongoose.Types.ObjectId.isValid(blogToBeModified)
   
     if(isValid === false){
       return res.status(401).send("lenth of the id is less then 24 digit or invalid userId")
     }
     else if (!decodedToken){
       return res.status(401).send({status: false, msg: "token is invalid"})
     }
     else if (blogToBeModified != authorLoggedin) {
       return res.status(403).send({
         status: false,
         msg: "user loggedin not allowed to modify changes",
       });
     }
     next();} catch(err){
       console.log(err)
       return res.status(500).send({ status: false, msg: err.messge });
     }
   };
   module.exports = { authenticate, authorization };