var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var pool = mysql.createPool({
  host:"localhost",
  user:"root",
  password:"",
  database:"mydictionary"
});

/* GET home page. */
router.get('/getword', function(req, res, next) {
  var myquery = "SELECT * FROM dictionary";

  pool.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(myquery,(err,rows) => {
      connection.release();
      if (err) throw err;
      res.send(rows);
    });
  });
});

// Add new word
router.post('/addnewword',(req,res,next) => {
  const word = req.body.word;
  const meaning = req.body.meaning;
  const type = req.body.type;
  const image_link = req.body.image_link;
  // console.log(req.body);
  pool.getConnection((err,connection) => {
    if(err) throw err;
    var myquery = "INSERT INTO DICTIONARY (word,meaning,type,image_link) VALUES ('"+ word +"','"+meaning+"','"+type+"','"+image_link+"')";
    connection.query(myquery,(error,respone) => {
      connection.release();
      if (error) throw error;
      res.send(respone);
    });
  });

});


router.get("/deleteword/:id",(req,res,next) => {
  var id = req.params.id;
  pool.getConnection((err,connection) => {
    if(err) throw err;
    var myquery = "DELETE FROM DICTIONARY WHERE id = " + id ;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  });
});

module.exports = router;
