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
    let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(
            token,
            "suraj_tamoghna_kashish_tanweer"
          );
      let blogToBeModified = decodedToken.userId//1st author id
      console.log(blogToBeModified)
      let blogId = req.params.blogId
      let blog = await blogModel.findOne(blogId)
      console.log(blog)
      let userLoggedIn = blog.authorId
      console.log(userLoggedIn)
       if (!mongoose.isValidObjectId(blogToBeModified)) {
           return res.status(404).send({ status: false, msg: "invalid blogId" });
       }
       if(blogToBeModified != userLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})
  next();
}

      // let blog = await authorModel.findById({ _id: blogToBeModified })
      // console.log(blog)
      // if (blog) {
      //     if (blog.authorId !== blogToBeModified) {
      //         return res.status(403).send({ status: false, msg: 'Author logged is not allowed to modify the requested data' })
    //     } else 
      //         next()
      //     }
      
  catch (error) {
      res.status(500).send({ status: false, Error: error.message })
  }
}
   module.exports = { authenticate, authorization };