const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const encPass = encodeURIComponent(password)

const url =
  `mongodb+srv://instezz:${encPass}@cluster0.zggnasp.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)


const note = new Note({
  content: 'HTML is Easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

/*
const note = new Note({
    content: '1..2..3... test',
    important: true,
  })
  
  note.save().then(result => {
    console.log(note)
    mongoose.connection.close()
  })

  const note1 = new Note({
    content: 'is this working ?',
    important: true,
  })
  
  note1.save().then(result => {
    console.log(note1)
    mongoose.connection.close()
  })
  */
Note.find({important:'true'}).then(result => {
    console.log(result);
    mongoose.connection.close()})
