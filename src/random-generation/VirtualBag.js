import { ITetrimino } from '../components/tetriminos/ITetrimino.js'
import { OTetrimino } from '../components/tetriminos/OTetrimino.js'
import { STetrimino } from '../components/tetriminos/STetrimino.js'
import { ZTetrimino } from '../components/tetriminos/ZTetrimino.js'
import { TTetrimino } from '../components/tetriminos/TTetrimino.js'
import { JTetrimino } from '../components/tetriminos/JTetrimino.js'
import { LTetrimino } from '../components/tetriminos/LTetrimino.js'

export class VirtualBag {

  constructor() {
    this.tetriminos = [
      ITetrimino, OTetrimino, 
      STetrimino, ZTetrimino,
      TTetrimino, JTetrimino, 
      LTetrimino
    ]
    this.bag = this.getShuffledTetriminos() || []
  }

  getShuffledTetriminos() {

    const tetriminos = this.tetriminos.slice()
    const shuffledTetriminos = []

    for (let i = 0; i < this.tetriminos.length; i += 1) {

      const randomIndex = Math.floor(Math.random() * tetriminos.length)
      shuffledTetriminos.push(tetriminos.splice(randomIndex, 1)[0])
    }

    return shuffledTetriminos
  }

  fillBag() {
    this.bag = this.getShuffledTetriminos()
  }


  popTetriminoFromBag() {
    if (!this.getBagLength()) {
      throw new Error('Virtual Bag Empty.  Cannot pop from bag.')
    }
    return this.bag.pop()
  }

  getBagLength() {
    return this.bag.length
  }

}