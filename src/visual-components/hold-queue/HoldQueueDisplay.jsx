import { levelColors } from '../levelColors'

import React from 'react'

import TetriminoTile from '../TetriminoTile.jsx'

class HoldQueueDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.OTetriminoGraphic = [
      ['[_]', '[_]', '[_]'],
      ['[_]', '[o]', '[o]'],
      ['[_]', '[o]', '[o]']
    ]
    this.ITetriminoGraphic = [
      ['[_]', '[_]', '[_]', '[_]'],
      ['[i]', '[i]', '[i]', '[i]'],
      ['[_]', '[_]', '[_]', '[_]'],
      ['[_]', '[_]', '[_]', '[_]'],
      ['[_]', '[_]', '[_]', '[_]']
    ]
    this.JTetriminoGraphic = [
      ['[j]', '[_]', '[_]'],
      ['[j]', '[j]', '[j]'],
      ['[_]', '[_]', '[_]']
    ]
    this.LTetriminoGraphic = [
      ['[_]', '[_]', '[l]'],
      ['[l]', '[l]', '[l]'],
      ['[_]', '[_]', '[_]']
    ]
    this.STetriminoGraphic = [
      ['[_]', '[s]', '[s]'],
      ['[s]', '[s]', '[_]'],
      ['[_]', '[_]', '[_]']
    ]
    this.ZTetriminoGraphic = [
      ['[z]', '[z]', '[_]'],
      ['[_]', '[z]', '[z]'],
      ['[_]', '[_]', '[_]']
    ]
    this.TTetriminoGraphic = [
      ['[_]', '[t]', '[_]'],
      ['[t]', '[t]', '[t]'],
      ['[_]', '[_]', '[_]']
    ]
    this.emptyGraphic = [
      ['[_]', '[_]', '[_]'],
      ['[_]', '[_]', '[_]'],
      ['[_]', '[_]', '[_]']
    ]
  }


  render() {

    const { holdQueue, currentLevel } = this.props
    
    if (!holdQueue) {
      return null
    }

    let tetriminoName

    if (holdQueue.heldTetrimino) {
      tetriminoName = holdQueue.heldTetrimino.name
    }

    tetriminoName = tetriminoName || 'empty'

    const graphicGrid = this[`${tetriminoName}Graphic`]
    

    const styles = {
      padding: '10px',
      border: 'gray 2px solid',
      height: '100%',
      width: '120px',
      backgroundColor: levelColors[currentLevel],
      textAlign: 'center'
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
}

export default HoldQueueDisplay