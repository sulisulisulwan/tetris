import * as React from 'react'

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

interface tetriminoTilePropsIF {
  tetriminoName: string
  graphicGrid: string[][]
  classType: string
}

const TetriminoTile = (props: tetriminoTilePropsIF) => {

  const { tetriminoName, graphicGrid, classType } = props

  if (!tetriminoName) {
    const style = {
      backgroundColor: squareColors.get(tetriminoName),
      color: squareColors.get(tetriminoName),
      borderStyle: 'solid',
      borderColor: 'black',
      fontSize: '10px',
      margin: 'auto auto',
      justifyContent: 'center'
    }
    return (
      <div className={`tetrimino-tile`}>
        <div className={`tetrimino-tile-row`}>
          <div className={`tetrimino-tile-square`} style={style}>Empty</div>
        </div>
      </div>
    )
  }

  const tileStyle = {
    backgroundColor: squareColors.get(tetriminoName),
    opacity: '.9',
    color: squareColors.get(tetriminoName),
    border: 'solid black',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '60%',
    maxHeight: '80px',
    justifyContent: 'center'
  }

  return (
    <div className={`${classType}-tetrimino-tile`} style={tileStyle}>
      {graphicGrid.map((row, i) => {
        return (
          <div className={`tetrimino-tile-row`} key={`${classType}-${tetriminoName}-${i}-row`}>{row.map((square, j) => {
            const emptySquareStyle = {
              backgroundColor: squareColors.get(square),
              color: squareColors.get(square),
              borderStyle: 'solid',
              fontSize: '10px',
              height: 15,
              borderRadius: '20%',
              overflow: 'hidden'
            }

            const minoStyle = {
              backgroundColor: squareColors.get(square),
              color: squareColors.get(square),
              borderStyle: 'solid',
              borderColor: 'black',
              fontSize: '10px',
              borderRadius: '20%',
              overflow: 'hidden',
            }
            return (
              <div 
                className={`tetrimino-tile-square`} 
                key={`${classType}-${tetriminoName}-${i}-${j}-square`} 
                style={square ==='[_]' ? emptySquareStyle : minoStyle}
              >
                {square}
              </div>
            )
      })}</div>
        )
    })}</div>
  )
}

export default TetriminoTile