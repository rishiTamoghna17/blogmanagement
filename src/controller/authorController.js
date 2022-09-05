const mongoose = require("mongoose");
const authorModel = require("../model/authorModel")


//Authour Creation

const createAuthor= async function (req, res) {
    try {
        let authorData= req.body
        let savedAuthor= await authorModel.create(authorData)
        res.status(201).send({msg: savedAuthor})
    } catch (err) {
            res.status(500).send({ msg: "Error", error: err.message })
        }
} 


module.exports.createAuthor = createAuthor