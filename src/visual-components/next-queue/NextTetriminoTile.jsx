import React from 'react'

const squareColors = new Map([
  ['[i]','green'],
  ['[t]','blue'],
  ['[j]','red'],
  ['[o]','yellow'],
  ['[s]','orange'],
  ['[t]','purple'],
  ['[l]','cyan'],
  ['[z]','white'],
  ['[_]','black']
])

const NextTetriminoTile = ({ tetriminoName, graphicGrid }) => {



  return (
    <div className="next-tetrimino-tile">{graphicGrid.map((row, i) => {
      return <div className="next-tetrimino-tile-row" key={`${tetriminoName}-${i}-row`}>{row.map((square, j) => {
        const style = {
          backgroundColor: squareColors.get(square),
          color: squareColors.get(square),
          borderStyle: 'solid',
          borderColor: 'black',
          fontSize: '10px',
        }
        return <div className="next-tetrimino-tile-square" key={`${tetriminoName}-${i}-${j}-square`} style={style}>{square}</div>
      })}</div>
    })}</div>
  )
}

export default NextTetriminoTile