//import
const express =  require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//swagger denepdencies

const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs");

//make object
const app = express();

//config swagger
const swaggerDoc = YAML.load('./swagger.yaml');
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


const {verifyToken} = require("./validation");

//import dotenv for access to env file
require("dotenv-flow").config();
// define a Constant
const PORT = process.env.PORT || 4000;
//import routes
const iranRoutes = require("./routes/iran");
const authRoutes = require("./routes/authentication");
//parser request of content-type JSON
app.use(bodyParser.json());



//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({message : "Hello and say welcome to Iranian historical place, you can see all information about them"});
});
//middleware of routes
app.use("/api/iran",/* verifyToken,*/iranRoutes);
app.use("/api/user", authRoutes);

mongoose.set('strictQuery', true);

// connect to db
mongoose.connect
(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log(`Connenting to MongoDB faied -- ${error}`));

mongoose.connection.once("open", () => console.log("Connected succesfully to MongoDB"));

//make a server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} => http://localhost:${PORT}`);   
});

//export
module.exports = app;