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
        .send({ status: false, message: "title should be in alphabate" });
    }
    if (!isValid(blogData.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid body" });
    }
    if(!blogData.authorId){
      return res.status(400).send({status: false, message: "Please provide authorId"})
    }
    if(!mongoose.isValidObjectId(blogData.authorId)){
      return res.status(400).send({status:false,message:" invalid authorId length"})
    }
    let authorId= blogData.authorId
    let validAuthorId=await authorModel.findById(authorId)
    if(!validAuthorId){
      return res.status(400).send({status:false,message:"id is not valid"})
    }


    if (!isValid(blogData.tags)) {
      return res
        .status(400)
        .send({ status: false, message: "tags should not be empty" });
    }

    if (!/^[a-z ,.'-]+$/i.test(blogData.tags)) {
      return res
        .status(400)
        .send({ status: false, message: "tags should be in alphabate" });
    }

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


    if (!isValid(blogData.subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid subcategory" });
    }

    if (!/^[a-z ,.'-]+$/i.test(blogData.subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "subcategory should be in alphabate" });
    }

    let savedBlog = await blogModel.create(blogData);
    res.status(201).send({ msg: savedBlog });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
//get blog
const getblog = async function (req, res) {
  try {

    let data = req.query;
    let filter = {isDeleted: false, isPublished: true,...data};

    const { authorId, category, tags, subcategory } = data

    if (category) {
      let verifyCategory = await blogModel.findOne({ category: category })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
      }
    }
    if (tags) {
      let verifyTag = await blogModel.findOne({ tags: tags })
      if (!verifyTag) {
        return res.status(400).send({ status: false, msg: 'No blogs in this tags exist' })
      }
    }
    if (subcategory) {
      let verifyCategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this subcategory exist' })
      }
    }


    if (authorId) {
      
      if (!mongoose.isValidObjectId(authorId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })
    }

    let GetRecord = await blogModel.find(filter)


    if (GetRecord.length == 0) {
      return res.status(404).send({
        data: "No such document exist with the given attributes.",
      });
    }

    res.status(200).send({ status: true, data: GetRecord });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message });
  }
};

//update/put blog
const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    
    let blogs = await blogModel.findById(blogId);
    if (!blogs) {
      return res.status(404).send("blog doesn't exists");
    }
    if (blogs.isDeleted == true) {
      return res.status(404).send("This blog is deleted");
    }
    let blogData = req.body;
    const { title, body, tags, subcategory,category } = blogData
    let updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { title: title, body:body, isPublished: true, publishedAt: new Date() },
       $push: { tags: tags, subcategory: subcategory, category:category} },
      { new: true }
    );
    res.status(201).send({ status: true, data: updateBlog });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

// del blog
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    console.log(blogId);
    let blog = await blogModel.findById(blogId);

    if (blog.isDeleted == true) {
      res.status(404).send("This blog is deleted or doesn't exist");
    } else {
      let deleteBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      );
      res
        .status(200)
        .send({
          status: true,
          msg: "blog is deleted successfully",
          data: deleteBlog,
        });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
    //del by params
    const deleteBlogsByQuery = async function (req, res) {

      try {
          let {category, authorId, tags, subcategory, isPublished} = req.query
  
          let deleteData = await blogModel.updateMany({ 
  
              authorId : req.decodedToken.authorId,
              isDeleted: false, $or: [{ authorId: authorId },
              { isPublished: isPublished },
              { tags: tags },
              { category: category },
              { subcategory: subcategory }] 
          }, 
          {$set:  {isDeleted: true}, deletedAt : Date.now()}, 
              { new: true })
  
          if (deleteData.modifiedCount == 0) {
              return res.status(404).send({status: false, msg: "All documents are already deleted"})
          }
  
          return res.status(200).send({ status: true, data: deleteData, msg: "Now, following blogs are deleted " })
      } catch (err) {
          return res.status(500).send({ status: false, msg: err.message })
      }
  }


module.exports.blog = blog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogsByQuery = deleteBlogsByQuery;
module.exports.getblog = getblog;
module.exports.updateBlog = updateBlog;
