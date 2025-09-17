// MongoDB
// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// skeema henkilöille.
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlenght: 2,
    required: true,
  },
  number: {
    type: String,
    minlenght: 3,
    required: true,
  },
})

// poistaa '_id' ja '__v' kentät
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)