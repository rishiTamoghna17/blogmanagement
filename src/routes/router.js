const express = require('express');
const router = express.Router();
const authorController= require("../controllers/othorController")
const blogController= require("../controllers/blogController")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createOthor", authorController.createAuthor)