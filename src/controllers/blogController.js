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

const blog = async function (req, res) {
  try {
    let blogData = req.body;
    if (Object.keys(blogData).length === 0) {
      return res.status(400).send({ status: false, message: "Please give some data" });
    }
    if (!isValid(blogData.title)) {
      return res.status(400).send({ status: false, message: "Please provide a valid title" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.title)) {
      return res.status(400).send({ status: false, message: "title should be in alphabate" });
    }
    if (!isValid(blogData.body)) {
      return res.status(400).send({ status: false, message: "Please provide a valid body" });
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
      return res.status(400).send({ status: false, message: "tags should not be empty" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.tags)) {
      return res.status(400).send({ status: false, message: "tags should be in alphabate" });
    }

    if (!isValid(blogData.category)) {
      return res.status(400).send({ status: false, message: "Please provide a valid category" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.category)) {
      return res.status(400).send({ status: false, message: "category should be in alphabate" });
    }
    if (!isValid(blogData.subcategory)) {
      return res.status(400).send({ status: false, message: "Please provide a valid subcategory" });
    }
    if (!/^[a-z ,.'-]+$/i.test(blogData.subcategory)) {
      return res.status(400).send({ status: false, message: "subcategory should be in alphabate" });
    }

    let savedBlog = await blogModel.create(blogData);
    res.status(201).send({ msg: savedBlog });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
//--------------------get blog---------------------//

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
      let verifySubCategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifySubCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this subcategory exist'})
      }
    }
    if (authorId) {
      if (!mongoose.isValidObjectId(authorId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })
    }
      let verifyAuthorId = await blogModel.findOne({ authorId: authorId})
      if (!verifyAuthorId) {
        return res.status(400).send({ status: false, msg: 'No blogs with this AuthrId' })
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
      { $set: { title: title, isPublished: true, publishedAt: new Date() },
       $push: { tags: tags, subcategory: subcategory} },
      { new: true }
    );
    res.status(201).send({ status: true, data: updateBlog });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

// ---------------delete blog-------------------//

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId);

    if (blog.isDeleted == true) {
      res.status(404).send("This blog is deleted or doesn't exist");
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
      let data = req.query
      
  
  
      if (!Object.keys(data).length)
        return res.status(400).send({ status: false, msg: "Please select some key for deletion." })
      if (data.category) {
        if (!isValid(data.category)) {
          res.status(400).send({ status: false, msg: "Invalid Category " })
        }
      }
      if (data.title) {
        if (!isValid(data.title)) {
          res.status(400).send({ status: false, msg: "Invalid title " })
        }
      }
      if (data.subcategory) {
        if (!isValid(data.subcategory)) {
          res.status(400).send({ status: false, msg: "Invalid subcategory" })
        }
      }
  
      if(data.tags){
        if(!isValid(data.tags)){
          res.status(400).send({status:false,msg:"Invalid tags"})
        }
      }
  
      if (data.authorId) {
        if (!data.authorId) return res.status(400).send({ status: false, msg: 'Author Id must be present' })
  
        if (!mongoose.isValidObjectId(data.authorId))
          return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })
  
        let authId = await authorModel.findById(data.authorId)
  
        if (!authId) { return res.status(400).send({ status: false, msg: "AuthorId doesn't exist." }) }
      }
  
  
  
      let blogs = await blogModel.updateMany(  {data, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
  
      if (!blogs.modifiedCount)
        return res.status(404).send({ status: false, msg: "No documents Found" })
  
      res.status(200).send({ status: true, msg: `Total deleted document count:${blogs.modifiedCount}`, data: blogs })
    } catch (err) {
          return res.status(500).send({ status: false, msg: err.message })
      }
  }

module.exports = {blog, deleteBlog, deleteBlogsByQuery, getblog, updateBlog};

