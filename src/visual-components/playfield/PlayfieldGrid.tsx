import * as React from 'react'
import Row from './Row'
import { levelColors } from '../levelColors'


interface playfieldGridPropsIF { 
  playfieldData: string[][]
  currentLevel: number
}

const PlayfieldGrid = (props: playfieldGridPropsIF) => {

  const { playfieldData, currentLevel } = props

  const style = {
    fontFamily: 'monospace',
    padding: '10px',
    border: 'gray 3px solid',
    backgroundColor: levelColors[currentLevel]
  }

  return (
    <div className="playfield-container" style={style}>{ playfieldData.map((rowData, i) => <Row key={`row-${i}`} rowData={rowData}/>) }</div>
  )
}

export default PlayfieldGrid