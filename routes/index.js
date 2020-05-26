var express = require('express');
var router = express.Router();

var mysql = require('mysql');

const { v1: uuidv1 } = require('uuid');

var pool = mysql.createPool({
  host:"localhost",
  user:"root",
  password:"",
  database:"mydictionary"
});

/* GET list word. */
router.get('/getword', function(req, res, next) {
  var myquery = "SELECT * FROM dictionary ORDER BY word";

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

router.get("/getwordedit/:id",(req,res,next) => {
  var id = req.params.id;
  pool.getConnection((err,connection) => {
    if(err) throw err;
    var myquery = `SELECT * FROM DICTIONARY WHERE id = ${id}`;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  });
});

router.post("/update",(req,res,next) => {
  const id = req.body.id;
  const word = req.body.word;
  const meaning = req.body.meaning;
  const type = req.body.type;
  const image_link = req.body.image_link;

  pool.getConnection((err,connection) => {
    if (err) throw err;
    var myquery = `UPDATE DICTIONARY SET word='${word}',meaning='${meaning}',type='${type}',image_link='${image_link}' WHERE id = ${id}`;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  });
});


router.get("/getlistaudio",(req,res,next) => {
  var myquery = "SELECT question_id, question FROM QUESTION_AUDIO";
  pool.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  }); 
});

router.get("/audiodetail/:id",(req,res,next) => {
  var id = req.params.id;
  var myquery = `SELECT * FROM QUESTION_AUDIO WHERE question_id ='${id}'`;
  pool.getConnection((err,connection) => {
    if (err) throw err;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  });
});

router.get("/audioscript/:id",(req,res,next) => {
  var id = req.params.id;
  var myquery = `SELECT * FROM SCRIPT_AUDIO WHERE question_id ='${id}'`;
  pool.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  });
}); 

router.post("/addaudio",(req,res,next) => {
  var question = req.body.question.replace("'","''");
  var sentenceA = req.body.sentenceA.replace("'","''");
  var sentenceB = req.body.sentenceB.replace("'","''");
  var sentenceC = req.body.sentenceC.replace("'","''");
  var sentenceD = req.body.sentenceD.replace("'","''");
  var answer = req.body.answer;
  var imageURL = req.body.imageURL;
  var audioURL = req.body.audioURL;

  const question_id = uuidv1().substr(0,12);
  // Add data to table: question_audio and script_audio
  pool.getConnection((err,connection) => {
    if(err) throw err;
    var myquery = `CALL addQuestionScriptAudio('${question_id}','${audioURL}','${imageURL}','${question}','${answer}','${sentenceA}','${sentenceB}','${sentenceC}','${sentenceD}')`;
    connection.query(myquery,(error,respone) => {
      connection.release();
      if(error) throw error;
      res.send(respone);
    });
  });
});

module.exports = router;
