// Ympäristömuuttujien käsittely on eristetty tänne
// Sovellusten muut osat pääsevät ympäristömuuttujiin käsiksi importtaamalla tämän moduulin komennolla:
// const config = require('./utils/config')
// ÄLÄ COMMITTAA .env TIEDOSTOA!

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }