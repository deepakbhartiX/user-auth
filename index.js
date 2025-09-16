const dotenv = require('dotenv')
dotenv.config();

const { route } = require('./routes/user.auth.route')
const cookieParser = require('cookie-parser')
const mongodb = require('mongoose')
const express = require('express');
const path = require('path');
const { error } = require('console');
const { errorhandler } = require('./middleware/error.handler.middleware');
const app = express();
const port = process.env.PORT || 5000;

//injecting static file path for express to render
app.use(express.static(path.resolve('./public')))

app.use(cookieParser());
app.use(express.json())  // use when to get data in json from frontend
app.use(express.urlencoded({ extended: true })); //use when deal with form-urlencoded data



//providing static file
 
app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
})


//app routes

app.use(route)

//mongodb connection establish
mongodb.connect(process.env.MONGOOSE_URL).then(
    console.log("connected to mongodb atlas")
).catch(error => console.log(`Mongoose Connection Error:${error}`));


//error handling middlleware

app.use(errorhandler)


//running app on port
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

