const express = require('express')
const jf = require('jsonfile')
const fs = require('fs')
const uuid = require('uuid')


const router = express.Router()

router.get('/:id', showComparison)
router.post('/:id', createComparisonWithId)
router.post('/', createComparison)

//return the comparison given an id, if it exsits
function showComparison(req, res) {
  const id = req.params.id
  return readRecord(res, id)
}

// Creates a new comparison
function createComparison(req, res) {
  //generate a new id
  const id = uuid() 
  const {a,b} = req.body

  return writeRecord(res, id, {a,b,id})  
}

// Creates a new comparison
function createComparisonWithId(req, res) {
  //use the id provided in the req
  const id = req.params.id
  const {a, b} = req.body


  return writeRecord(res, id, {a, b, id})
}

//reads the record from the database
function readRecord(res, id, data) {
  //generate a filename
  const filename = fnData(id)

  //check if that file exists
  fs.exists(filename, function (exists) {
    //if the file does not exist, return a 404
    if (!exists)  return res.status(404).send(`Data id ${id} not found.`)

    //otherwise, read the file as JSON
    jf.readFile(filename, function(err, data) {
      if(err) { return handleError(res, err) }

      //and return
      return res.json(data)
    })
  })
}

//writes the record to the database, if it doesn't exist
function writeRecord(res, id, data) {

  //look up its filename
  var filename = fnData(id)

  //need to test that the file does not exist

  //check if that file exists
  fs.exists(filename, (exists) => {
    //if the file already exists, return a 405
    if (exists)  return res.status(405).send(`Data id ${id} is already in use.`)


    //and write it to the filesystem
    jf.writeFile(filename, data, (err) => (
      err ?
        handleError(res, err) :
        //if successful, return the comparison object
        res.status(201).json(data)
    ))
  })
}

module.exports = router

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}


// returns a filename for the given comparison
function fnData (id) {
  return "./data/" + "id-" + id + ".json";
}
