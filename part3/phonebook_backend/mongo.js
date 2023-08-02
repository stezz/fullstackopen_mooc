const mongoose = require("mongoose")

if (
  process.argv.length < 3 ||
  process.argv.length == 4 ||
  process.argv.length > 5
) {
  console.log(`Usage node mongo.js password [name number]`)
  console.log(
    "If name and number are not defined the app will return all the phonebook entries found"
  )
  process.exit(1)
}

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const encPass = encodeURIComponent(password)

const url = `mongodb+srv://instezz:${encPass}@cluster0.zggnasp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url).catch((err) => {
  console.log("Error:", err)
  mongoose.connection.close()
  process.exit(1)
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (inputName && inputNumber) {
  const person = new Person({
    name: inputName,
    number: inputNumber,
  })

  person
    .save()
    .then((result) => {
      console.log(inputName, "saved!")
      console.log("MongoDB entry:", result)
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log("Error:", err)
      mongoose.connection.close()
      process.exit(1)
    })
} else {
  Person.find({})
    .then((result) => {
      console.log("phonebook")
      result.forEach((element) => {
        console.log("Name:", element.name, "- Number:", element.number)
      })
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log("Error:", err)
      mongoose.connection.close()
      process.exit(1)
    })
}
