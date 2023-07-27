const Header = ({name}) => {
  console.log({name});
return(<h1>{name}</h1>)
}

const Part = ({part}) => {
  console.log(part);
  return(
    <li>{part.name} {part.exercises}</li>
  )
}

const Content = ({parts}) => (
  <ul>
    {parts.map(part => <Part key={part.id} part={part}/>)}
 </ul>
)


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
  const course = {
    id: 1,
    name: 'Half Stack application development',
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
      }
    ]
  }

  return <Course course={course} />
}

export default App