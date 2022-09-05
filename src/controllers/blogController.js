const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModels")

const blog = async function(req,res){
    try {
        let blogData= req.body
        let authorId = req.body
        if(!authorId)
        {
            return res.status(403).send("author id not found")
        }
       let author = await authorModel.findById(authorId)
        if(author!== authorId){
           return res.status(403).send("invalid author")
        }
        let savedBlog= await blogModel.create(blogData)
        res.status(201).send({msg: savedBlog})
    } catch (err) {
            res.status(500).send({ msg: "Error", error: err.message })
        }
}
module.exports.blog = blog