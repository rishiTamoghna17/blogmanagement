const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
 const blogController= require("../controllers/blogController")
 const {authenticate,authorise} = require("../middleware/auth")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
}) 

router.post("/authors", authorController.authors)
router.post("/login", authorController.authorlogin)
router.post("/blog",authenticate, blogController.blog)
router.get("/getblog",authenticate, blogController.getblog)
router.put("/blogs/:blogId",authenticate,authorise,blogController.updateBlog)
router.delete("/deleteBlog/:blogId",authenticate,authorise, blogController.deleteBlog)
router.delete("/deleteBlogsByQuery", authenticate,authorise,blogController.deleteBlogsByQuery)
module.exports = router;