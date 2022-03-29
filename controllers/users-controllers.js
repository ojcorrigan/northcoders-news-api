const res = require('express/lib/response');
const { selectUsers } = require('../models/users-models');

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch(next);
};