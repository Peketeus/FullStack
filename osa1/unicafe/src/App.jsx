import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  if (props.all == 0) {
    return <div>No feedback given</div>
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good " value={props.good}/>
        <StatisticLine text="neutral " value={props.neutral} />
        <StatisticLine text="bad " value={props.bad} />
        <StatisticLine text="all " value={props.all} />
        <StatisticLine text="average " value={props.average} />
        <StatisticLine text="positive " value={`${props.positive} %`} />
      </tbody>
    </table>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad;
  const average = all ? (good - bad) / all : 0;
  const positive = all ? (good / all) * 100 : 0;

  const badValue = newValue => {
    console.log('badValue now', newValue)
    setBad(newValue)
  }
  const neutralValue = newValue => {
    console.log('neutralValue now', newValue)
    setNeutral(newValue)
  }
  const goodValue = newValue => {
    console.log('goodValue now', newValue)
    setGood(newValue)
  }

  return (   
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => goodValue(good + 1)} text="good" />
      <Button handleClick={() => neutralValue(neutral + 1)} text="neutral" />
      <Button handleClick={() => badValue(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics
        good={good} 
        neutral={neutral} 
        bad={bad} 
        all={all} 
        average={average} 
        positive={positive}
      />
    </div>
  )
}

export default App