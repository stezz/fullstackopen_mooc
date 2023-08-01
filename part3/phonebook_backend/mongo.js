
const mongoose = require('mongoose')
const password = process.argv[2]
const encPass = encodeURIComponent(password)
const url =
  `mongodb+srv://instezz:${password}@cluster0.zggnasp.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length === 5) {
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
  let run = true
  process.exit(1)

}


if (process.argv.length === 3) {
  console.log('querying the database')
  Person.find({}).then(result => {
    console.log(result);
    mongoose.connection.close()
  })
  let run = true 
  process.exit(1)

} 


if (!run) { 
  console.log('This program takes 3 arguments: node mongo.js {password} {"Name surname"} {phone number}')
  process.exit(1)
}
