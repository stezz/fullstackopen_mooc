const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/*
// Another way is using Mongoose virtual fields to solve ex. 4.9
blogSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
blogSchema.set('toJSON', {
  virtuals: true
});
*/
module.exports = mongoose.model('Blog', blogSchema)
