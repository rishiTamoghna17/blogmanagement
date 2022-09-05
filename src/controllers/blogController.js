const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")

const blog = async function(req,res){
    try {
        let blogData= req.body
        let authorId = req.body
       let author = await authorModel.findById(authorId)
        if(!authorId)
        {
            return res.send("author id not found")
        }
        if(author!== authorId){
           return res.send("invalid author")
        }
        let savedBlog= await blogModel.create(blogData)
        res.status(201).send({msg: savedBlog})
    } catch (err) {
            res.status(500).send({ msg: "Error", error: err.message })
        }
}
module.exports.blog = blog