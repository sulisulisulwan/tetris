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

const Square = ({ squareData }) => {
  
  const style = {
    backgroundColor: squareColors.get(squareData),
    color: squareColors.get(squareData),
    borderStyle: 'solid',
    borderColor: 'black',
  }

  return <div className="playfield-square" style={style}>{ squareData }</div>
}

export default Square