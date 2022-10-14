import React from 'react'
import Square from './Square.jsx'
const Row = ({ rowData }) =>  <div className="playfield-row">{ rowData.map((squareData, i) => <Square key={`square-${i}`} squareData={squareData}/>) }</div>

export default Row;