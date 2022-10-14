import { ITetrimino } from '../ITetrimino.js'
import { OTetrimino } from '../OTetrimino.js'
import { STetrimino } from '../STetrimino.js'
import { ZTetrimino } from '../ZTetrimino.js'
import { TTetrimino } from '../TTetrimino.js'
import { JTetrimino } from '../JTetrimino.js'
import { LTetrimino } from '../LTetrimino.js'



const tetriminos = [
  // new ITetrimino(),
  // new OTetrimino(),
  // new STetrimino(),
  // new ZTetrimino(),
  // new TTetrimino(),
  // new JTetrimino(),
  new LTetrimino()
]

tetriminos.forEach(tetrimino => {

  const orientations = ['north', 'east', 'south', 'west']

  orientations.forEach(orientation => {
    const resultGrid = tetrimino.getGivenOrientation(orientation)
    console.log(`For ${tetrimino.constructor.name} oriented ${orientation.toUpperCase()}:`, resultGrid)
  })
})