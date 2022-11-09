import * as React from 'react'
import { levelColors } from './levelColors'

interface scoreDisplayPropsIF { 
  currentLevel: number
  linesCleared: number
  totalScore: number
}

const ScoreDisplay = (props: scoreDisplayPropsIF) => {

  const { currentLevel, linesCleared, totalScore } = props

  const styles: React.CSSProperties = {
    backgroundColor: levelColors[currentLevel],
    border: 'gray 2px solid',
    marginBottom: '20px',
    height: '20%',
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: '15px'
  }

  return (
    <div className="score-display" style={styles}>
      <div>Level: </div>
      <div><strong>{currentLevel}</strong></div>
      <div>Lines:</div>
      <div><strong>{linesCleared}</strong></div>
      <div>Score:</div>
      <div><strong>{totalScore}</strong></div>      
    </div>
  )
}

export default ScoreDisplay