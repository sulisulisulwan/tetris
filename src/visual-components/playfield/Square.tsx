import * as React from 'react'

const squareClasses = new Map([
  ['[i]','iTet playfield-square'],
  ['[t]','tTet playfield-square'],
  ['[j]','jTet playfield-square'],
  ['[o]','oTet playfield-square'],
  ['[s]','sTet playfield-square'],
  ['[l]','lTet playfield-square'],
  ['[z]','zTet playfield-square'],
  ['[_]','empty playfield-square']
])

interface squarePropsIF {
  squareData: string
}

const Square = (props: squarePropsIF) => {
  const { squareData } = props
  return <div className={squareClasses.get(squareData)}>{squareData}</div>
}

export default Square