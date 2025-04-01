const verifyToken = require('./verifyToken').verifyToken;
const sendEmailTeachers = require('./sendEmail').sendEmailTeachers;

// Exportando las funciones para que puedan ser desplegadas por Firebase
module.exports = {
  verifyToken,
  sendEmailTeachers,
};