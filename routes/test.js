const {v1: uuidv1} = require('uuid');

var id = uuidv1().substr(0,12);

console.log(id);