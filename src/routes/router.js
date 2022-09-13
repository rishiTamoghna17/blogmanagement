const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
 const blogController= require("../controllers/blogController")
 const {authenticate,authorization,specialAuthorization} = require("../middleware/auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
}) 

router.post("/authors", authorController.authors)
router.post("/login", authorController.authorlogin)
router.post("/blogs",authenticate, blogController.blogs)
router.get("/getblogs",authenticate, blogController.getblogs)
router.put("/blogs/:blogId",authenticate,authorization,blogController.updateBlogs)
router.delete("/deleteBlogs/:blogId",authenticate,authorization, blogController.deleteBlogs)
router.delete("/deleteBlogsByQuery",authenticate,specialAuthorization,blogController.deleteBlogsByQuery)
module.exports = router; 