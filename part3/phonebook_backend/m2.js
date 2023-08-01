
const mongoose = require('mongoose')
const password = process.argv[2]
const encPass = encodeURIComponent(password)
const url =
  `mongodb+srv://instezz:${password}@cluster0.zggnasp.mongodb.net/phApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


console.log(`adding ${process.argv[3]} to Mongo DB`)
const name = process.argv[3]
const number = process.argv[4]

console.log(Person);
console.log(name, number)
const person = new Person({
    "name": name,
    "number": number,
  }
)
person.save().then(result => {
  console.log(person, "saved");
  mongoose.connection.close()
})
console.log(person)
