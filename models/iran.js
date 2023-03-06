const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iranSchema = new Schema
(
    {
        name : {type : String},
        description : {type : String},
        location : {type : String},
        builder : {type : String},
        officialName : {type : String},
        event : {type : String}
    }
);

module.exports = mongoose.model("iran", iranSchema);