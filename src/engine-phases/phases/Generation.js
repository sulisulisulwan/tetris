
import BasePhase from "./BasePhase.js";
import { NextQueue } from '../../next-queue/NextQueue.js'
import { TetriminoFactory } from '../../components/tetriminos/TetriminoFactory.js'
import { makeCopy } from "../../utils/utils.js";
export default class Generation extends BasePhase {

  constructor() {
    super()
    this.nextQueue = new NextQueue()
  }

  execute(stateData, setState) {
    console.log('>>> GENERATION PHASE')
    // Dequeue a new tetrimino and instantiate it.
    const tetriminoContext = this.nextQueue.dequeue()
    const newTetrimino = TetriminoFactory.getTetrimino(tetriminoContext)
    
    
    // Place dequeued tetrimino in playField
    const playField = makeCopy(stateData.playField)
    const startingOrientationCoords = newTetrimino.orientations[newTetrimino.currentOrientation].coordsOffOrigin

    startingOrientationCoords.forEach(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newTetrimino.currentOriginOnPlayfield
      playField[startingVertical + vertical][startingHorizontal + horizontal] = newTetrimino.minoGraphic
    })

    // Update swap status in case hold queue has been used
    let { swapStatus } = stateData.holdQueue
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }

    // Update state
    setState(prevState => ({ 
      playField,
      currentTetrimino: newTetrimino,
      currentGamePhase: 'falling',
      holdQueue: {
        ...prevState.holdQueue,
        swapStatus
      }
    }))
  }
}