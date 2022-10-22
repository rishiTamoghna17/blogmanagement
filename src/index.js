
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/router.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://surajkumar96:6i0d4EhtRtZ5xCEQ@cluster0.mqcx8wl.mongodb.net/group_38", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
