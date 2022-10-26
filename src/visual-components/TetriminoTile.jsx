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

const TetriminoTile = ({ tetriminoName, graphicGrid, classType }) => {

  if (!tetriminoName) {
    const style = {
      backgroundColor: squareColors.get(tetriminoName),
      color: squareColors.get(tetriminoName),
      borderStyle: 'solid',
      borderColor: 'black',
      fontSize: '10px',
    }
    return (
      <div className={`${classType}-tetrimino-tile`}>
        <div className={`${classType}-tetrimino-tile-row`}>
          <div className={`${classType}-tetrimino-tile-square`} style={style}>Empty</div>
        </div>
      </div>
    )
  }

  const style = {
    backgroundColor: squareColors.get(tetriminoName),
    color: squareColors.get(tetriminoName),
    borderStyle: 'solid',
    borderColor: 'black',
    fontSize: '10px',
  }

  if (classType === 'hold') {

    return (
      <div className={`${classType}-tetrimino-tile`}>
        {graphicGrid.map((row, i) => {
          return (
            <div className={`${classType}-tetrimino-tile-row`} key={`${classType}-${tetriminoName}-${i}-row`}>
              {row.map((square, j) => {
                const style = {
            backgroundColor: squareColors.get(square),
            color: squareColors.get(square),
            borderStyle: 'solid',
            borderColor: 'black',
            fontSize: '10px',
                }
                return <div className={`${classType}-tetrimino-tile-square`} key={`${classType}-${tetriminoName}-${i}-${j}-square`} style={style}>{graphicGrid}</div>
              })}
            </div>
          )
        })}
      </div>
    )
  }


  return (
    <div className={`${classType}-tetrimino-tile`}>{graphicGrid.map((row, i) => {
      return <div className={`${classType}-tetrimino-tile-row`} key={`${classType}-${tetriminoName}-${i}-row`}>{row.map((square, j) => {
        const style = {
          backgroundColor: squareColors.get(square),
          color: squareColors.get(square),
          borderStyle: 'solid',
          borderColor: 'black',
          fontSize: '10px',
        }
        return <div className={`${classType}-tetrimino-tile-square`} key={`${classType}-${tetriminoName}-${i}-${j}-square`} style={style}>{square}</div>
      })}</div>
    })}</div>
  )
}

export default TetriminoTile