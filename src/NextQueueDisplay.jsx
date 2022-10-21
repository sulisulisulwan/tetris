import React from "react";
import NextTetriminoTile from './NextTetriminoTile.jsx'

class NextQueueDisplay extends React.Component {

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
  }

  render () {

    const { nextQueueData } = this.props

    if (nextQueueData === null) {
      return <div className="nextqueue-wrapper">Not yet rendered</div>
    }  

    return(
      <div className="nextqueue-wrapper">
        <div className="text-next">Next</div>
        {nextQueueData.map((tetriminoName, i)=> {
          const graphicGrid = this[`${tetriminoName}Graphic`]
          return <NextTetriminoTile key={`${tetriminoName}-${i}`} graphicGrid={graphicGrid} tetriminoName={tetriminoName}/>
          
        })}
      </div>
    )
  }
}

export default NextQueueDisplay