import * as React from 'react'
import Row from './Row'
import { levelColors } from '../levelColors'


interface playfieldGridPropsIF { 
  playfieldData: string[][]
  currentLevel: number
  currentGamePhase: string
}

const PlayfieldGrid = (props: playfieldGridPropsIF) => {

  const { playfieldData, currentLevel, currentGamePhase } = props

  const style = {
    fontFamily: 'monospace',
  }
  
  if (currentGamePhase === 'gameOver') {

    const gameOverWrapperStyle = {
      position: 'absolute' as 'absolute',
      bottom: '250px',
      left: '25%',
    }

    const gameOverStyle = {
      color: 'white',
      fontFamily: 'Andale Mono',
      fontSize: '60px',
      fontWeight: 'bold',
      textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'

    }

    
    return (
      <div className="playfield-container" style={style}>
        { playfieldData.map((rowData, i) => <Row key={`row-${i}`} rowData={rowData}/>) }
        <div style={gameOverWrapperStyle}>
          <div style={gameOverStyle}>GAME</div>
          <div style={gameOverStyle}>OVER</div>
        </div>
      </div>
    )
  }

  return (
    <div className="playfield-container" style={style}>{ playfieldData.map((rowData, i) => <Row key={`row-${i}`} rowData={rowData}/>) }</div>
  )
}

export default PlayfieldGrid