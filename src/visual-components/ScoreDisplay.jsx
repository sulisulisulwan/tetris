import React from 'react'

const ScoreDisplay = ({scoreData}) => {


  return (
    <div className="score-display">
      Score: <br></br>
      <strong>{scoreData}</strong>
    </div>
  )
}

export default ScoreDisplay