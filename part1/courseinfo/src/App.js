const Header = (props) => {
  console.log("Calling Header component - Arguments passed", props)
  return(
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  console.log("Calling Part component - Arguments passed", props)
  return(
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )

  
}

const Content = (props) => {
  console.log("Calling Content component - Arguments passed", props)
  return(
    <div>
      <Part part = {props.parts[0]}/>
      <Part part = {props.parts[1]}/>
      <Part part = {props.parts[2]}/>
    </div>  
  )
}

const Total = (props) => {
  console.log("Calling Total component - Arguments passed", props)
  return(
    <p> Number of exercises {props.parts[0].exercises + 
                             props.parts[1].exercises + 
                             props.parts[2].exercises}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course = {course}/>
      <Content parts = {parts} 
      /*part1 = {parts[0].name} 
      part2 = {parts[1].name} 
      part3 ={parts[2].name} 
      exercises1 = {parts[0].exercises} 
      exercises2 = {parts[1].exercises} 
      exercises3 = {parts[2].exercises} */
      />
      <Total   parts = {parts}
               /* exercises1 = {parts[0].exercises} 
               exercises2 = {parts[1].exercises} 
               exercises3 = {parts[2].exercises} */
      />
    </div>
  )
}

export default App