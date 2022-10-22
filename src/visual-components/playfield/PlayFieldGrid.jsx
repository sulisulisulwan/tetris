import React from 'react'
import Row from './Row.jsx'
import { levelColors } from '../levelColors.js'

const PlayFieldGrid = ({ playFieldData, currentLevel }) => {

  const style = {
    fontFamily: 'monospace',
    padding: '10px',
    border: 'gray 3px solid',
    backgroundColor: levelColors[currentLevel]
  }

  return (
    <div className="playfield-container" style={style}>{ playFieldData.map((rowData, i) => <Row key={`row-${i}`} rowData={rowData}/>) }</div>
  )
}

export default PlayFieldGrid