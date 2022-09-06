const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModels");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const blog = async function (req, res) {
  try {
    let blogData = req.body;
    if (Object.keys(blogData).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please give some data" });
    }
    if (!isValid(blogData.title)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid title" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.title)) {
      return res
        .status(400)
        .send({ status: false, message: "First name should be in alphabate" });
    }
    if (!isValid(blogData.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid body" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.body)) {
      return res
        .status(400)
        .send({ status: false, message: "body should be in alphabate" });
    }

    if (!/^[a-z ,.'-]+$/i.test(blogData.tags)) {
      return res
        .status(400)
        .send({ status: false, message: "tags should be in alphabate" });
    }
    // if(!isValidTitle(blogData.tags)){
    //     return res.status(400).send({status:false,message:"tags should not be empty"})
    // }

    if (!isValid(blogData.category)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid category" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.category)) {
      return res
        .status(400)
        .send({ status: false, message: "category should be in alphabate" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "subcategory should be in alphabate" });
    }

    const isDeleted = await blogModel.findOneAndUpdate(
      { isDeleted: true },
      { deleteAt: new Date() }
    );
    res.send({ status: true, data: isDeleted });
    // if(blogData.isDeleted===true){
    //     blogData['deletedAt']=new Date()
    // }

    const isPublished = await blogModel.findOneAndUpdate(
      { isPublished: true },
      { publishedAt: new Date() }
    );
    res.send({ status: true, data: isPublished });

    // if(blogData.isPublished===true){
    //     blogData['publishedAt']=new Date()
    // }
    let authorId = req.body.authorId;
    if (!authorId) {
      return res.status(403).send("author id not found");
    }
    let author = await authorModel.findById(authorId);
    if (author !== authorId) {
      return res.status(403).send("invalid author");
    }

    let savedBlog = await blogModel.create(blogData);
    res.status(201).send({ msg: savedBlog });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};



const getblog = async function (req, res) {

    try {
        let data = req.query
        let allblog = await blogModel.find({ $and: [data, { isDeleted: false }, { isPublished: true }] });
        res.send({ status: true, msg: allblog })
    } catch (error) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}




module.exports.blog = blog;
module.exports.getblog=getblog
