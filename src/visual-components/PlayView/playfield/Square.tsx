import * as React from 'react'

const squareClasses = new Map([
  ['[i]','iTet playfield-square tetrimino-shimmer'],
  ['[t]','tTet playfield-square tetrimino-shimmer'],
  ['[j]','jTet playfield-square tetrimino-shimmer'],
  ['[o]','oTet playfield-square tetrimino-shimmer'],
  ['[s]','sTet playfield-square tetrimino-shimmer'],
  ['[l]','lTet playfield-square tetrimino-shimmer'],
  ['[z]','zTet playfield-square tetrimino-shimmer'],
  ['[g]','ghostTet playfield-square'],
  ['[_]','empty playfield-square'],
])

interface squarePropsIF {
  squareData: string
}

const Square = (props: squarePropsIF) => {
  const { squareData } = props

  return <div className={squareClasses.get(squareData)}>{squareData}</div>

}

export default Square