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
    minlength: [3, 'Name must be 3 or more characters long'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minlength: [8, 'Phone number must be 8 or more numbers long'],
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        // hyväksyy puhelinnumeron muodossa XX-XXXXXXX tai XXX-XXXXXXXX
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not valid phone number!`
    }
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