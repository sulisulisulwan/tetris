import { levelColors } from '../levelColors'

import * as React from 'react'

import TetriminoTile from '../TetriminoTile.jsx'
import { tetriminoGraphics } from '../tetriminoGraphics'
import { holdQueueIF, levelColorsIF, tetriminoGraphicsIF } from '../../interfaces/AppState'

interface holdQueueDisplayProps {
  holdQueue: holdQueueIF
  currentLevel: number
}

const HoldQueueDisplay = (props: holdQueueDisplayProps) => {

  const { holdQueue, currentLevel } = props

  if (!holdQueue) {
    return null
  }

  let tetriminoName

  if (holdQueue.heldTetrimino) {
    tetriminoName = holdQueue.heldTetrimino.name
  }

  tetriminoName = tetriminoName || 'empty'

  const graphicGrid = tetriminoGraphics[`${tetriminoName}Graphic` as keyof tetriminoGraphicsIF]
  
  const styles = {
    padding: '10px',
    border: 'gray 2px solid',
    height: '100%',
    width: '120px',
    backgroundColor: levelColors[currentLevel as keyof levelColorsIF],
    textAlign: 'center' as 'center'
  }

  if (holdQueue === null) {
    return <div className="holdqueue-wrapper" style={styles}><div className="text-hold">Hold</div></div>
  }  

  return (
    <div className="holdqueue-wrapper" style={styles}>
      <div className="text-hold">Hold</div>
      {<TetriminoTile graphicGrid={graphicGrid} tetriminoName={tetriminoName} classType={'hold'}/>}
    </div>
  )

}

export default HoldQueueDisplay