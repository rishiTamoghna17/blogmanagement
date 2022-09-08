const mongoose = require("mongoose");
const authorModel = require("../model/authorModel")
const validator = require("email-validator");
const jwt = require("jsonwebtoken")


//Authour Creation
const isValid = function(value){
    if(typeof(value)==="undefined" || value===null) return false
    if(typeof(value)=== "string"   && value.trim().length===0)return false
    return true
}
const isValidTitle = function(title){
    return["Mr", "Mrs", "Miss"].indexOf(title)!==-1
}

const authors= async function (req, res) {
    try {
        let authorData= req.body  
        // console.log(authorData.fname)
        if(Object.keys(authorData).length===0){
            return res.status(400).send({status:false,message:"Please give some data"})
        }
        if(!isValid(authorData.fname)){
            return res.status(400).send({status:false,message:"Please provide a valid fname"})
        }
        if(!(/^[a-z ,.'-]+$/i).test(authorData.fname)){
            return res.status(400).send({status:false,message:"First name should not be in alphabate"})
        }
        if(!isValid(authorData.lname)){
            return res.status(400).send({status:false,message:"Please provide a valid lname"})
        }
            if(!(/^[a-z ,.'-]+$/i).test(authorData.lname)){
            return res.status(400).send({status:false,message:"last name should not be in alphabate"})
        }
        if(!isValidTitle(authorData.title)){
            return res.status(400).send({status:false,message:"title is missing"})
        }

        if(!isValid(authorData.email)){
            return res.status(400).send({status:false,message:"Please provide a email"})
        }
        if(!validator.validate(authorData.email)){
            return res.status(400).send({status:false,message:"Please provide a valid email"})
        }
        
        //const presentEmail = authorData.email
        const dbemail = await authorModel.findOne({email:authorData.email})
        if(dbemail){
            return res.status(400).send({status:false,message:"email is already used"})
        }

        if(!isValid(authorData.password)){
            return res.status(400).send({status:false,message:"Please provide a valid password"})
        }
        let savedAuthor= await authorModel.create(authorData)
        res.status(201).send({msg: savedAuthor})
    } catch (err) {
            res.status(500).send({ msg: "Error", error: err.message })
        }
} 

//login
const authorlogin = async function (req, res) {
    let data= req.body;
    let userName = data.userName;
    let password = data.password;
    let author = await authorModel.findOne({ email: userName, password: password });
    if (!author)
     return res.send({ status: false,msg: "username or the password is not corerct"});

    if (!validator.validate(userName))
     return res.status(400).send({ status: false, msg: "Enter a valid user name address." }) 

    if (!isValid(password)) 
        res.status(400).send({ status: false, msg: "Please enter your password " })

    let token = jwt.sign(
      {
        userId: author._id.toString(),
        batch: "plutonium",
        organisation: "FunctionUp",
      },
      "suraj_tamoghna_kashish_tanweer"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, token: token });
  };


module.exports.authors = authors,
module.exports.authorlogin = authorlogin