const Header = ({name}) => {
  console.log({name});
return(<h2>{name}</h2>)
}

const Part = ({part}) => {
  console.log(part)
  return(
    <li>{part.name} {part.exercises}</li>
  )
}

const Content = ({parts}) => {
  // mapping the exercise numbers to a single Array
  const exercises = parts.map(part => part.exercises)
  // using reduce to calculate the sum
  const total = exercises.reduce((sum, ex) => sum + ex, 0)
  console.log(exercises, total)
  return (
  <div>
  <ul>
    {parts.map(part => <Part key={part.id} part={part}/>)}
 </ul>
 <b>Total number of exercises: {total}</b>
 </div>
)
  }


const Course = ({course}) => {
  console.log({course});
return(
<div>
  <Header name={course.name}/>
    <Content parts={course.parts}/>
</div>
)
}



const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web Development Curriculum</h1>
    {courses.map(course => <Course key={course.id} course={course} />)}
    </div>)
}

export default App