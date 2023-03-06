const router = require("express").Router();
const iran = require("../models/iran");

function mapArray(inputArray){
    let outputArray = inputArray.map(element => (
        mapData(element)
    ));

    return outputArray;
}

function mapData(element){
    let outputObj = {
        iran_id : element._id,
        name : element.name,
        description : element.description,
        location : element.location,
        builder : element.builder,
        officialName : element.officialName,
        event : element.event,
        uri : "/api/iran/" + element._id
    }
    return outputObj;
}


//create
router.post("/", (req, res) => {
    data = req.body;
    iran.insertMany(data)
        .then(data => {res.send(data);})
        .catch(err => {err.status(500).send({message : err.message});})
});

//read all
router.get("/", (req, res)=>{
    iran.find()
        .then(data => {res.send(mapArray(data));})
        .catch(err => {res.status(500).send({message : err.message})})
});

//get by name
router.get("/name/:name", (req, res)=>{
    iran.find({name: {$regex: req.params.name}})
        .then(data => res.send(mapArray(data)))
        .catch(err => res.status(500).send({message : err.message}))
});


//get by location
router.get("/location/:location", (req, res) => {
    iran.find({location : {$regex: req.params.location}})
    .then(data => res.send(mapArray(data)))
    .catch(err => res.status(500).send({message : err.message}))
})

//get(read) by Id
router.get("/:id", (req, res)=>{
    iran.findById(req.params.id)
        .then(data => res.send(mapData(data)))
        .catch(err => res.status(500).send({message : err.message}))
});


//update
router.put("/:id", (req, res)=>{
    const id = req.params.id;
    iran.findByIdAndUpdate(id, req.body)
        .then(data => {
            if(!data)
            {
                res.status(404).send({message : "Couldn't update by id = "+ id + " ,try again....!"});
            }
            else
            {
                res.send({message : "updating was success"})
            }
        }).catch(err => res.status(500).send({message : "The update has an error, you could not update -- " + err.message}))
});


//delete
router.delete("/:id", (req, res)=>{
    const id = req.params.id;
    iran.findByIdAndDelete(id)
        .then(data => {
            if(!data)
            {
                res.status(404).send({message : "couldn't delete it by id =  " + id + " ,maybe doesn't exist."})
            }
            else
            {
                res.send({message : "Deleting was success"})
            }
        }).catch(err => res.status(500).send({message : err.message}))
});



module.exports = router;