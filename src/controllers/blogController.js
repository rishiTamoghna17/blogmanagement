const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModels");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//------------------ blog create------------//

const blogs = async function (req, res) {
  try {
    let blogData = req.body;
    if (Object.keys(blogData).length === 0) {
      return res.status(400).send({ status: false, message: "Please give some data" });
    }
    if (!isValid(blogData.title)) {
      return res.status(400).send({ status: false, message: "title is missing or you left empty" });
    }
    if (!isValid(blogData.body)) {
      return res.status(400).send({ status: false, message: "body is missing or you left empty" });
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
      return res.status(400).send({status:false,message:"authorId is not valid"})
    }
    if (!isValid(blogData.tags)) {
      return res.status(400).send({ status: false, message: "tags is missing or you left empty" });
    }
    if (!isValid(blogData.category)) {
      return res.status(400).send({ status: false, message: "category is missing or you left empty" });
    }
    if (!isValid(blogData.subcategory)) {
      return res.status(400).send({ status: false, message: " subcategory is missing or you left empty" });
    }

    let savedBlog = await blogModel.create(blogData);
    res.status(201).send({ status:true , msg: "succes" , data: savedBlog});
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
//--------------------get blog---------------------//

const getblogs = async function (req, res) {
  try {

    let data = req.query;
    if (Object.keys(data).length === 0) {
      return res.status(400).send({ status: false, message: "Please give some data" });
    }
    let filter = {isDeleted: false, isPublished: true, ...data};
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
      let verifySubCategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifySubCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this subcategory exist'})
      }
    }
    if (authorId) {
      if (!mongoose.isValidObjectId(authorId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })
    }
     
    let getRecord = await blogModel.find(filter)
    if(!getRecord){
      return res.status(404).send({ status: false, msg: 'not found' })
    }
    return res.status(200).send({ status: true, data: getRecord });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message });
  }
};
 
//--------------------update/put blog-------------------//

const updateBlogs = async function (req, res) {
  try {
    let blogId = req.params.blogId;

    if(!blogId){
      return res.status(400).send({status: false, message: "Please provide blogId"})
    }
    if(!mongoose.isValidObjectId(blogId)){
      return res.status(400).send({status:false,message:" invalid blogId length"})
    }

    let blogs = await blogModel.findById(blogId);
    if (!blogs) {
      return res.status(404).send({status:false, massege: "blog doesn't exists"});
    }
    if (blogs.isDeleted == true) {
      return res.status(404).send({status:false, massege: "blog is deleted so not updeted"});
    }
    let blogData = req.body;
    const { title, body, tags, subcategory } = blogData;

    let updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { title: title, body: body, isPublished: true, publishedAt: new Date() },
       $push: { tags: tags, subcategory: subcategory} },
      { new: true }
    );
    res.status(201).send({ status: true, data: updateBlog });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

// ---------------delete blog-------------------//

const deleteBlogs = async function (req, res) {
  try {
    let blogId = req.params.blogId; 

    if(!blogId){
      return res.status(400).send({status: false, message: "Please provide authorId"})
    }
    if(!mongoose.isValidObjectId(blogId)){
      return res.status(400).send({status:false,message:" invalid authorId length"})
    }
    let blog = await blogModel.findById(blogId);
    if(!blog){
      res.status(404).send({status:false, massege: "blog doesn't exists"});
    }

    if (blog.isDeleted == true) {
      res.status(404).send({status:false, massege: "blog is allready deleted"});
    } else {
      let deleteBlog = await blogModel.findOneAndUpdate({ _id: blogId },{ isDeleted: true, deletedAt: new Date() },{ new: true });
      return res.status(200).send({status: true, msg: "blog is deleted successfully", data: deleteBlog,});
    }
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
    //----------------------delete blog by params-----------------------//
    
  const deleteBlogsByQuery = async function (req, res) {
    try {
      let data = req.query;
    let filter = {...data};
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
      let verifySubCategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifySubCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this subcategory exist'})
      }
    }
    if (authorId) {
      let verifyAuthorId = await blogModel.findOne({ authorId: authorId})
      if (!verifyAuthorId) {
        return res.status(400).send({ status: false, msg: 'No blogs with this AuthrId' })
      }
    }
      let blogs = await blogModel.updateMany(  {filter, isDeleted: false }, 
        { isDeleted: true, deletedAt: Date.now() },
         { new: true })

      if (!blogs.modifiedCount)
        return res.status(404).send({ status: false, msg: "No documents Found" })
  
      res.status(200).send({ status: true, msg: `Total deleted document count:${blogs.modifiedCount}`, data: blogs })
    } catch (err) {
          return res.status(500).send({ status: false, msg: err.message })
      }
  }

module.exports = {blogs, deleteBlogs, deleteBlogsByQuery, getblogs, updateBlogs};

