import React from 'react'
import Row from './Row.jsx'

const PlayFieldGrid = ({ playFieldData }) => {

  return (
    <div className="playfield-container">{ playFieldData.map((rowData, i) => <Row key={`row-${i}`} rowData={rowData}/>) }</div>
  )
}

export default PlayFieldGrid